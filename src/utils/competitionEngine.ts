// Competition AI & Achievements Engine
import {
  Competitor,
  CompetitorProduct,
  Achievement,
  Mission,
  MissionObjective,
  Sector,
  Company,
  GameState,
} from '@/types/game';

const generateId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ==================== COMPETITORS ====================

const COMPETITOR_NAMES = {
  tech: ['TechnoSoft', 'InnovaCorp', 'DigiSolutions', 'CloudFirst', 'DataDriven', 'AIVentures'],
  artisanat: ['Tradition Plus', 'Artisans Réunis', 'Savoir-Faire', 'Métiers d\'Art', 'Excellence Locale'],
  services: ['ServicePro', 'Conseil Expert', 'Solutions RH', 'BusinessFirst', 'ConsultPlus'],
  industrie: ['IndustriMax', 'Production Elite', 'ManuFrance', 'TechIndus', 'FabriPro'],
};

export function generateCompetitor(sector: Sector): Competitor {
  const names = COMPETITOR_NAMES[sector];
  const name = names[Math.floor(Math.random() * names.length)];
  const suffix = Math.floor(Math.random() * 1000);

  const sizes: Competitor['size'][] = ['startup', 'pme', 'eti', 'grande_entreprise'];
  const size = sizes[Math.floor(Math.random() * sizes.length)];

  const sizeModifiers = {
    startup: { market: 2, agg: 70, innov: 80, rep: 30 },
    pme: { market: 8, agg: 50, innov: 50, rep: 50 },
    eti: { market: 15, agg: 40, innov: 40, rep: 70 },
    grande_entreprise: { market: 30, agg: 30, innov: 30, rep: 90 },
  };

  const mods = sizeModifiers[size];

  return {
    id: generateId('comp'),
    name: `${name} ${suffix}`,
    sector,
    size,
    marketShare: mods.market + Math.floor(Math.random() * 10),
    aggressiveness: mods.agg + Math.floor(Math.random() * 30 - 15),
    innovation: mods.innov + Math.floor(Math.random() * 30 - 15),
    reputation: mods.rep + Math.floor(Math.random() * 20 - 10),
    products: generateCompetitorProducts(sector, 1 + Math.floor(Math.random() * 3)),
    priceLevel: 0.9 + Math.random() * 0.4,
  };
}

function generateCompetitorProducts(sector: Sector, count: number): CompetitorProduct[] {
  const productNames = {
    tech: ['Solution Cloud', 'App Mobile', 'Plateforme SaaS', 'IA Service', 'Cybersécurité'],
    artisanat: ['Création Artisanale', 'Pièce Unique', 'Collection Main', 'Édition Limitée'],
    services: ['Conseil Premium', 'Formation Pro', 'Audit Expert', 'Accompagnement'],
    industrie: ['Composant A', 'Module B', 'Système Pro', 'Équipement'],
  };

  return Array.from({ length: count }, () => ({
    name: productNames[sector][Math.floor(Math.random() * productNames[sector].length)],
    price: 50 + Math.floor(Math.random() * 200),
    quality: 40 + Math.floor(Math.random() * 50),
    marketShare: 5 + Math.floor(Math.random() * 15),
  }));
}

