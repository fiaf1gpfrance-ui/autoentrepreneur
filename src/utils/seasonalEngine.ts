// Seasonal & Economic Cycles Engine - 30+ seasonal features
import { EconomicWeather, Company, GameState } from '@/types/game';

// ==================== SEASONS & CYCLES ====================
export type Season = 'printemps' | 'ete' | 'automne' | 'hiver';
export type EconomicCycle = 'expansion' | 'pic' | 'contraction' | 'creux';
export type BusinessCycle = 'lancement' | 'croissance' | 'maturite' | 'declin' | 'renouveau';

export interface SeasonalModifiers {
  revenueMultiplier: number;
  expenseMultiplier: number;
  hiringDifficulty: number;
  clientAcquisition: number;
  productivityModifier: number;
  moralModifier: number;
  events: string[];
}

export interface EconomicIndicators {
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  consumerConfidence: number;
  interestRate: number;
  stockMarketIndex: number;
  realEstateIndex: number;
  currencyStrength: number;
}

export interface MarketTrend {
  name: string;
  sector: string;
  strength: number; // -100 to 100
  duration: number;
  startDate: number;
  description: string;
}

export interface Holiday {
  name: string;
  day: number;
  month: number;
  duration: number;
  effects: {
    productivity: number;
    moral: number;
    revenue: number;
    expenses: number;
  };
}

// ==================== SEASONAL DATA ====================
export const SEASONAL_MODIFIERS: Record<Season, SeasonalModifiers> = {
  printemps: {
    revenueMultiplier: 1.05,
    expenseMultiplier: 1.0,
    hiringDifficulty: 0.9,
    clientAcquisition: 1.1,
    productivityModifier: 5,
    moralModifier: 5,
    events: ['Salons professionnels', 'Renouvellement contrats', 'Recrutements'],
  },
  ete: {
    revenueMultiplier: 0.85,
    expenseMultiplier: 0.9,
    hiringDifficulty: 1.3,
    clientAcquisition: 0.7,
    productivityModifier: -10,
    moralModifier: 10,
    events: ['Vacances', 'Ralentissement activité', 'Maintenance'],
  },
  automne: {
    revenueMultiplier: 1.15,
    expenseMultiplier: 1.05,
    hiringDifficulty: 0.8,
    clientAcquisition: 1.2,
    productivityModifier: 10,
    moralModifier: -5,
    events: ['Rentrée', 'Budget annuel', 'Appels d\'offres'],
  },
  hiver: {
    revenueMultiplier: 0.95,
    expenseMultiplier: 1.1,
    hiringDifficulty: 1.1,
    clientAcquisition: 0.9,
    productivityModifier: 0,
    moralModifier: -10,
    events: ['Fêtes', 'Clôture annuelle', 'Bilans'],
  },
};

// ==================== FRENCH HOLIDAYS ====================
export const FRENCH_HOLIDAYS: Holiday[] = [
  { name: 'Jour de l\'an', day: 1, month: 1, duration: 1, effects: { productivity: -100, moral: 10, revenue: -50, expenses: 0 } },
  { name: 'Pâques', day: 1, month: 4, duration: 2, effects: { productivity: -30, moral: 5, revenue: -20, expenses: 0 } },
  { name: 'Fête du Travail', day: 1, month: 5, duration: 1, effects: { productivity: -100, moral: 5, revenue: -100, expenses: 0 } },
  { name: 'Victoire 1945', day: 8, month: 5, duration: 1, effects: { productivity: -100, moral: 0, revenue: -100, expenses: 0 } },
  { name: 'Ascension', day: 25, month: 5, duration: 1, effects: { productivity: -50, moral: 5, revenue: -30, expenses: 0 } },
  { name: 'Pentecôte', day: 5, month: 6, duration: 1, effects: { productivity: -30, moral: 3, revenue: -20, expenses: 0 } },
  { name: 'Fête Nationale', day: 14, month: 7, duration: 1, effects: { productivity: -100, moral: 10, revenue: -100, expenses: 0 } },
  { name: 'Assomption', day: 15, month: 8, duration: 1, effects: { productivity: -80, moral: 5, revenue: -50, expenses: 0 } },
  { name: 'Toussaint', day: 1, month: 11, duration: 1, effects: { productivity: -100, moral: -5, revenue: -100, expenses: 0 } },
  { name: 'Armistice', day: 11, month: 11, duration: 1, effects: { productivity: -100, moral: 0, revenue: -100, expenses: 0 } },
  { name: 'Noël', day: 25, month: 12, duration: 2, effects: { productivity: -100, moral: 15, revenue: -80, expenses: 20 } },
  { name: 'Saint Sylvestre', day: 31, month: 12, duration: 1, effects: { productivity: -100, moral: 10, revenue: -100, expenses: 0 } },
];

