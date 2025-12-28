// ============================================
// PROGRESSION & PRESTIGE ENGINE - 100+ Features
// ============================================

import {
  SkillTree,
  Skill,
  SkillEffect,
  PrestigeLevel,
  Quest,
  QuestObjective,
  QuestReward,
  Leaderboard,
  LeaderboardEntry,
  Challenge,
  ChallengeCondition,
  UnlockableContent,
  DailyReward,
  SeasonPass,
  PlayerStats,
  RankTier,
  SkillTreeCategory,
  QuestDifficulty,
} from '@/types/advancedFeatures';

// ==================== SKILL TREES (Features 1-30) ====================
export function initializeSkillTrees(): SkillTree[] {
  return [
    createSkillTree('management', 'Leadership & Management', generateManagementSkills()),
    createSkillTree('finance', 'Finance & Investissement', generateFinanceSkills()),
    createSkillTree('marketing', 'Marketing & Ventes', generateMarketingSkills()),
    createSkillTree('operations', 'Opérations & Production', generateOperationsSkills()),
    createSkillTree('technology', 'Technologie & Innovation', generateTechnologySkills()),
    createSkillTree('hr', 'Ressources Humaines', generateHRSkills()),
    createSkillTree('international', 'Expansion Internationale', generateInternationalSkills()),
  ];
}

function createSkillTree(category: SkillTreeCategory, name: string, skills: Skill[]): SkillTree {
  return {
    id: `tree_${category}`,
    category,
    name,
    skills,
    totalPoints: 0,
    unlockedSkills: 0,
  };
}

function generateManagementSkills(): Skill[] {
  return [
    createSkill('mgmt_1', 'Vision Stratégique', 'Améliore la planification à long terme', 1, 1, [], { type: 'reputation_bonus', value: 5 }),
    createSkill('mgmt_2', 'Leadership Inspirant', '+10% moral employés', 1, 2, [], { type: 'moral_bonus', value: 10 }),
    createSkill('mgmt_3', 'Délégation Efficace', 'Réduit la charge de gestion', 2, 3, ['mgmt_1'], { type: 'productivity_bonus', value: 8 }),
    createSkill('mgmt_4', 'Gestion de Crise', 'Réduit l\'impact des crises de 20%', 2, 4, ['mgmt_2'], { type: 'crisis_resistance', value: 20 }),
    createSkill('mgmt_5', 'Négociation Avancée', 'Meilleurs deals fournisseurs/clients', 3, 5, ['mgmt_3'], { type: 'negotiation_bonus', value: 15 }),
    createSkill('mgmt_6', 'Culture d\'Excellence', '+15% qualité globale', 3, 6, ['mgmt_4', 'mgmt_5'], { type: 'quality_bonus', value: 15 }),
    createSkill('mgmt_7', 'CEO Visionnaire', 'Débloque événements spéciaux', 4, 10, ['mgmt_6'], { type: 'unlock_events', value: 1 }),
  ];
}

function generateFinanceSkills(): Skill[] {
  return [
    createSkill('fin_1', 'Gestion de Trésorerie', 'Réduit les frais bancaires de 10%', 1, 1, [], { type: 'bank_fees_reduction', value: 10 }),
    createSkill('fin_2', 'Analyse Financière', 'Meilleures décisions d\'investissement', 1, 2, [], { type: 'investment_bonus', value: 8 }),
    createSkill('fin_3', 'Optimisation Fiscale', 'Réduit les impôts de 5%', 2, 3, ['fin_1'], { type: 'tax_reduction', value: 5 }),
    createSkill('fin_4', 'Levée de Fonds', 'Accès à plus d\'investisseurs', 2, 4, ['fin_2'], { type: 'investor_access', value: 1 }),
    createSkill('fin_5', 'Trading Avancé', '+20% rendements placements', 3, 5, ['fin_3'], { type: 'trading_bonus', value: 20 }),
    createSkill('fin_6', 'M&A Expert', 'Réduit coûts d\'acquisition de 15%', 3, 6, ['fin_4'], { type: 'acquisition_discount', value: 15 }),
    createSkill('fin_7', 'Maître des Finances', 'Débloque crypto et dérivés', 4, 10, ['fin_5', 'fin_6'], { type: 'unlock_advanced_finance', value: 1 }),
  ];
}