export function processCompetitorAction(
  competitor: Competitor,
  company: Company,
  economicWeather: string
): { competitor: Competitor; event?: string; marketShareChange?: number } {
  const updated = { ...competitor };
  let event: string | undefined;
  let marketShareChange: number | undefined;

  // Decision based on aggressiveness and situation
  const actions = [
    { type: 'price_war', chance: competitor.aggressiveness / 100 * 0.3 },
    { type: 'innovation', chance: competitor.innovation / 100 * 0.2 },
    { type: 'marketing', chance: 0.15 },
    { type: 'expansion', chance: 0.1 },
    { type: 'nothing', chance: 0.25 },
  ];

  const roll = Math.random();
  let cumulative = 0;
  let selectedAction = 'nothing';

  for (const action of actions) {
    cumulative += action.chance;
    if (roll < cumulative) {
      selectedAction = action.type;
      break;
    }
  }

  switch (selectedAction) {
    case 'price_war':
      updated.priceLevel = Math.max(0.7, updated.priceLevel - 0.1);
      event = `🔥 ${competitor.name} lance une guerre des prix!`;
      marketShareChange = -2;
      break;
    case 'innovation':
      updated.innovation = Math.min(100, updated.innovation + 5);
      if (Math.random() < 0.3) {
        updated.products.push({
          name: 'Nouveau Produit',
          price: 100 + Math.floor(Math.random() * 100),
          quality: 60 + Math.floor(Math.random() * 30),
          marketShare: 0,
        });
        event = `💡 ${competitor.name} lance un nouveau produit innovant!`;
        marketShareChange = -1;
      }
      break;
    case 'marketing':
      updated.reputation = Math.min(100, updated.reputation + 3);
      if (Math.random() < 0.5) {
        event = `📢 ${competitor.name} lance une campagne marketing agressive`;
        marketShareChange = -1;
      }
      break;
    case 'expansion':
      updated.marketShare = Math.min(40, updated.marketShare + 2);
      break;
  }

  // Economic weather effects
  if (economicWeather === 'crise') {
    if (updated.size === 'startup' && Math.random() < 0.1) {
      updated.marketShare = Math.max(0, updated.marketShare - 5);
      event = `💀 ${competitor.name} en grande difficulté (crise économique)`;
      marketShareChange = 3; // Positive for player
    }
  }

  return { competitor: updated, event, marketShareChange };
}

export function calculateMarketShareImpact(
  company: Company,
  competitors: Competitor[]
): { companyShare: number; events: string[] } {
  const events: string[] = [];
  
  // Base market share from products and reputation
  let baseShare = company.products.filter(p => p.phase !== 'rd').length * 5;
  baseShare += company.reputation / 10;
  baseShare += company.employees.length * 0.5;

  // Competitor pressure
  const totalCompetitorShare = competitors.reduce((sum, c) => sum + c.marketShare, 0);
  const availableShare = Math.max(0, 100 - totalCompetitorShare);

  const finalShare = Math.min(baseShare, availableShare);

  if (finalShare < company.marketShare - 5) {
    events.push('⚠️ Perte de parts de marché face à la concurrence');
  }

  return { companyShare: finalShare, events };
}

// ==================== ACHIEVEMENTS ====================

