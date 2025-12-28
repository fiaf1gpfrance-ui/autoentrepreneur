// Currency Engine - Coins & Gems System with automatic gains

import { Company, GameState, ActiveBoost } from '@/types/game';

// ==================== CURRENCY GAINS ====================

// Daily automatic coin gains based on company performance
export function calculateDailyCoinGain(company: Company): number {
  let baseGain = 10;
  
  // Revenue bonus
  baseGain += Math.floor(company.monthlyRevenue / 1000);
  
  // Employee productivity bonus
  const avgMorale = company.employees.length > 0 
    ? company.employees.reduce((sum, e) => sum + e.moral, 0) / company.employees.length 
    : 50;
  baseGain += Math.floor(avgMorale / 10);
  
  // Reputation bonus
  baseGain += Math.floor(company.reputation / 10);
  
  // Product success bonus
  const successfulProducts = company.products.filter(p => p.salesVolume > 100).length;
  baseGain += successfulProducts * 5;
  
  // International presence bonus
  baseGain += company.foreignMarkets.length * 3;
  
  // Market share bonus
  baseGain += Math.floor(company.marketShare / 2);
  
  // Apply active boosts
  const coinBoost = company.activeBoosts.find(b => b.type === 'coins');
  if (coinBoost) {
    baseGain = Math.floor(baseGain * coinBoost.multiplier);
  }
  
  return baseGain;
}

// Weekly gem gains (gems are rarer)
export function calculateWeeklyGemGain(company: Company, gameState: GameState): number {
  let gems = 0;
  
  // Base weekly gem
  if (gameState.day % 7 === 0) {
    gems = 1;
  }
  
  // Achievement bonus
  const unlockedAchievements = company.achievements.filter(a => a.unlocked).length;
  if (unlockedAchievements >= 5) gems += 1;
  if (unlockedAchievements >= 15) gems += 1;
  if (unlockedAchievements >= 30) gems += 2;
  
  // Difficulty bonus
  if (gameState.difficulty === 'difficile') gems += 1;
  if (gameState.difficulty === 'hardcore') gems += 2;
  
  return gems;
}

// ==================== DAILY REWARDS ====================

export interface DailyReward {
  day: number;
  coins: number;
  gems: number;
  special?: string;
}

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, coins: 50, gems: 0 },
  { day: 2, coins: 75, gems: 0 },
  { day: 3, coins: 100, gems: 1 },
  { day: 4, coins: 125, gems: 0 },
  { day: 5, coins: 150, gems: 1 },
  { day: 6, coins: 200, gems: 1 },
  { day: 7, coins: 300, gems: 3, special: 'Bonus Semaine!' },
  { day: 8, coins: 100, gems: 0 },
  { day: 9, coins: 125, gems: 0 },
  { day: 10, coins: 150, gems: 1 },
  { day: 11, coins: 175, gems: 0 },
  { day: 12, coins: 200, gems: 1 },
  { day: 13, coins: 250, gems: 1 },
  { day: 14, coins: 500, gems: 5, special: 'Super Bonus 2 Semaines!' },
  { day: 15, coins: 150, gems: 0 },
  { day: 16, coins: 175, gems: 1 },
  { day: 17, coins: 200, gems: 0 },
  { day: 18, coins: 225, gems: 1 },
  { day: 19, coins: 250, gems: 1 },
  { day: 20, coins: 300, gems: 2 },
  { day: 21, coins: 400, gems: 3, special: 'Bonus 3 Semaines!' },
  { day: 22, coins: 200, gems: 1 },
  { day: 23, coins: 225, gems: 1 },
  { day: 24, coins: 250, gems: 1 },
  { day: 25, coins: 275, gems: 1 },
  { day: 26, coins: 300, gems: 2 },
  { day: 27, coins: 350, gems: 2 },
  { day: 28, coins: 500, gems: 5, special: 'Bonus 4 Semaines!' },
  { day: 29, coins: 250, gems: 1 },
  { day: 30, coins: 1000, gems: 10, special: 'Méga Bonus Mensuel!' },
];

export function getDailyReward(streakDay: number): DailyReward {
  const index = (streakDay - 1) % DAILY_REWARDS.length;
  return DAILY_REWARDS[index];
}

export function canClaimDailyReward(company: Company, currentDay: number): boolean {
  return company.lastDailyReward < currentDay;
}