function generateMarketingSkills(): Skill[] {
  return [
    createSkill('mkt_1', 'Branding Efficace', '+10% notoriété', 1, 1, [], { type: 'brand_awareness', value: 10 }),
    createSkill('mkt_2', 'Marketing Digital', 'Réduit coûts campagnes de 15%', 1, 2, [], { type: 'campaign_cost_reduction', value: 15 }),
    createSkill('mkt_3', 'Content Marketing', '+20% engagement', 2, 3, ['mkt_1'], { type: 'engagement_bonus', value: 20 }),
    createSkill('mkt_4', 'SEO Mastery', '+30% trafic organique', 2, 4, ['mkt_2'], { type: 'organic_traffic', value: 30 }),
    createSkill('mkt_5', 'Influence Marketing', 'Accès aux influenceurs premium', 3, 5, ['mkt_3'], { type: 'influencer_access', value: 1 }),
    createSkill('mkt_6', 'Growth Hacking', '+25% conversion', 3, 6, ['mkt_4'], { type: 'conversion_bonus', value: 25 }),
    createSkill('mkt_7', 'CMO Légendaire', 'Double l\'effet des campagnes', 4, 10, ['mkt_5', 'mkt_6'], { type: 'campaign_multiplier', value: 2 }),
  ];
}

function generateOperationsSkills(): Skill[] {
  return [
    createSkill('ops_1', 'Lean Management', '+10% efficacité production', 1, 1, [], { type: 'production_efficiency', value: 10 }),
    createSkill('ops_2', 'Supply Chain Optimisée', 'Réduit coûts logistiques de 12%', 1, 2, [], { type: 'logistics_cost_reduction', value: 12 }),
    createSkill('ops_3', 'Qualité Totale', 'Réduit défauts de 25%', 2, 3, ['ops_1'], { type: 'defect_reduction', value: 25 }),
    createSkill('ops_4', 'Automatisation', '+15% capacité production', 2, 4, ['ops_2'], { type: 'capacity_bonus', value: 15 }),
    createSkill('ops_5', 'Six Sigma', 'Débloque certifications premium', 3, 5, ['ops_3'], { type: 'certification_access', value: 1 }),
    createSkill('ops_6', 'Just-in-Time', 'Réduit stock de 30%', 3, 6, ['ops_4'], { type: 'inventory_reduction', value: 30 }),
    createSkill('ops_7', 'COO Excellence', 'Production sans défaut possible', 4, 10, ['ops_5', 'ops_6'], { type: 'zero_defect', value: 1 }),
  ];
}

function generateTechnologySkills(): Skill[] {
  return [
    createSkill('tech_1', 'Veille Technologique', '+15% vitesse R&D', 1, 1, [], { type: 'rd_speed', value: 15 }),
    createSkill('tech_2', 'Innovation Ouverte', 'Accès aux partenariats tech', 1, 2, [], { type: 'tech_partnership', value: 1 }),
    createSkill('tech_3', 'Brevets Stratégiques', '+20% valeur IP', 2, 3, ['tech_1'], { type: 'ip_value', value: 20 }),
    createSkill('tech_4', 'IA & Automatisation', 'Débloque IA pour production', 2, 4, ['tech_2'], { type: 'ai_production', value: 1 }),
    createSkill('tech_5', 'Tech Disruptive', 'Chance de percée technologique', 3, 5, ['tech_3'], { type: 'breakthrough_chance', value: 10 }),
    createSkill('tech_6', 'Cybersécurité', 'Protection contre les cybercrises', 3, 6, ['tech_4'], { type: 'cyber_protection', value: 50 }),
    createSkill('tech_7', 'CTO Visionnaire', 'Double les effets R&D', 4, 10, ['tech_5', 'tech_6'], { type: 'rd_multiplier', value: 2 }),
  ];
}