export function initializeAchievements(): Achievement[] {
  return [
    // Finance
    { id: 'first_million', name: 'Premier Million', description: 'Atteignez 1 000 000€ de trésorerie', category: 'finance', icon: '💰', requirement: 'treasury >= 1000000', reward: { credibility: 10 }, unlocked: false },
    { id: 'profitable_year', name: 'Année Rentable', description: 'Terminez une année avec un bénéfice net positif', category: 'finance', icon: '📈', requirement: 'annual_profit > 0', reward: { treasury: 10000 }, unlocked: false },
    { id: 'debt_free', name: 'Sans Dettes', description: 'Remboursez tous vos emprunts', category: 'finance', icon: '🎯', requirement: 'loans.length === 0', reward: { credibility: 15 }, unlocked: false },
    { id: 'investor_king', name: 'Roi des Placements', description: 'Gagnez 50 000€ en placements', category: 'finance', icon: '👑', requirement: 'investment_gains >= 50000', reward: { treasury: 5000 }, unlocked: false },
    
    // RH
    { id: 'first_hire', name: 'Premier Employé', description: 'Recrutez votre premier employé', category: 'rh', icon: '👤', requirement: 'employees.length >= 1', reward: { credibility: 5 }, unlocked: false },
    { id: 'team_10', name: 'Équipe de 10', description: 'Atteignez 10 employés', category: 'rh', icon: '👥', requirement: 'employees.length >= 10', reward: { treasury: 5000 }, unlocked: false },
    { id: 'team_50', name: 'PME', description: 'Atteignez 50 employés', category: 'rh', icon: '🏢', requirement: 'employees.length >= 50', reward: { credibility: 20 }, unlocked: false },
    { id: 'happy_team', name: 'Équipe Heureuse', description: 'Atteignez 90% de moral moyen', category: 'rh', icon: '😊', requirement: 'avg_moral >= 90', reward: { treasury: 3000 }, unlocked: false },
    { id: 'zero_turnover', name: 'Fidélité', description: 'Aucun départ pendant 1 an', category: 'rh', icon: '🤝', requirement: 'no_departures_365', reward: { credibility: 10 }, unlocked: false },
    
    // Production
    { id: 'first_product', name: 'Premier Produit', description: 'Lancez votre premier produit', category: 'production', icon: '📦', requirement: 'products.length >= 1', reward: { credibility: 5 }, unlocked: false },
    { id: 'product_line', name: 'Gamme Complète', description: 'Ayez 5 produits en phase maturité', category: 'production', icon: '🎯', requirement: 'mature_products >= 5', reward: { treasury: 20000 }, unlocked: false },
    { id: 'quality_master', name: 'Maître Qualité', description: 'Atteignez 95 de qualité sur un produit', category: 'production', icon: '⭐', requirement: 'max_quality >= 95', reward: { credibility: 15 }, unlocked: false },
    { id: 'innovation_leader', name: 'Leader Innovation', description: 'Déposez 5 brevets', category: 'production', icon: '💡', requirement: 'patents >= 5', reward: { treasury: 30000 }, unlocked: false },
    
    // Commercial
    { id: 'first_contract', name: 'Premier Contrat', description: 'Signez votre premier contrat client', category: 'commercial', icon: '📝', requirement: 'contracts >= 1', reward: { treasury: 1000 }, unlocked: false },
    { id: 'big_deal', name: 'Gros Contrat', description: 'Signez un contrat de plus de 100 000€', category: 'commercial', icon: '💎', requirement: 'max_contract >= 100000', reward: { credibility: 20 }, unlocked: false },
    { id: 'client_portfolio', name: 'Portefeuille Clients', description: 'Ayez 20 clients actifs', category: 'commercial', icon: '📊', requirement: 'active_clients >= 20', reward: { treasury: 15000 }, unlocked: false },
    { id: 'zero_unpaid', name: 'Zéro Impayé', description: 'Aucun impayé pendant 6 mois', category: 'commercial', icon: '✅', requirement: 'no_unpaid_180', reward: { credibility: 10 }, unlocked: false },
    
    // Legal
    { id: 'court_victory', name: 'Victoire Judiciaire', description: 'Gagnez votre premier procès', category: 'legal', icon: '⚖️', requirement: 'lawsuits_won >= 1', reward: { credibility: 15 }, unlocked: false },
    { id: 'ip_portfolio', name: 'Portefeuille PI', description: 'Possédez 10 propriétés intellectuelles', category: 'legal', icon: '📜', requirement: 'ip_count >= 10', reward: { treasury: 25000 }, unlocked: false },
    { id: 'clean_record', name: 'Casier Vierge', description: 'Aucun litige pendant 2 ans', category: 'legal', icon: '🏆', requirement: 'no_cases_730', reward: { credibility: 25 }, unlocked: false },
    
    // International
    { id: 'first_export', name: 'Premier Export', description: 'Réalisez votre première vente à l\'étranger', category: 'international', icon: '🌍', requirement: 'export_revenue > 0', reward: { credibility: 10 }, unlocked: false },
    { id: 'european', name: 'Européen', description: 'Soyez présent dans 3 pays', category: 'international', icon: '🇪🇺', requirement: 'countries >= 3', reward: { treasury: 20000 }, unlocked: false },
    { id: 'global_player', name: 'Acteur Mondial', description: 'Ouvrez une filiale à l\'étranger', category: 'international', icon: '🌐', requirement: 'subsidiaries >= 1', reward: { credibility: 30 }, unlocked: false },
    { id: 'export_champion', name: 'Champion Export', description: '30% du CA à l\'international', category: 'international', icon: '🚀', requirement: 'export_ratio >= 30', reward: { treasury: 50000 }, unlocked: false },
  ];
}