export function claimDailyReward(company: Company, currentDay: number): { 
  coins: number; 
  gems: number; 
  streak: number;
  special?: string;
} {
  const newStreak = company.lastDailyReward === currentDay - 1 
    ? company.dailyRewardStreak + 1 
    : 1;
  
  const reward = getDailyReward(newStreak);
  
  // Streak bonus multiplier
  const streakMultiplier = 1 + Math.floor(newStreak / 7) * 0.1; // +10% per week
  
  return {
    coins: Math.floor(reward.coins * streakMultiplier),
    gems: reward.gems,
    streak: newStreak,
    special: reward.special,
  };
}

// ==================== MILESTONE REWARDS ====================

export interface MilestoneReward {
  id: string;
  name: string;
  description: string;
  requirement: (company: Company, stats: any) => boolean;
  coins: number;
  gems: number;
  claimed: boolean;
}

export function getMilestoneRewards(): MilestoneReward[] {
  return [
    { id: 'first_employee', name: 'Premier Employé', description: 'Embauchez votre premier employé', requirement: (c) => c.employees.length >= 1, coins: 100, gems: 5, claimed: false },
    { id: 'team_of_5', name: 'Équipe de 5', description: 'Atteignez 5 employés', requirement: (c) => c.employees.length >= 5, coins: 250, gems: 10, claimed: false },
    { id: 'team_of_10', name: 'Grande Équipe', description: 'Atteignez 10 employés', requirement: (c) => c.employees.length >= 10, coins: 500, gems: 20, claimed: false },
    { id: 'team_of_25', name: 'PME', description: 'Atteignez 25 employés', requirement: (c) => c.employees.length >= 25, coins: 1000, gems: 50, claimed: false },
    { id: 'first_product', name: 'Premier Lancement', description: 'Lancez un produit', requirement: (c) => c.products.some(p => p.phase === 'lancement'), coins: 150, gems: 5, claimed: false },
    { id: 'product_success', name: 'Produit Star', description: '1000 ventes sur un produit', requirement: (c) => c.products.some(p => p.salesVolume >= 1000), coins: 300, gems: 15, claimed: false },
    { id: 'revenue_10k', name: 'CA 10K', description: 'Atteignez 10 000€ de CA mensuel', requirement: (c) => c.monthlyRevenue >= 10000, coins: 200, gems: 10, claimed: false },
    { id: 'revenue_50k', name: 'CA 50K', description: 'Atteignez 50 000€ de CA mensuel', requirement: (c) => c.monthlyRevenue >= 50000, coins: 500, gems: 25, claimed: false },
    { id: 'revenue_100k', name: 'CA 100K', description: 'Atteignez 100 000€ de CA mensuel', requirement: (c) => c.monthlyRevenue >= 100000, coins: 1000, gems: 50, claimed: false },
    { id: 'treasury_100k', name: 'Trésorerie 100K', description: 'Accumulez 100 000€ de trésorerie', requirement: (c) => c.treasury >= 100000, coins: 500, gems: 25, claimed: false },
    { id: 'treasury_1m', name: 'Millionnaire', description: 'Atteignez 1 000 000€ de trésorerie', requirement: (c) => c.treasury >= 1000000, coins: 2000, gems: 100, claimed: false },
    { id: 'first_international', name: 'À l\'Export', description: 'Ouvrez un marché étranger', requirement: (c) => c.foreignMarkets.length >= 1, coins: 300, gems: 15, claimed: false },
    { id: 'global_presence', name: 'Présence Mondiale', description: 'Présent dans 5 pays', requirement: (c) => c.foreignMarkets.length >= 5, coins: 1000, gems: 50, claimed: false },
    { id: 'reputation_80', name: 'Excellente Réputation', description: 'Réputation au-dessus de 80', requirement: (c) => c.reputation >= 80, coins: 400, gems: 20, claimed: false },
    { id: 'market_leader', name: 'Leader du Marché', description: 'Part de marché de 25%', requirement: (c) => c.marketShare >= 25, coins: 1500, gems: 75, claimed: false },
    { id: 'tech_pioneer', name: 'Pionnier Tech', description: 'Débloquez 5 technologies', requirement: (c) => c.technologies.filter(t => t.unlocked).length >= 5, coins: 500, gems: 25, claimed: false },
    { id: 'crisis_survivor', name: 'Survivant', description: 'Résolvez 3 crises', requirement: (c) => c.resolvedCrises.length >= 3, coins: 300, gems: 15, claimed: false },
    { id: 'crisis_master', name: 'Maître des Crises', description: 'Résolvez 10 crises', requirement: (c) => c.resolvedCrises.length >= 10, coins: 750, gems: 35, claimed: false },
    { id: 'achievement_10', name: 'Collectionneur', description: 'Débloquez 10 trophées', requirement: (c) => c.achievements.filter(a => a.unlocked).length >= 10, coins: 400, gems: 20, claimed: false },
    { id: 'achievement_25', name: 'Chasseur de Trophées', description: 'Débloquez 25 trophées', requirement: (c) => c.achievements.filter(a => a.unlocked).length >= 25, coins: 1000, gems: 50, claimed: false },
  ];
}