function generateHRSkills(): Skill[] {
  return [
    createSkill('hr_1', 'Recrutement Efficace', 'Réduit coûts recrutement de 20%', 1, 1, [], { type: 'recruitment_cost_reduction', value: 20 }),
    createSkill('hr_2', 'Rétention Talents', 'Réduit turnover de 25%', 1, 2, [], { type: 'turnover_reduction', value: 25 }),
    createSkill('hr_3', 'Formation Continue', '+15% montée en compétences', 2, 3, ['hr_1'], { type: 'skill_gain', value: 15 }),
    createSkill('hr_4', 'Culture d\'Entreprise', '+20% moral global', 2, 4, ['hr_2'], { type: 'moral_global', value: 20 }),
    createSkill('hr_5', 'Diversité & Inclusion', 'Bonus réputation et innovation', 3, 5, ['hr_3'], { type: 'diversity_bonus', value: 15 }),
    createSkill('hr_6', 'Bien-être au Travail', 'Réduit absentéisme de 30%', 3, 6, ['hr_4'], { type: 'absenteeism_reduction', value: 30 }),
    createSkill('hr_7', 'CHRO Exemplaire', 'Employés légendaires possibles', 4, 10, ['hr_5', 'hr_6'], { type: 'legendary_employees', value: 1 }),
  ];
}

function generateInternationalSkills(): Skill[] {
  return [
    createSkill('intl_1', 'Export Maîtrisé', 'Réduit barrières douanières de 15%', 1, 1, [], { type: 'customs_reduction', value: 15 }),
    createSkill('intl_2', 'Négociation Interculturelle', 'Meilleurs partenaires locaux', 1, 2, [], { type: 'partner_quality', value: 20 }),
    createSkill('intl_3', 'Gestion Devises', 'Réduit coûts de change de 20%', 2, 3, ['intl_1'], { type: 'forex_cost_reduction', value: 20 }),
    createSkill('intl_4', 'Implantation Locale', 'Accélère setup filiales de 25%', 2, 4, ['intl_2'], { type: 'subsidiary_speed', value: 25 }),
    createSkill('intl_5', 'Optimisation Fiscale Mondiale', 'Réduit impôts internationaux de 10%', 3, 5, ['intl_3'], { type: 'intl_tax_reduction', value: 10 }),
    createSkill('intl_6', 'Réseau Global', 'Accès marchés premium', 3, 6, ['intl_4'], { type: 'premium_markets', value: 1 }),
    createSkill('intl_7', 'Tycoon International', 'Tous les marchés débloqués', 4, 10, ['intl_5', 'intl_6'], { type: 'all_markets', value: 1 }),
  ];
}

function createSkill(id: string, name: string, description: string, tier: number, cost: number, prerequisites: string[], effect: SkillEffect): Skill {
  return { id, name, description, tier, cost, unlocked: false, prerequisites, effect, icon: '⭐' };
}

export function unlockSkill(trees: SkillTree[], treeId: string, skillId: string, availablePoints: number): { trees: SkillTree[]; success: boolean; pointsUsed: number } {
  const tree = trees.find(t => t.id === treeId);
  if (!tree) return { trees, success: false, pointsUsed: 0 };
  
  const skill = tree.skills.find(s => s.id === skillId);
  if (!skill || skill.unlocked || skill.cost > availablePoints) return { trees, success: false, pointsUsed: 0 };
  
  const prereqsMet = skill.prerequisites.every(prereq => tree.skills.find(s => s.id === prereq)?.unlocked);
  if (!prereqsMet) return { trees, success: false, pointsUsed: 0 };
  
  return {
    trees: trees.map(t => t.id === treeId ? {
      ...t,
      skills: t.skills.map(s => s.id === skillId ? { ...s, unlocked: true } : s),
      totalPoints: t.totalPoints + skill.cost,
      unlockedSkills: t.unlockedSkills + 1,
    } : t),
    success: true,
    pointsUsed: skill.cost,
  };
}