// ==================== MARKET TRENDS DATABASE ====================
export const MARKET_TRENDS: Omit<MarketTrend, 'startDate'>[] = [
  { name: 'Boom Tech', sector: 'tech', strength: 50, duration: 365, description: 'Forte demande en solutions technologiques' },
  { name: 'Transition Écologique', sector: 'all', strength: 30, duration: 730, description: 'Demande croissante pour des solutions durables' },
  { name: 'Digitalisation', sector: 'services', strength: 40, duration: 545, description: 'Accélération de la transformation digitale' },
  { name: 'Relocalisation', sector: 'industrie', strength: 25, duration: 365, description: 'Tendance au rapatriement de la production' },
  { name: 'E-commerce', sector: 'all', strength: 35, duration: 545, description: 'Croissance continue des ventes en ligne' },
  { name: 'Travail Hybride', sector: 'all', strength: 20, duration: 365, description: 'Nouvelle organisation du travail' },
  { name: 'Cybersécurité', sector: 'tech', strength: 45, duration: 365, description: 'Besoins accrus en protection des données' },
  { name: 'Bien-être au travail', sector: 'all', strength: 25, duration: 365, description: 'Focus sur la qualité de vie au travail' },
  { name: 'IA Générative', sector: 'tech', strength: 60, duration: 365, description: 'Révolution de l\'intelligence artificielle' },
  { name: 'Économie Circulaire', sector: 'industrie', strength: 30, duration: 545, description: 'Recyclage et réutilisation' },
  { name: 'Mobilité Durable', sector: 'industrie', strength: 35, duration: 545, description: 'Véhicules électriques et alternatifs' },
  { name: 'Santé Connectée', sector: 'tech', strength: 40, duration: 365, description: 'Objets connectés pour la santé' },
];

// ==================== ECONOMIC CYCLES ====================
export const ECONOMIC_CYCLE_EFFECTS: Record<EconomicCycle, EconomicIndicators> = {
  expansion: {
    gdpGrowth: 3.0,
    inflation: 2.5,
    unemployment: 6.0,
    consumerConfidence: 110,
    interestRate: 2.0,
    stockMarketIndex: 120,
    realEstateIndex: 115,
    currencyStrength: 105,
  },
  pic: {
    gdpGrowth: 1.5,
    inflation: 4.0,
    unemployment: 5.0,
    consumerConfidence: 115,
    interestRate: 3.5,
    stockMarketIndex: 130,
    realEstateIndex: 125,
    currencyStrength: 110,
  },
  contraction: {
    gdpGrowth: -1.0,
    inflation: 1.5,
    unemployment: 8.0,
    consumerConfidence: 85,
    interestRate: 1.5,
    stockMarketIndex: 90,
    realEstateIndex: 95,
    currencyStrength: 95,
  },
  creux: {
    gdpGrowth: -2.5,
    inflation: 0.5,
    unemployment: 10.0,
    consumerConfidence: 70,
    interestRate: 0.5,
    stockMarketIndex: 70,
    realEstateIndex: 80,
    currencyStrength: 90,
  },
};

// ==================== SEASONAL FUNCTIONS ====================

// Get current season
export function getCurrentSeason(month: number): Season {
  if (month >= 3 && month <= 5) return 'printemps';
  if (month >= 6 && month <= 8) return 'ete';
  if (month >= 9 && month <= 11) return 'automne';
  return 'hiver';
}

// Get seasonal modifiers
export function getSeasonalModifiers(month: number): SeasonalModifiers {
  return SEASONAL_MODIFIERS[getCurrentSeason(month)];
}

// Check for holiday
export function getHoliday(day: number, month: number): Holiday | null {
  return FRENCH_HOLIDAYS.find(h => h.day === day && h.month === month) || null;
}

// Calculate economic cycle
export function calculateEconomicCycle(state: GameState): EconomicCycle {
  const weatherToCycle: Record<EconomicWeather, EconomicCycle> = {
    croissance: 'expansion',
    stable: 'pic',
    recession: 'contraction',
    crise: 'creux',
  };
  return weatherToCycle[state.economicWeather];
}

// Get economic indicators
export function getEconomicIndicators(cycle: EconomicCycle): EconomicIndicators {
  const base = ECONOMIC_CYCLE_EFFECTS[cycle];
  // Add some randomness
  return {
    gdpGrowth: base.gdpGrowth + (Math.random() - 0.5) * 0.5,
    inflation: Math.max(0, base.inflation + (Math.random() - 0.5) * 1),
    unemployment: Math.max(3, base.unemployment + (Math.random() - 0.5) * 2),
    consumerConfidence: Math.max(50, Math.min(150, base.consumerConfidence + (Math.random() - 0.5) * 10)),
    interestRate: Math.max(0, base.interestRate + (Math.random() - 0.5) * 0.5),
    stockMarketIndex: Math.max(50, base.stockMarketIndex + (Math.random() - 0.5) * 10),
    realEstateIndex: Math.max(50, base.realEstateIndex + (Math.random() - 0.5) * 5),
    currencyStrength: Math.max(80, Math.min(120, base.currencyStrength + (Math.random() - 0.5) * 5)),
  };
}