// ==================== BOOST MANAGEMENT ====================

export function applyBoost(
  company: Company, 
  itemId: string, 
  boostType: ActiveBoost['type'],
  multiplier: number,
  duration: number,
  currentDay: number
): ActiveBoost {
  return {
    id: `boost_${Date.now()}`,
    itemId,
    name: getBoostName(boostType),
    type: boostType,
    multiplier,
    expiresAt: currentDay + duration,
  };
}

function getBoostName(type: ActiveBoost['type']): string {
  const names: Record<ActiveBoost['type'], string> = {
    revenue: 'Boost Revenus',
    reputation: 'Boost Réputation',
    productivity: 'Boost Productivité',
    xp: 'Boost XP',
    coins: 'Boost Pièces',
  };
  return names[type];
}

export function cleanExpiredBoosts(company: Company, currentDay: number): ActiveBoost[] {
  return company.activeBoosts.filter(boost => boost.expiresAt > currentDay);
}

export function getActiveBoostMultiplier(company: Company, type: ActiveBoost['type']): number {
  const boost = company.activeBoosts.find(b => b.type === type);
  return boost ? boost.multiplier : 1;
}

// ==================== SPECIAL EVENTS ====================

export interface CurrencyEvent {
  id: string;
  name: string;
  description: string;
  coinsMultiplier: number;
  gemsMultiplier: number;
  duration: number; // days
  startDay: number;
  active: boolean;
}

export function getActiveEvents(currentDay: number): CurrencyEvent[] {
  const events: CurrencyEvent[] = [];
  
  // Weekend bonus (every 5-7 days for simplicity)
  if (currentDay % 7 >= 5) {
    events.push({
      id: 'weekend_bonus',
      name: 'Bonus Weekend',
      description: 'Double pièces pendant le weekend!',
      coinsMultiplier: 2,
      gemsMultiplier: 1,
      duration: 2,
      startDay: currentDay,
      active: true,
    });
  }
  
  // Monthly bonus (first 3 days of each month)
  if (currentDay % 30 <= 3) {
    events.push({
      id: 'monthly_start',
      name: 'Nouveau Mois',
      description: 'Bonus spécial début de mois!',
      coinsMultiplier: 1.5,
      gemsMultiplier: 1.5,
      duration: 3,
      startDay: currentDay,
      active: true,
    });
  }
  
  return events;
}

// ==================== SPENDING TRACKING ====================

export interface SpendingRecord {
  id: string;
  itemId: string;
  itemName: string;
  cost: number;
  currency: 'coins' | 'gems';
  day: number;
}

export function recordPurchase(
  itemId: string,
  itemName: string,
  cost: number,
  currency: 'coins' | 'gems',
  currentDay: number
): SpendingRecord {
  return {
    id: `spend_${Date.now()}`,
    itemId,
    itemName,
    cost,
    currency,
    day: currentDay,
  };
}

// ==================== CURRENCY CONVERSION ====================

export const GEMS_TO_COINS_RATE = 100; // 1 gem = 100 coins

export function convertGemsToCoin(gems: number): number {
  return gems * GEMS_TO_COINS_RATE;
}

// Note: coins cannot be converted to gems (gems are premium)

// ==================== SUMMARY HELPERS ====================

export function getCurrencyStats(company: Company, gameState: GameState): {
  dailyCoinGain: number;
  weeklyGemGain: number;
  activeBoostsCount: number;
  totalCoinsEarned: number;
  totalGemsEarned: number;
  streak: number;
} {
  return {
    dailyCoinGain: calculateDailyCoinGain(company),
    weeklyGemGain: calculateWeeklyGemGain(company, gameState),
    activeBoostsCount: company.activeBoosts.length,
    totalCoinsEarned: company.coins, // In real app, track separately
    totalGemsEarned: company.gems,
    streak: company.dailyRewardStreak,
  };
}