export function getActiveEffects(trees: SkillTree[]): SkillEffect[] {
  return trees.flatMap(t => t.skills.filter(s => s.unlocked).map(s => s.effect));
}

// ==================== PRESTIGE SYSTEM (Features 31-45) ====================
export function getPrestigeLevels(): PrestigeLevel[] {
  return [
    { level: 1, name: 'Entrepreneur Débutant', pointsRequired: 0, permanentBonuses: [], unlocks: ['Base game'], icon: '🌱' },
    { level: 2, name: 'Chef d\'Entreprise', pointsRequired: 1000, permanentBonuses: [{ type: 'revenue', value: 5, description: '+5% revenus' }], unlocks: ['Nouveaux secteurs'], icon: '🌿' },
    { level: 3, name: 'Directeur Accompli', pointsRequired: 5000, permanentBonuses: [{ type: 'revenue', value: 10, description: '+10% revenus' }, { type: 'reputation', value: 5, description: '+5% réputation' }], unlocks: ['Marchés internationaux'], icon: '🌳' },
    { level: 4, name: 'Mogul Industriel', pointsRequired: 15000, permanentBonuses: [{ type: 'revenue', value: 15, description: '+15% revenus' }, { type: 'productivity', value: 10, description: '+10% productivité' }], unlocks: ['M&A avancé'], icon: '🏭' },
    { level: 5, name: 'Tycoon', pointsRequired: 50000, permanentBonuses: [{ type: 'revenue', value: 20, description: '+20% revenus' }, { type: 'reputation', value: 10, description: '+10% réputation' }, { type: 'luck', value: 5, description: '+5% chance' }], unlocks: ['Événements légendaires'], icon: '👑' },
    { level: 6, name: 'Légende du Business', pointsRequired: 150000, permanentBonuses: [{ type: 'revenue', value: 30, description: '+30% revenus' }, { type: 'innovation', value: 20, description: '+20% innovation' }], unlocks: ['Mode sandbox'], icon: '🌟' },
    { level: 7, name: 'Maître Absolu', pointsRequired: 500000, permanentBonuses: [{ type: 'revenue', value: 50, description: '+50% revenus' }, { type: 'productivity', value: 25, description: '+25% productivité' }, { type: 'luck', value: 10, description: '+10% chance' }], unlocks: ['Tout débloqué'], icon: '💎' },
  ];
}

export function calculatePrestigePoints(stats: PlayerStats): number {
  return Math.floor(
    (stats.totalRevenue / 10000) +
    (stats.totalProfit / 5000) +
    (stats.employeesHired * 10) +
    (stats.productsLaunched * 100) +
    (stats.countriesExpanded * 500) +
    (stats.achievementsUnlocked * 200) +
    (stats.questsCompleted * 50)
  );
}

export function getPrestigeLevel(points: number, levels: PrestigeLevel[]): PrestigeLevel {
  return [...levels].reverse().find(l => points >= l.pointsRequired) || levels[0];
}

export function prestigeReset(currentStats: PlayerStats): { newStats: PlayerStats; bonusPoints: number } {
  const bonusPoints = calculatePrestigePoints(currentStats);
  return {
    newStats: {
      ...currentStats,
      totalPlayTime: currentStats.totalPlayTime,
      companiesCreated: currentStats.companiesCreated + 1,
      totalRevenue: 0,
      totalProfit: 0,
      employeesHired: 0,
      productsLaunched: 0,
      countriesExpanded: 0,
      achievementsUnlocked: currentStats.achievementsUnlocked,
      questsCompleted: 0,
      prestigeResets: currentStats.prestigeResets + 1,
      highestValuation: Math.max(currentStats.highestValuation, 0),
    },
    bonusPoints,
  };
}