export function checkAchievements(
  company: Company,
  state: GameState
): { achievements: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  
  const updated = company.achievements.map(achievement => {
    if (achievement.unlocked) return achievement;

    let shouldUnlock = false;

    switch (achievement.id) {
      case 'first_million':
        shouldUnlock = company.treasury >= 1000000;
        break;
      case 'first_hire':
        shouldUnlock = company.employees.length >= 1;
        break;
      case 'team_10':
        shouldUnlock = company.employees.length >= 10;
        break;
      case 'team_50':
        shouldUnlock = company.employees.length >= 50;
        break;
      case 'first_product':
        shouldUnlock = company.products.some(p => p.phase !== 'rd');
        break;
      case 'debt_free':
        shouldUnlock = company.bankAccount.loans.length === 0 && 
                       state.statistics.loansRepaid > 0;
        break;
      case 'happy_team':
        const avgMoral = company.employees.reduce((s, e) => s + e.moral, 0) / 
                        Math.max(company.employees.length, 1);
        shouldUnlock = avgMoral >= 90;
        break;
      case 'first_export':
        shouldUnlock = company.foreignMarkets.some(m => m.revenue > 0);
        break;
      case 'global_player':
        shouldUnlock = company.subsidiaries.length >= 1;
        break;
      case 'court_victory':
        shouldUnlock = state.statistics.lawsuitsWon >= 1;
        break;
      case 'first_contract':
        shouldUnlock = company.clients.some(c => c.contracts.length > 0);
        break;
      // Add more achievement checks...
    }

    if (shouldUnlock) {
      const unlocked = { ...achievement, unlocked: true, unlockedDate: state.day };
      newlyUnlocked.push(unlocked);
      return unlocked;
    }

    return achievement;
  });

  return { achievements: updated, newlyUnlocked };
}

// ==================== MISSIONS ====================

export function generateMission(
  company: Company,
  difficulty: GameState['difficulty'],
  currentDay: number
): Mission {
  const missionTemplates = [
    {
      title: 'Croissance Rapide',
      description: 'Augmentez votre chiffre d\'affaires',
      objectives: [
        { description: 'Atteindre {target}€ de CA mensuel', baseTarget: 50000, multiplier: { facile: 0.5, normal: 1, difficile: 1.5, hardcore: 2 } },
      ],
      reward: { treasury: 10000, credibility: 5 },
    },
    {
      title: 'Recrutement Express',
      description: 'Développez votre équipe',
      objectives: [
        { description: 'Recruter {target} nouveaux employés', baseTarget: 3, multiplier: { facile: 0.5, normal: 1, difficile: 1.5, hardcore: 2 } },
      ],
      reward: { treasury: 5000, credibility: 3 },
    },
    {
      title: 'Expansion Commerciale',
      description: 'Développez votre portefeuille clients',
      objectives: [
        { description: 'Signer {target} nouveaux contrats', baseTarget: 5, multiplier: { facile: 0.5, normal: 1, difficile: 1.5, hardcore: 2 } },
      ],
      reward: { treasury: 15000, credibility: 8 },
    },
    {
      title: 'Innovation',
      description: 'Lancez de nouveaux produits',
      objectives: [
        { description: 'Lancer {target} produits', baseTarget: 2, multiplier: { facile: 0.5, normal: 1, difficile: 1.5, hardcore: 2 } },
      ],
      reward: { treasury: 20000, credibility: 10 },
    },
  ];

  const template = missionTemplates[Math.floor(Math.random() * missionTemplates.length)];
  const multiplier = template.objectives[0].multiplier[difficulty];

  return {
    id: generateId('mission'),
    title: template.title,
    description: template.description,
    objectives: template.objectives.map(obj => ({
      id: generateId('obj'),
      description: obj.description.replace('{target}', String(Math.round(obj.baseTarget * multiplier))),
      target: Math.round(obj.baseTarget * multiplier),
      current: 0,
      completed: false,
    })),
    deadline: currentDay + 90, // 3 months
    reward: template.reward,
    completed: false,
    failed: false,
  };
}