// Generate market trend
export function generateMarketTrend(currentDay: number, companySector: string): MarketTrend {
  const relevantTrends = MARKET_TRENDS.filter(t => t.sector === companySector || t.sector === 'all');
  const trend = relevantTrends[Math.floor(Math.random() * relevantTrends.length)];
  return { ...trend, startDate: currentDay };
}

// Apply seasonal effects
export function applySeasonalEffects(
  company: Company,
  month: number,
  day: number
): { revenueModifier: number; expenseModifier: number; productivityModifier: number; moralModifier: number } {
  const season = getSeasonalModifiers(month);
  const holiday = getHoliday(day, month);
  
  let result = {
    revenueModifier: season.revenueMultiplier,
    expenseModifier: season.expenseMultiplier,
    productivityModifier: season.productivityModifier,
    moralModifier: season.moralModifier,
  };
  
  if (holiday) {
    result.revenueModifier *= (100 + holiday.effects.revenue) / 100;
    result.productivityModifier += holiday.effects.productivity;
    result.moralModifier += holiday.effects.moral;
    result.expenseModifier *= (100 + holiday.effects.expenses) / 100;
  }
  
  return result;
}

// Get business cycle phase
export function getBusinessCyclePhase(company: Company, state: GameState): BusinessCycle {
  const companyAge = state.day + (state.month - 1) * 30 + (state.year - 1) * 365 - (company.foundedDate || 0);
  const revenueGrowth = company.monthlyRevenue / Math.max(1, company.treasury) * 100;
  
  if (companyAge < 365) return 'lancement';
  if (revenueGrowth > 20) return 'croissance';
  if (revenueGrowth > 0 && revenueGrowth <= 20) return 'maturite';
  if (revenueGrowth < 0 && revenueGrowth > -20) return 'declin';
  return 'renouveau';
}

// Calculate hiring difficulty
export function calculateHiringDifficulty(month: number, economicCycle: EconomicCycle, employeeCount: number): number {
  const seasonal = getSeasonalModifiers(month).hiringDifficulty;
  const cycleModifier = economicCycle === 'creux' ? 0.7 : economicCycle === 'expansion' ? 1.3 : 1.0;
  const sizeModifier = employeeCount > 100 ? 0.9 : employeeCount > 50 ? 1.0 : 1.1;
  
  return seasonal * cycleModifier * sizeModifier;
}

// Get salary adjustment recommendation
export function getSalaryAdjustmentRecommendation(inflation: number, unemployment: number, marketPosition: number): number {
  // Inflation compensation
  let adjustment = inflation;
  
  // Labor market tension
  if (unemployment < 5) adjustment += 1.5;
  else if (unemployment > 9) adjustment -= 0.5;
  
  // Market position
  adjustment += (marketPosition - 50) / 50;
  
  return Math.max(0, Math.min(10, adjustment));
}

// Calculate revenue seasonality
export function calculateRevenueSeasonality(baseRevenue: number, month: number, sector: string): number {
  const season = getSeasonalModifiers(month);
  let sectorMultiplier = 1.0;
  
  // Sector-specific seasonality
  if (sector === 'tech') {
    sectorMultiplier = month === 12 ? 1.3 : month === 8 ? 0.7 : 1.0;
  } else if (sector === 'artisanat') {
    sectorMultiplier = (month === 11 || month === 12) ? 1.4 : month === 8 ? 0.5 : 1.0;
  } else if (sector === 'services') {
    sectorMultiplier = month === 8 ? 0.6 : 1.0;
  }
  
  return baseRevenue * season.revenueMultiplier * sectorMultiplier;
}

// Get quarter
export function getQuarter(month: number): number {
  return Math.ceil(month / 3);
}

// Check if end of quarter
export function isEndOfQuarter(month: number): boolean {
  return month % 3 === 0;
}

// Check if end of year
export function isEndOfYear(month: number): boolean {
  return month === 12;
}

// Get fiscal year end
export function getFiscalYearEnd(month: number): number {
  return month <= 3 ? month + 9 : month - 3;
}

// Calculate vacation period impact
export function calculateVacationImpact(month: number): number {
  if (month === 8) return 0.4; // August: 60% reduction
  if (month === 7) return 0.7; // July: 30% reduction
  if (month === 12) return 0.8; // December: 20% reduction
  return 1.0;
}

// Predict next quarter performance
export function predictNextQuarter(
  currentRevenue: number,
  currentMonth: number,
  economicIndicators: EconomicIndicators
): number {
  const nextQuarterMonths = [currentMonth + 1, currentMonth + 2, currentMonth + 3].map(m => ((m - 1) % 12) + 1);
  
  const avgSeasonalMultiplier = nextQuarterMonths.reduce((sum, m) => sum + getSeasonalModifiers(m).revenueMultiplier, 0) / 3;
  const economicEffect = (economicIndicators.consumerConfidence / 100) * (economicIndicators.gdpGrowth > 0 ? 1.1 : 0.9);
  
  return currentRevenue * avgSeasonalMultiplier * economicEffect;
}