// ==================== QUESTS SYSTEM (Features 46-65) ====================
export function generateDailyQuests(day: number): Quest[] {
  const templates = [
    { title: 'Recrutement Express', description: 'Embauchez 2 employés', difficulty: 'easy' as QuestDifficulty, objType: 'hire', target: 2 },
    { title: 'Chiffre d\'Affaires', description: 'Gagnez 50,000€', difficulty: 'easy' as QuestDifficulty, objType: 'revenue', target: 50000 },
    { title: 'Marketing Blitz', description: 'Lancez 3 campagnes', difficulty: 'medium' as QuestDifficulty, objType: 'campaigns', target: 3 },
    { title: 'R&D Focus', description: 'Complétez une recherche', difficulty: 'medium' as QuestDifficulty, objType: 'research', target: 1 },
    { title: 'Expansion', description: 'Entrez sur un nouveau marché', difficulty: 'hard' as QuestDifficulty, objType: 'markets', target: 1 },
  ];
  
  return templates.slice(0, 3).map((t, i) => ({
    id: `daily_${day}_${i}`,
    title: t.title,
    description: t.description,
    difficulty: t.difficulty,
    type: 'daily' as const,
    objectives: [{ id: `obj_${i}_0`, description: t.description, type: t.objType, target: t.target, current: 0, completed: false }],
    rewards: generateQuestReward(t.difficulty),
    deadline: day + 1,
    startDate: day,
    completed: false,
    failed: false,
    progress: 0,
  }));
}

export function generateWeeklyQuests(week: number): Quest[] {
  const templates = [
    { title: 'Croissance Soutenue', description: 'Augmentez le CA de 20%', difficulty: 'medium' as QuestDifficulty, objType: 'revenue_growth', target: 20 },
    { title: 'Empire RH', description: 'Ayez 10 employés satisfaits', difficulty: 'medium' as QuestDifficulty, objType: 'happy_employees', target: 10 },
    { title: 'Diversification', description: 'Lancez 2 nouveaux produits', difficulty: 'hard' as QuestDifficulty, objType: 'products', target: 2 },
    { title: 'Conquête Mondiale', description: 'Opérez dans 3 pays', difficulty: 'hard' as QuestDifficulty, objType: 'countries', target: 3 },
    { title: 'Fortune', description: 'Atteignez 1M€ de trésorerie', difficulty: 'legendary' as QuestDifficulty, objType: 'treasury', target: 1000000 },
  ];
  
  return templates.slice(0, 2).map((t, i) => ({
    id: `weekly_${week}_${i}`,
    title: t.title,
    description: t.description,
    difficulty: t.difficulty,
    type: 'weekly' as const,
    objectives: [{ id: `obj_${i}_0`, description: t.description, type: t.objType, target: t.target, current: 0, completed: false }],
    rewards: generateQuestReward(t.difficulty, 3),
    deadline: week * 7 + 7,
    startDate: week * 7,
    completed: false,
    failed: false,
    progress: 0,
  }));
}

export function generateStoryQuests(): Quest[] {
  return [
    createStoryQuest('story_1', 'Premiers Pas', 'Lancez votre première entreprise', 'easy', [{ type: 'company_created', target: 1 }]),
    createStoryQuest('story_2', 'Équipe Fondatrice', 'Recrutez vos 5 premiers employés', 'easy', [{ type: 'employees', target: 5 }]),
    createStoryQuest('story_3', 'Premier Million', 'Atteignez 1M€ de CA cumulé', 'medium', [{ type: 'cumulative_revenue', target: 1000000 }]),
    createStoryQuest('story_4', 'Internationalisation', 'Exportez vos produits', 'medium', [{ type: 'export', target: 1 }]),
    createStoryQuest('story_5', 'Corporation', 'Passez en SAS ou SA', 'medium', [{ type: 'legal_status', target: 1 }]),
    createStoryQuest('story_6', 'Conglomérat', 'Gérez 5 produits rentables', 'hard', [{ type: 'profitable_products', target: 5 }]),
    createStoryQuest('story_7', 'Empire Global', 'Opérez dans 5 pays', 'hard', [{ type: 'countries', target: 5 }]),
    createStoryQuest('story_8', 'Licorne', 'Atteignez 1Md€ de valorisation', 'legendary', [{ type: 'valuation', target: 1000000000 }]),
  ];
}