export function updateMissionProgress(
  missions: Mission[],
  company: Company,
  currentDay: number
): { missions: Mission[]; completedMissions: Mission[]; failedMissions: Mission[] } {
  const completedMissions: Mission[] = [];
  const failedMissions: Mission[] = [];

  const updated = missions.map(mission => {
    if (mission.completed || mission.failed) return mission;

    // Check deadline
    if (mission.deadline && currentDay > mission.deadline) {
      failedMissions.push(mission);
      return { ...mission, failed: true };
    }

    // Update objectives
    const updatedObjectives = mission.objectives.map(obj => {
      // Simple progress tracking based on objective type
      let current = obj.current;
      
      if (obj.description.includes('CA mensuel')) {
        current = company.monthlyRevenue;
      } else if (obj.description.includes('employés')) {
        current = company.employees.length;
      } else if (obj.description.includes('contrats')) {
        current = company.clients.reduce((s, c) => s + c.contracts.filter(ct => ct.status === 'active').length, 0);
      } else if (obj.description.includes('produits')) {
        current = company.products.filter(p => p.phase !== 'rd').length;
      }

      return {
        ...obj,
        current,
        completed: current >= obj.target,
      };
    });

    const allCompleted = updatedObjectives.every(obj => obj.completed);

    if (allCompleted) {
      completedMissions.push({ ...mission, completed: true, objectives: updatedObjectives });
      return { ...mission, completed: true, objectives: updatedObjectives };
    }

    return { ...mission, objectives: updatedObjectives };
  });

  return { missions: updated, completedMissions, failedMissions };
}

// ==================== MONTHLY PROCESSING ====================

export function processMonthlyCompetition(
  company: Company,
  state: GameState
): {
  company: Company;
  events: string[];
} {
  const events: string[] = [];
  const updatedCompany = { ...company };

  // Process competitor actions
  updatedCompany.competitors = company.competitors.map(competitor => {
    const result = processCompetitorAction(competitor, company, state.economicWeather);
    if (result.event) events.push(result.event);
    if (result.marketShareChange) {
      updatedCompany.marketShare = Math.max(0, Math.min(100, 
        updatedCompany.marketShare + result.marketShareChange
      ));
    }
    return result.competitor;
  });

  // Check achievements
  const achievementResult = checkAchievements(updatedCompany, state);
  updatedCompany.achievements = achievementResult.achievements;
  
  for (const achievement of achievementResult.newlyUnlocked) {
    events.push(`🏆 Succès débloqué: "${achievement.name}"!`);
    if (achievement.reward.treasury) {
      updatedCompany.treasury += achievement.reward.treasury;
    }
    if (achievement.reward.credibility) {
      updatedCompany.credibility = Math.min(100, updatedCompany.credibility + achievement.reward.credibility);
    }
  }

  // Update missions
  const missionResult = updateMissionProgress(updatedCompany.missions, updatedCompany, state.day);
  updatedCompany.missions = missionResult.missions;

  for (const mission of missionResult.completedMissions) {
    events.push(`✅ Mission accomplie: "${mission.title}"!`);
    if (mission.reward.treasury) {
      updatedCompany.treasury += mission.reward.treasury;
    }
    if (mission.reward.credibility) {
      updatedCompany.credibility = Math.min(100, updatedCompany.credibility + mission.reward.credibility);
    }
  }

  for (const mission of missionResult.failedMissions) {
    events.push(`❌ Mission échouée: "${mission.title}"`);
  }

  // Generate new mission if needed
  if (updatedCompany.missions.filter(m => !m.completed && !m.failed).length < 2) {
    const newMission = generateMission(updatedCompany, state.difficulty, state.day);
    updatedCompany.missions.push(newMission);
    events.push(`📋 Nouvelle mission: "${newMission.title}"`);
  }

  return { company: updatedCompany, events };
}