function createStoryQuest(id: string, title: string, description: string, difficulty: QuestDifficulty, objectives: any[]): Quest {
  return {
    id,
    title,
    description,
    difficulty,
    type: 'story',
    objectives: objectives.map((o, i) => ({ id: `${id}_obj_${i}`, description, ...o, current: 0, completed: false })),
    rewards: generateQuestReward(difficulty, 5),
    startDate: 0,
    completed: false,
    failed: false,
    progress: 0,
  };
}

function generateQuestReward(difficulty: QuestDifficulty, multiplier: number = 1): QuestReward {
  const base: Record<QuestDifficulty, QuestReward> = {
    easy: { xp: 100, money: 5000, skillPoints: 1 },
    medium: { xp: 300, money: 15000, skillPoints: 2 },
    hard: { xp: 800, money: 50000, skillPoints: 5, prestigePoints: 100 },
    legendary: { xp: 2500, money: 200000, skillPoints: 15, prestigePoints: 500 },
  };
  const reward = base[difficulty];
  return {
    xp: reward.xp * multiplier,
    money: reward.money ? reward.money * multiplier : undefined,
    skillPoints: reward.skillPoints ? reward.skillPoints * multiplier : undefined,
    prestigePoints: reward.prestigePoints ? reward.prestigePoints * multiplier : undefined,
  };
}

export function updateQuestProgress(quest: Quest, type: string, value: number): Quest {
  const updatedObjectives = quest.objectives.map(obj => {
    if (obj.type === type) {
      const newCurrent = obj.current + value;
      return { ...obj, current: newCurrent, completed: newCurrent >= obj.target };
    }
    return obj;
  });
  
  const progress = updatedObjectives.reduce((sum, o) => sum + (o.current / o.target), 0) / updatedObjectives.length * 100;
  const completed = updatedObjectives.every(o => o.completed);
  
  return { ...quest, objectives: updatedObjectives, progress: Math.min(100, progress), completed };
}

export function checkQuestDeadlines(quests: Quest[], currentDay: number): Quest[] {
  return quests.map(q => {
    if (q.deadline && currentDay > q.deadline && !q.completed) {
      return { ...q, failed: true };
    }
    return q;
  });
}

// ==================== LEADERBOARDS (Features 66-75) ====================
export function createLeaderboard(type: Leaderboard['type'], period: Leaderboard['period']): Leaderboard {
  const names = ['AlphaStartup', 'BetaCorp', 'GammaVentures', 'DeltaIndustries', 'EpsilonTech', 'ZetaHoldings', 'EtaGroup', 'ThetaSolutions'];
  return {
    id: `lb_${type}_${period}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${period}`,
    type,
    period,
    entries: names.map((name, i) => ({
      rank: i + 1,
      playerId: `player_${i}`,
      playerName: `Player${i + 1}`,
      companyName: name,
      score: Math.floor(1000000 / (i + 1) + Math.random() * 100000),
      change: Math.floor(Math.random() * 5) - 2,
      tier: getTierForRank(i + 1),
    })),
    lastUpdate: Date.now(),
  };
}

function getTierForRank(rank: number): RankTier {
  if (rank === 1) return 'legend';
  if (rank <= 3) return 'diamond';
  if (rank <= 10) return 'platinum';
  if (rank <= 25) return 'gold';
  if (rank <= 50) return 'silver';
  return 'bronze';
}

export function updateLeaderboardPosition(leaderboard: Leaderboard, playerId: string, newScore: number): Leaderboard {
  const entries = [...leaderboard.entries];
  const playerIndex = entries.findIndex(e => e.playerId === playerId);
  
  if (playerIndex >= 0) {
    const oldRank = entries[playerIndex].rank;
    entries[playerIndex].score = newScore;
    entries.sort((a, b) => b.score - a.score);
    entries.forEach((e, i) => {
      if (e.playerId === playerId) {
        e.change = oldRank - (i + 1);
      }
      e.rank = i + 1;
      e.tier = getTierForRank(i + 1);
    });
  }
  
  return { ...leaderboard, entries, lastUpdate: Date.now() };
}

// ==================== CHALLENGES (Features 76-85) ====================
export function getAvailableChallenges(): Challenge[] {
  return [
    createChallenge('ch_1', 'Bootstrap', 'Atteignez 100K€ sans emprunt', 'medium', [{ type: 'treasury', operator: 'gte', value: 100000 }], [{ type: 'loan', operator: 'eq', value: 0 }]),
    createChallenge('ch_2', 'Speedrun', 'Atteignez 1M€ CA en 1 an', 'hard', [{ type: 'revenue', operator: 'gte', value: 1000000 }], [], 365),
    createChallenge('ch_3', 'Solo Founder', 'Gardez moins de 5 employés mais 500K€ CA', 'hard', [{ type: 'revenue', operator: 'gte', value: 500000 }], [{ type: 'employees', operator: 'lte', value: 5 }]),
    createChallenge('ch_4', 'Survivant', 'Survivez 5 crises majeures', 'hard', [{ type: 'crises_survived', operator: 'gte', value: 5 }], []),
    createChallenge('ch_5', 'Parfait', '100% satisfaction employés et clients', 'legendary', [{ type: 'satisfaction', operator: 'eq', value: 100 }], []),
  ];
}

function createChallenge(id: string, name: string, description: string, difficulty: QuestDifficulty, victory: any[], constraints: any[], timeLimit?: number): Challenge {
  return {
    id,
    name,
    description,
    rules: constraints.map(c => `${c.type} ${c.operator} ${c.value}`),
    startingConditions: [],
    victoryConditions: victory.map((v, i) => ({ ...v, target: `target_${i}` })) as ChallengeCondition[],
    failureConditions: constraints.map((c, i) => ({ ...c, target: `constraint_${i}` })) as ChallengeCondition[],
    timeLimit,
    rewards: generateQuestReward(difficulty, 10),
    difficulty,
  };
}

// ==================== UNLOCKABLES & DAILY REWARDS (Features 86-95) ====================
export function getUnlockableContent(): UnlockableContent[] {
  return [
    { id: 'unlock_1', name: 'Secteur Technologie', type: 'sector', requirement: 'Niveau prestige 2', description: 'Débloque le secteur high-tech', unlocked: false },
    { id: 'unlock_2', name: 'Secteur Santé', type: 'sector', requirement: 'Niveau prestige 3', description: 'Débloque le secteur pharmaceutique', unlocked: false },
    { id: 'unlock_3', name: 'Marché USA', type: 'country', requirement: 'Compléter "Internationalisation"', description: 'Accès au marché américain', unlocked: false },
    { id: 'unlock_4', name: 'Marché Chine', type: 'country', requirement: 'Niveau prestige 4', description: 'Accès au marché chinois', unlocked: false },
    { id: 'unlock_5', name: 'Produit Luxury', type: 'product', requirement: '10 produits lancés', description: 'Produits haut de gamme', unlocked: false },
    { id: 'unlock_6', name: 'Theme Dark Mode', type: 'cosmetic', requirement: '7 jours de connexion', description: 'Interface sombre', unlocked: false },
    { id: 'unlock_7', name: 'Mode Sandbox', type: 'feature', requirement: 'Niveau prestige 6', description: 'Jeu libre sans contraintes', unlocked: false },
  ];
}

export function generateDailyRewards(streak: number): DailyReward[] {
  return Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    claimed: false,
    reward: {
      xp: (i + 1) * 50 * (streak > 7 ? 2 : 1),
      money: (i + 1) * 1000,
      skillPoints: i >= 6 ? 3 : i >= 3 ? 1 : undefined,
      prestigePoints: i === 6 ? 50 : undefined,
    },
    streak,
  }));
}

export function claimDailyReward(rewards: DailyReward[], day: number): { rewards: DailyReward[]; claimed: QuestReward | null } {
  const reward = rewards.find(r => r.day === day && !r.claimed);
  if (!reward) return { rewards, claimed: null };
  
  return {
    rewards: rewards.map(r => r.day === day ? { ...r, claimed: true } : r),
    claimed: reward.reward,
  };
}

// ==================== SEASON PASS (Features 96-100) ====================
export function createSeasonPass(seasonNumber: number): SeasonPass {
  const rewards: { tier: number; free: QuestReward; premium: QuestReward }[] = [
    { tier: 1, free: { xp: 100 }, premium: { xp: 100, money: 5000 } },
    { tier: 5, free: { xp: 200, money: 10000 }, premium: { xp: 300, money: 25000, skillPoints: 2 } },
    { tier: 10, free: { xp: 500, skillPoints: 3 }, premium: { xp: 750, skillPoints: 5, prestigePoints: 100 } },
    { tier: 15, free: { xp: 750, money: 50000 }, premium: { xp: 1000, money: 100000 } },
    { tier: 20, free: { xp: 1000, prestigePoints: 50 }, premium: { xp: 2000, prestigePoints: 250, skillPoints: 10 } },
  ];
  
  return {
    id: `season_${seasonNumber}`,
    name: `Saison ${seasonNumber}`,
    startDate: Date.now(),
    endDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
    currentTier: 0,
    maxTier: 20,
    xp: 0,
    xpRequired: 1000,
    freeRewards: rewards.map(r => ({ tier: r.tier, reward: r.free, claimed: false })),
    premiumRewards: rewards.map(r => ({ tier: r.tier, reward: r.premium, claimed: false })),
    isPremium: false,
  };
}

export function addSeasonXP(pass: SeasonPass, xp: number): SeasonPass {
  const newXP = pass.xp + xp;
  const tierUps = Math.floor(newXP / pass.xpRequired);
  return {
    ...pass,
    xp: newXP % pass.xpRequired,
    currentTier: Math.min(pass.maxTier, pass.currentTier + tierUps),
  };
}

// ==================== PLAYER STATS (Features 101-105) ====================
export function initializePlayerStats(): PlayerStats {
  return {
    totalPlayTime: 0,
    companiesCreated: 1,
    totalRevenue: 0,
    totalProfit: 0,
    employeesHired: 0,
    productsLaunched: 0,
    countriesExpanded: 0,
    achievementsUnlocked: 0,
    questsCompleted: 0,
    prestigeResets: 0,
    highestValuation: 0,
  };
}

export function updatePlayerStats(stats: PlayerStats, event: { type: string; value: number }): PlayerStats {
  const updates: Record<string, (s: PlayerStats, v: number) => PlayerStats> = {
    revenue: (s, v) => ({ ...s, totalRevenue: s.totalRevenue + v }),
    profit: (s, v) => ({ ...s, totalProfit: s.totalProfit + v }),
    hire: (s, v) => ({ ...s, employeesHired: s.employeesHired + v }),
    product: (s, v) => ({ ...s, productsLaunched: s.productsLaunched + v }),
    country: (s, v) => ({ ...s, countriesExpanded: s.countriesExpanded + v }),
    achievement: (s, v) => ({ ...s, achievementsUnlocked: s.achievementsUnlocked + v }),
    quest: (s, v) => ({ ...s, questsCompleted: s.questsCompleted + v }),
    playtime: (s, v) => ({ ...s, totalPlayTime: s.totalPlayTime + v }),
    valuation: (s, v) => ({ ...s, highestValuation: Math.max(s.highestValuation, v) }),
  };
  
  return updates[event.type] ? updates[event.type](stats, event.value) : stats;
}

// ==================== INITIALIZATION ====================
export function initializeProgressionState() {
  return {
    skillTrees: initializeSkillTrees(),
    prestigeLevel: getPrestigeLevels()[0],
    prestigePoints: 0,
    skillPoints: 5,
    xp: 0,
    quests: [...generateStoryQuests()],
    challenges: getAvailableChallenges(),
    unlocks: getUnlockableContent(),
    dailyRewards: generateDailyRewards(1),
    seasonPass: createSeasonPass(1),
    playerStats: initializePlayerStats(),
  };
}
