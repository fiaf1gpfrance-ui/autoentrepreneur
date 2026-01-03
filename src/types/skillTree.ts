// Système d'arbre de compétences avec spécialisations

export type SkillCategory = 
  | 'management' 
  | 'finance' 
  | 'marketing' 
  | 'technology' 
  | 'hr' 
  | 'production' 
  | 'international' 
  | 'legal';

export type SkillTier = 1 | 2 | 3 | 4 | 5;

export type SpecializationPath = 
  | 'entrepreneur_visionnaire'
  | 'magnat_industriel'
  | 'genie_financier'
  | 'innovateur_tech'
  | 'maitre_marketing'
  | 'diplomate_international'
  | 'stratege_rh'
  | 'baron_immobilier';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  tier: SkillTier;
  icon: string;
  cost: number; // Points de compétence requis
  prerequisites: string[]; // IDs des compétences requises
  effects: SkillEffect[];
  maxLevel: number;
  currentLevel: number;
  isUnlocked: boolean;
  specialization?: SpecializationPath;
}

export interface SkillEffect {
  type: SkillEffectType;
  value: number;
  description: string;
  perLevel?: boolean; // Si true, l'effet augmente par niveau
}

export type SkillEffectType = 
  | 'revenue_bonus'
  | 'cost_reduction'
  | 'employee_productivity'
  | 'employee_morale'
  | 'hiring_speed'
  | 'training_efficiency'
  | 'research_speed'
  | 'innovation_chance'
  | 'marketing_efficiency'
  | 'brand_awareness'
  | 'customer_retention'
  | 'sales_conversion'
  | 'loan_interest_reduction'
  | 'investment_returns'
  | 'tax_optimization'
  | 'crisis_resistance'
  | 'production_efficiency'
  | 'quality_bonus'
  | 'supply_chain_efficiency'
  | 'international_expansion'
  | 'diplomacy_bonus'
  | 'legal_protection'
  | 'reputation_gain'
  | 'unlock_feature'
  | 'special_ability';

export interface Specialization {
  id: SpecializationPath;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredSkills: string[]; // IDs des compétences requises pour débloquer
  bonuses: SkillEffect[];
  ultimateAbility: UltimateAbility;
}

export interface UltimateAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number; // En jours de jeu
  effect: () => void;
  isActive: boolean;
  lastUsed?: number;
}

export interface SkillTreeState {
  skillPoints: number;
  totalSkillPointsEarned: number;
  skills: Record<string, Skill>;
  unlockedSpecializations: SpecializationPath[];
  activeSpecialization?: SpecializationPath;
  milestones: SkillMilestone[];
}

export interface SkillMilestone {
  id: string;
  name: string;
  description: string;
  requirement: MilestoneRequirement;
  reward: MilestoneReward;
  isCompleted: boolean;
  completedAt?: number;
}

export interface MilestoneRequirement {
  type: 'skills_unlocked' | 'tier_reached' | 'category_mastered' | 'total_levels';
  value: number;
  category?: SkillCategory;
}

export interface MilestoneReward {
  type: 'skill_points' | 'unlock_skill' | 'permanent_bonus' | 'unlock_specialization';
  value: number | string;
  effect?: SkillEffect;
}

// Définition de toutes les compétences
export const SKILL_DEFINITIONS: Omit<Skill, 'currentLevel' | 'isUnlocked'>[] = [
  // === TIER 1 - Fondamentaux ===
  // Management
  {
    id: 'leadership_basics',
    name: 'Leadership Fondamental',
    description: 'Les bases du leadership d\'entreprise',
    category: 'management',
    tier: 1,
    icon: 'Crown',
    cost: 1,
    prerequisites: [],
    maxLevel: 5,
    effects: [
      { type: 'employee_morale', value: 2, description: '+2% moral employés par niveau', perLevel: true },
      { type: 'employee_productivity', value: 1, description: '+1% productivité par niveau', perLevel: true }
    ]
  },
  {
    id: 'time_management',
    name: 'Gestion du Temps',
    description: 'Optimiser l\'utilisation du temps',
    category: 'management',
    tier: 1,
    icon: 'Clock',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'production_efficiency', value: 3, description: '+3% efficacité production par niveau', perLevel: true }
    ]
  },
  {
    id: 'decision_making',
    name: 'Prise de Décision',
    description: 'Prendre de meilleures décisions stratégiques',
    category: 'management',
    tier: 1,
    icon: 'Target',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'crisis_resistance', value: 5, description: '+5% résistance aux crises par niveau', perLevel: true }
    ]
  },

  // Finance
  {
    id: 'accounting_basics',
    name: 'Comptabilité de Base',
    description: 'Maîtriser les fondamentaux comptables',
    category: 'finance',
    tier: 1,
    icon: 'Calculator',
    cost: 1,
    prerequisites: [],
    maxLevel: 5,
    effects: [
      { type: 'tax_optimization', value: 2, description: '+2% optimisation fiscale par niveau', perLevel: true }
    ]
  },
  {
    id: 'budget_management',
    name: 'Gestion Budgétaire',
    description: 'Mieux gérer les budgets',
    category: 'finance',
    tier: 1,
    icon: 'PiggyBank',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'cost_reduction', value: 2, description: '-2% coûts opérationnels par niveau', perLevel: true }
    ]
  },
  {
    id: 'cash_flow',
    name: 'Gestion de Trésorerie',
    description: 'Optimiser les flux de trésorerie',
    category: 'finance',
    tier: 1,
    icon: 'Banknote',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'loan_interest_reduction', value: 3, description: '-3% intérêts emprunts par niveau', perLevel: true }
    ]
  },

  // Marketing
  {
    id: 'brand_awareness',
    name: 'Notoriété de Marque',
    description: 'Construire une marque reconnue',
    category: 'marketing',
    tier: 1,
    icon: 'Star',
    cost: 1,
    prerequisites: [],
    maxLevel: 5,
    effects: [
      { type: 'brand_awareness', value: 3, description: '+3% notoriété par niveau', perLevel: true }
    ]
  },
  {
    id: 'customer_relations',
    name: 'Relations Clients',
    description: 'Améliorer la satisfaction client',
    category: 'marketing',
    tier: 1,
    icon: 'Heart',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'customer_retention', value: 4, description: '+4% rétention clients par niveau', perLevel: true }
    ]
  },
  {
    id: 'sales_techniques',
    name: 'Techniques de Vente',
    description: 'Maîtriser l\'art de la vente',
    category: 'marketing',
    tier: 1,
    icon: 'TrendingUp',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'sales_conversion', value: 3, description: '+3% conversion ventes par niveau', perLevel: true }
    ]
  },

  // Technology
  {
    id: 'tech_basics',
    name: 'Bases Technologiques',
    description: 'Comprendre les fondamentaux tech',
    category: 'technology',
    tier: 1,
    icon: 'Cpu',
    cost: 1,
    prerequisites: [],
    maxLevel: 5,
    effects: [
      { type: 'research_speed', value: 3, description: '+3% vitesse R&D par niveau', perLevel: true }
    ]
  },
  {
    id: 'digital_tools',
    name: 'Outils Digitaux',
    description: 'Utiliser les outils numériques',
    category: 'technology',
    tier: 1,
    icon: 'Laptop',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'production_efficiency', value: 2, description: '+2% efficacité par niveau', perLevel: true }
    ]
  },
  {
    id: 'data_analysis',
    name: 'Analyse de Données',
    description: 'Exploiter les données business',
    category: 'technology',
    tier: 1,
    icon: 'BarChart',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'marketing_efficiency', value: 4, description: '+4% efficacité marketing par niveau', perLevel: true }
    ]
  },

  // HR
  {
    id: 'recruitment',
    name: 'Recrutement',
    description: 'Attirer les meilleurs talents',
    category: 'hr',
    tier: 1,
    icon: 'UserPlus',
    cost: 1,
    prerequisites: [],
    maxLevel: 5,
    effects: [
      { type: 'hiring_speed', value: 10, description: '+10% vitesse recrutement par niveau', perLevel: true }
    ]
  },
  {
    id: 'training_programs',
    name: 'Programmes de Formation',
    description: 'Former efficacement les équipes',
    category: 'hr',
    tier: 1,
    icon: 'GraduationCap',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'training_efficiency', value: 5, description: '+5% efficacité formation par niveau', perLevel: true }
    ]
  },
  {
    id: 'team_building',
    name: 'Cohésion d\'Équipe',
    description: 'Renforcer l\'esprit d\'équipe',
    category: 'hr',
    tier: 1,
    icon: 'Users',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'employee_morale', value: 4, description: '+4% moral par niveau', perLevel: true }
    ]
  },

  // Production
  {
    id: 'quality_control',
    name: 'Contrôle Qualité',
    description: 'Assurer la qualité des produits',
    category: 'production',
    tier: 1,
    icon: 'CheckCircle',
    cost: 1,
    prerequisites: [],
    maxLevel: 5,
    effects: [
      { type: 'quality_bonus', value: 3, description: '+3% qualité produits par niveau', perLevel: true }
    ]
  },
  {
    id: 'process_optimization',
    name: 'Optimisation Processus',
    description: 'Améliorer les processus de production',
    category: 'production',
    tier: 1,
    icon: 'Settings',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'production_efficiency', value: 4, description: '+4% efficacité par niveau', perLevel: true }
    ]
  },
  {
    id: 'inventory_management',
    name: 'Gestion des Stocks',
    description: 'Optimiser la gestion des stocks',
    category: 'production',
    tier: 1,
    icon: 'Package',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'supply_chain_efficiency', value: 4, description: '+4% efficacité supply chain par niveau', perLevel: true }
    ]
  },

  // International
  {
    id: 'foreign_languages',
    name: 'Langues Étrangères',
    description: 'Maîtriser plusieurs langues',
    category: 'international',
    tier: 1,
    icon: 'Globe',
    cost: 1,
    prerequisites: [],
    maxLevel: 5,
    effects: [
      { type: 'international_expansion', value: 5, description: '+5% succès expansion par niveau', perLevel: true }
    ]
  },
  {
    id: 'cultural_awareness',
    name: 'Sensibilité Culturelle',
    description: 'Comprendre les différentes cultures',
    category: 'international',
    tier: 1,
    icon: 'Heart',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'diplomacy_bonus', value: 4, description: '+4% diplomatie par niveau', perLevel: true }
    ]
  },

  // Legal
  {
    id: 'contract_law',
    name: 'Droit des Contrats',
    description: 'Maîtriser le droit contractuel',
    category: 'legal',
    tier: 1,
    icon: 'FileText',
    cost: 1,
    prerequisites: [],
    maxLevel: 5,
    effects: [
      { type: 'legal_protection', value: 5, description: '+5% protection juridique par niveau', perLevel: true }
    ]
  },
  {
    id: 'regulatory_compliance',
    name: 'Conformité Réglementaire',
    description: 'Respecter les réglementations',
    category: 'legal',
    tier: 1,
    icon: 'Shield',
    cost: 1,
    prerequisites: [],
    maxLevel: 3,
    effects: [
      { type: 'crisis_resistance', value: 3, description: '+3% résistance crises par niveau', perLevel: true }
    ]
  },

  // === TIER 2 - Intermédiaire ===
  // Management
  {
    id: 'strategic_planning',
    name: 'Planification Stratégique',
    description: 'Élaborer des stratégies à long terme',
    category: 'management',
    tier: 2,
    icon: 'Map',
    cost: 2,
    prerequisites: ['leadership_basics', 'decision_making'],
    maxLevel: 5,
    effects: [
      { type: 'revenue_bonus', value: 2, description: '+2% revenus par niveau', perLevel: true },
      { type: 'crisis_resistance', value: 3, description: '+3% résistance crises par niveau', perLevel: true }
    ]
  },
  {
    id: 'delegation',
    name: 'Art de la Délégation',
    description: 'Déléguer efficacement',
    category: 'management',
    tier: 2,
    icon: 'Users',
    cost: 2,
    prerequisites: ['leadership_basics', 'time_management'],
    maxLevel: 3,
    effects: [
      { type: 'employee_productivity', value: 5, description: '+5% productivité par niveau', perLevel: true }
    ]
  },

  // Finance
  {
    id: 'investment_analysis',
    name: 'Analyse d\'Investissement',
    description: 'Évaluer les opportunités d\'investissement',
    category: 'finance',
    tier: 2,
    icon: 'TrendingUp',
    cost: 2,
    prerequisites: ['accounting_basics', 'cash_flow'],
    maxLevel: 5,
    effects: [
      { type: 'investment_returns', value: 4, description: '+4% rendements par niveau', perLevel: true }
    ]
  },
  {
    id: 'risk_management',
    name: 'Gestion des Risques',
    description: 'Identifier et gérer les risques',
    category: 'finance',
    tier: 2,
    icon: 'Shield',
    cost: 2,
    prerequisites: ['budget_management', 'accounting_basics'],
    maxLevel: 3,
    effects: [
      { type: 'crisis_resistance', value: 8, description: '+8% résistance crises par niveau', perLevel: true }
    ]
  },

  // Marketing
  {
    id: 'digital_marketing',
    name: 'Marketing Digital',
    description: 'Maîtriser le marketing en ligne',
    category: 'marketing',
    tier: 2,
    icon: 'Globe',
    cost: 2,
    prerequisites: ['brand_awareness', 'customer_relations'],
    maxLevel: 5,
    effects: [
      { type: 'marketing_efficiency', value: 6, description: '+6% efficacité marketing par niveau', perLevel: true }
    ]
  },
  {
    id: 'market_research',
    name: 'Études de Marché',
    description: 'Analyser les tendances du marché',
    category: 'marketing',
    tier: 2,
    icon: 'Search',
    cost: 2,
    prerequisites: ['sales_techniques', 'customer_relations'],
    maxLevel: 3,
    effects: [
      { type: 'sales_conversion', value: 5, description: '+5% conversion par niveau', perLevel: true }
    ]
  },

  // Technology
  {
    id: 'automation',
    name: 'Automatisation',
    description: 'Automatiser les processus',
    category: 'technology',
    tier: 2,
    icon: 'Zap',
    cost: 2,
    prerequisites: ['tech_basics', 'digital_tools'],
    maxLevel: 5,
    effects: [
      { type: 'production_efficiency', value: 5, description: '+5% efficacité par niveau', perLevel: true },
      { type: 'cost_reduction', value: 2, description: '-2% coûts par niveau', perLevel: true }
    ]
  },
  {
    id: 'innovation_culture',
    name: 'Culture d\'Innovation',
    description: 'Favoriser l\'innovation',
    category: 'technology',
    tier: 2,
    icon: 'Lightbulb',
    cost: 2,
    prerequisites: ['tech_basics', 'data_analysis'],
    maxLevel: 3,
    effects: [
      { type: 'innovation_chance', value: 10, description: '+10% chance innovation par niveau', perLevel: true }
    ]
  },

  // HR
  {
    id: 'talent_retention',
    name: 'Rétention des Talents',
    description: 'Garder les meilleurs employés',
    category: 'hr',
    tier: 2,
    icon: 'Heart',
    cost: 2,
    prerequisites: ['recruitment', 'team_building'],
    maxLevel: 5,
    effects: [
      { type: 'employee_morale', value: 6, description: '+6% moral par niveau', perLevel: true }
    ]
  },
  {
    id: 'performance_management',
    name: 'Gestion des Performances',
    description: 'Optimiser les performances individuelles',
    category: 'hr',
    tier: 2,
    icon: 'BarChart',
    cost: 2,
    prerequisites: ['training_programs', 'recruitment'],
    maxLevel: 3,
    effects: [
      { type: 'employee_productivity', value: 6, description: '+6% productivité par niveau', perLevel: true }
    ]
  },

  // Production
  {
    id: 'lean_manufacturing',
    name: 'Production Lean',
    description: 'Éliminer les gaspillages',
    category: 'production',
    tier: 2,
    icon: 'Minimize',
    cost: 2,
    prerequisites: ['process_optimization', 'quality_control'],
    maxLevel: 5,
    effects: [
      { type: 'cost_reduction', value: 4, description: '-4% coûts par niveau', perLevel: true },
      { type: 'production_efficiency', value: 3, description: '+3% efficacité par niveau', perLevel: true }
    ]
  },
  {
    id: 'supplier_relations',
    name: 'Relations Fournisseurs',
    description: 'Négocier avec les fournisseurs',
    category: 'production',
    tier: 2,
    icon: 'Handshake',
    cost: 2,
    prerequisites: ['inventory_management'],
    maxLevel: 3,
    effects: [
      { type: 'supply_chain_efficiency', value: 6, description: '+6% efficacité supply chain par niveau', perLevel: true },
      { type: 'cost_reduction', value: 3, description: '-3% coûts achats par niveau', perLevel: true }
    ]
  },

  // International
  {
    id: 'export_expertise',
    name: 'Expertise Export',
    description: 'Maîtriser les processus d\'export',
    category: 'international',
    tier: 2,
    icon: 'Ship',
    cost: 2,
    prerequisites: ['foreign_languages', 'cultural_awareness'],
    maxLevel: 5,
    effects: [
      { type: 'international_expansion', value: 8, description: '+8% succès export par niveau', perLevel: true }
    ]
  },
  {
    id: 'international_networking',
    name: 'Réseau International',
    description: 'Développer un réseau mondial',
    category: 'international',
    tier: 2,
    icon: 'Network',
    cost: 2,
    prerequisites: ['foreign_languages'],
    maxLevel: 3,
    effects: [
      { type: 'diplomacy_bonus', value: 8, description: '+8% diplomatie par niveau', perLevel: true }
    ]
  },

  // Legal
  {
    id: 'intellectual_property',
    name: 'Propriété Intellectuelle',
    description: 'Protéger les innovations',
    category: 'legal',
    tier: 2,
    icon: 'Lock',
    cost: 2,
    prerequisites: ['contract_law'],
    maxLevel: 5,
    effects: [
      { type: 'legal_protection', value: 8, description: '+8% protection PI par niveau', perLevel: true },
      { type: 'innovation_chance', value: 3, description: '+3% chance innovation par niveau', perLevel: true }
    ]
  },
  {
    id: 'dispute_resolution',
    name: 'Résolution de Litiges',
    description: 'Gérer les conflits juridiques',
    category: 'legal',
    tier: 2,
    icon: 'Gavel',
    cost: 2,
    prerequisites: ['contract_law', 'regulatory_compliance'],
    maxLevel: 3,
    effects: [
      { type: 'legal_protection', value: 10, description: '+10% protection juridique par niveau', perLevel: true }
    ]
  },

  // === TIER 3 - Avancé ===
  {
    id: 'corporate_strategy',
    name: 'Stratégie d\'Entreprise',
    description: 'Vision stratégique globale',
    category: 'management',
    tier: 3,
    icon: 'Target',
    cost: 3,
    prerequisites: ['strategic_planning', 'delegation'],
    maxLevel: 5,
    effects: [
      { type: 'revenue_bonus', value: 4, description: '+4% revenus par niveau', perLevel: true },
      { type: 'reputation_gain', value: 3, description: '+3% réputation par niveau', perLevel: true }
    ]
  },
  {
    id: 'mergers_acquisitions',
    name: 'Fusions & Acquisitions',
    description: 'Maîtriser les M&A',
    category: 'finance',
    tier: 3,
    icon: 'GitMerge',
    cost: 3,
    prerequisites: ['investment_analysis', 'risk_management'],
    maxLevel: 5,
    effects: [
      { type: 'investment_returns', value: 8, description: '+8% rendements M&A par niveau', perLevel: true },
      { type: 'unlock_feature', value: 1, description: 'Débloque les acquisitions d\'entreprises' }
    ]
  },
  {
    id: 'brand_empire',
    name: 'Empire de Marque',
    description: 'Construire un empire médiatique',
    category: 'marketing',
    tier: 3,
    icon: 'Crown',
    cost: 3,
    prerequisites: ['digital_marketing', 'market_research'],
    maxLevel: 5,
    effects: [
      { type: 'brand_awareness', value: 10, description: '+10% notoriété par niveau', perLevel: true },
      { type: 'customer_retention', value: 5, description: '+5% rétention par niveau', perLevel: true }
    ]
  },
  {
    id: 'ai_integration',
    name: 'Intégration IA',
    description: 'Exploiter l\'intelligence artificielle',
    category: 'technology',
    tier: 3,
    icon: 'Brain',
    cost: 3,
    prerequisites: ['automation', 'innovation_culture'],
    maxLevel: 5,
    effects: [
      { type: 'production_efficiency', value: 10, description: '+10% efficacité par niveau', perLevel: true },
      { type: 'research_speed', value: 8, description: '+8% vitesse R&D par niveau', perLevel: true }
    ]
  },
  {
    id: 'talent_factory',
    name: 'Usine à Talents',
    description: 'Créer une école interne',
    category: 'hr',
    tier: 3,
    icon: 'School',
    cost: 3,
    prerequisites: ['talent_retention', 'performance_management'],
    maxLevel: 5,
    effects: [
      { type: 'training_efficiency', value: 15, description: '+15% efficacité formation par niveau', perLevel: true },
      { type: 'hiring_speed', value: 20, description: '+20% vitesse recrutement par niveau', perLevel: true }
    ]
  },
  {
    id: 'industry_40',
    name: 'Industrie 4.0',
    description: 'Usine du futur connectée',
    category: 'production',
    tier: 3,
    icon: 'Factory',
    cost: 3,
    prerequisites: ['lean_manufacturing', 'supplier_relations'],
    maxLevel: 5,
    effects: [
      { type: 'production_efficiency', value: 12, description: '+12% efficacité par niveau', perLevel: true },
      { type: 'quality_bonus', value: 8, description: '+8% qualité par niveau', perLevel: true }
    ]
  },
  {
    id: 'global_operations',
    name: 'Opérations Globales',
    description: 'Gérer une présence mondiale',
    category: 'international',
    tier: 3,
    icon: 'Globe2',
    cost: 3,
    prerequisites: ['export_expertise', 'international_networking'],
    maxLevel: 5,
    effects: [
      { type: 'international_expansion', value: 15, description: '+15% succès international par niveau', perLevel: true }
    ]
  },
  {
    id: 'regulatory_mastery',
    name: 'Maîtrise Réglementaire',
    description: 'Devenir expert en réglementation',
    category: 'legal',
    tier: 3,
    icon: 'Scale',
    cost: 3,
    prerequisites: ['intellectual_property', 'dispute_resolution'],
    maxLevel: 5,
    effects: [
      { type: 'legal_protection', value: 15, description: '+15% protection par niveau', perLevel: true },
      { type: 'tax_optimization', value: 5, description: '+5% optimisation fiscale par niveau', perLevel: true }
    ]
  },

  // === TIER 4 - Expert ===
  {
    id: 'visionary_leadership',
    name: 'Leadership Visionnaire',
    description: 'Inspirer et transformer',
    category: 'management',
    tier: 4,
    icon: 'Sparkles',
    cost: 4,
    prerequisites: ['corporate_strategy'],
    maxLevel: 3,
    specialization: 'entrepreneur_visionnaire',
    effects: [
      { type: 'reputation_gain', value: 10, description: '+10% réputation par niveau', perLevel: true },
      { type: 'employee_morale', value: 10, description: '+10% moral par niveau', perLevel: true },
      { type: 'special_ability', value: 1, description: 'Débloque "Discours Inspirant"' }
    ]
  },
  {
    id: 'financial_engineering',
    name: 'Ingénierie Financière',
    description: 'Structures financières complexes',
    category: 'finance',
    tier: 4,
    icon: 'Landmark',
    cost: 4,
    prerequisites: ['mergers_acquisitions'],
    maxLevel: 3,
    specialization: 'genie_financier',
    effects: [
      { type: 'investment_returns', value: 15, description: '+15% rendements par niveau', perLevel: true },
      { type: 'loan_interest_reduction', value: 10, description: '-10% intérêts par niveau', perLevel: true },
      { type: 'special_ability', value: 1, description: 'Débloque "Montage Financier"' }
    ]
  },
  {
    id: 'market_domination',
    name: 'Domination de Marché',
    description: 'Écraser la concurrence',
    category: 'marketing',
    tier: 4,
    icon: 'Trophy',
    cost: 4,
    prerequisites: ['brand_empire'],
    maxLevel: 3,
    specialization: 'maitre_marketing',
    effects: [
      { type: 'sales_conversion', value: 15, description: '+15% conversion par niveau', perLevel: true },
      { type: 'brand_awareness', value: 15, description: '+15% notoriété par niveau', perLevel: true },
      { type: 'special_ability', value: 1, description: 'Débloque "Campagne Virale"' }
    ]
  },
  {
    id: 'tech_singularity',
    name: 'Singularité Tech',
    description: 'Pionnier technologique',
    category: 'technology',
    tier: 4,
    icon: 'Atom',
    cost: 4,
    prerequisites: ['ai_integration'],
    maxLevel: 3,
    specialization: 'innovateur_tech',
    effects: [
      { type: 'innovation_chance', value: 25, description: '+25% chance innovation par niveau', perLevel: true },
      { type: 'research_speed', value: 20, description: '+20% vitesse R&D par niveau', perLevel: true },
      { type: 'special_ability', value: 1, description: 'Débloque "Percée Scientifique"' }
    ]
  },
  {
    id: 'people_first',
    name: 'Les Gens d\'Abord',
    description: 'Culture d\'entreprise exceptionnelle',
    category: 'hr',
    tier: 4,
    icon: 'HeartHandshake',
    cost: 4,
    prerequisites: ['talent_factory'],
    maxLevel: 3,
    specialization: 'stratege_rh',
    effects: [
      { type: 'employee_productivity', value: 20, description: '+20% productivité par niveau', perLevel: true },
      { type: 'employee_morale', value: 20, description: '+20% moral par niveau', perLevel: true },
      { type: 'special_ability', value: 1, description: 'Débloque "Retraite Team Building"' }
    ]
  },
  {
    id: 'industrial_titan',
    name: 'Titan Industriel',
    description: 'Empire de production',
    category: 'production',
    tier: 4,
    icon: 'Factory',
    cost: 4,
    prerequisites: ['industry_40'],
    maxLevel: 3,
    specialization: 'magnat_industriel',
    effects: [
      { type: 'production_efficiency', value: 25, description: '+25% efficacité par niveau', perLevel: true },
      { type: 'cost_reduction', value: 15, description: '-15% coûts par niveau', perLevel: true },
      { type: 'special_ability', value: 1, description: 'Débloque "Méga-Usine"' }
    ]
  },
  {
    id: 'world_player',
    name: 'Acteur Mondial',
    description: 'Influence internationale',
    category: 'international',
    tier: 4,
    icon: 'Earth',
    cost: 4,
    prerequisites: ['global_operations'],
    maxLevel: 3,
    specialization: 'diplomate_international',
    effects: [
      { type: 'international_expansion', value: 30, description: '+30% succès international par niveau', perLevel: true },
      { type: 'diplomacy_bonus', value: 20, description: '+20% diplomatie par niveau', perLevel: true },
      { type: 'special_ability', value: 1, description: 'Débloque "Sommet Économique"' }
    ]
  },
  {
    id: 'legal_empire',
    name: 'Empire Juridique',
    description: 'Invincibilité légale',
    category: 'legal',
    tier: 4,
    icon: 'Gavel',
    cost: 4,
    prerequisites: ['regulatory_mastery'],
    maxLevel: 3,
    effects: [
      { type: 'legal_protection', value: 30, description: '+30% protection par niveau', perLevel: true },
      { type: 'tax_optimization', value: 15, description: '+15% optimisation fiscale par niveau', perLevel: true }
    ]
  },

  // === TIER 5 - Maîtrise ===
  {
    id: 'business_legend',
    name: 'Légende du Business',
    description: 'Statut légendaire',
    category: 'management',
    tier: 5,
    icon: 'Crown',
    cost: 5,
    prerequisites: ['visionary_leadership'],
    maxLevel: 1,
    effects: [
      { type: 'revenue_bonus', value: 25, description: '+25% revenus' },
      { type: 'reputation_gain', value: 25, description: '+25% réputation' },
      { type: 'special_ability', value: 1, description: 'Débloque le mode Dynastie' }
    ]
  },
  {
    id: 'financial_god',
    name: 'Dieu de la Finance',
    description: 'Maîtrise absolue des marchés',
    category: 'finance',
    tier: 5,
    icon: 'Gem',
    cost: 5,
    prerequisites: ['financial_engineering'],
    maxLevel: 1,
    effects: [
      { type: 'investment_returns', value: 50, description: '+50% rendements' },
      { type: 'special_ability', value: 1, description: 'Débloque "Manipulation de Marché"' }
    ]
  },
  {
    id: 'tech_prophet',
    name: 'Prophète Tech',
    description: 'Visionnaire technologique',
    category: 'technology',
    tier: 5,
    icon: 'Rocket',
    cost: 5,
    prerequisites: ['tech_singularity'],
    maxLevel: 1,
    effects: [
      { type: 'innovation_chance', value: 50, description: '+50% chance innovation' },
      { type: 'special_ability', value: 1, description: 'Débloque "Technologie Révolutionnaire"' }
    ]
  },
];

// Définition des spécialisations
export const SPECIALIZATION_DEFINITIONS: Specialization[] = [
  {
    id: 'entrepreneur_visionnaire',
    name: 'Entrepreneur Visionnaire',
    description: 'Un leader qui inspire et transforme les industries',
    icon: 'Sparkles',
    color: 'from-amber-500 to-orange-600',
    requiredSkills: ['visionary_leadership', 'corporate_strategy', 'leadership_basics'],
    bonuses: [
      { type: 'reputation_gain', value: 20, description: '+20% gain de réputation' },
      { type: 'employee_morale', value: 15, description: '+15% moral employés' }
    ],
    ultimateAbility: {
      id: 'inspirational_speech',
      name: 'Discours Inspirant',
      description: 'Boost massif du moral et de la productivité pendant 30 jours',
      cooldown: 90,
      effect: () => {},
      isActive: false
    }
  },
  {
    id: 'magnat_industriel',
    name: 'Magnat Industriel',
    description: 'Maître de la production à grande échelle',
    icon: 'Factory',
    color: 'from-gray-600 to-slate-800',
    requiredSkills: ['industrial_titan', 'industry_40', 'lean_manufacturing'],
    bonuses: [
      { type: 'production_efficiency', value: 30, description: '+30% efficacité production' },
      { type: 'cost_reduction', value: 20, description: '-20% coûts de production' }
    ],
    ultimateAbility: {
      id: 'mega_factory',
      name: 'Méga-Usine',
      description: 'Construit une usine géante avec 50% de capacité bonus',
      cooldown: 120,
      effect: () => {},
      isActive: false
    }
  },
  {
    id: 'genie_financier',
    name: 'Génie Financier',
    description: 'Expert en ingénierie financière complexe',
    icon: 'Landmark',
    color: 'from-emerald-500 to-teal-700',
    requiredSkills: ['financial_engineering', 'mergers_acquisitions', 'investment_analysis'],
    bonuses: [
      { type: 'investment_returns', value: 25, description: '+25% rendements investissements' },
      { type: 'loan_interest_reduction', value: 15, description: '-15% intérêts emprunts' }
    ],
    ultimateAbility: {
      id: 'financial_wizardry',
      name: 'Montage Financier',
      description: 'Réorganise les finances pour un gain immédiat de 20% de trésorerie',
      cooldown: 60,
      effect: () => {},
      isActive: false
    }
  },
  {
    id: 'innovateur_tech',
    name: 'Innovateur Tech',
    description: 'Pionnier des technologies de rupture',
    icon: 'Atom',
    color: 'from-cyan-500 to-blue-700',
    requiredSkills: ['tech_singularity', 'ai_integration', 'innovation_culture'],
    bonuses: [
      { type: 'research_speed', value: 30, description: '+30% vitesse R&D' },
      { type: 'innovation_chance', value: 35, description: '+35% chance d\'innovation' }
    ],
    ultimateAbility: {
      id: 'breakthrough',
      name: 'Percée Scientifique',
      description: 'Garantit une innovation majeure immédiate',
      cooldown: 150,
      effect: () => {},
      isActive: false
    }
  },
  {
    id: 'maitre_marketing',
    name: 'Maître du Marketing',
    description: 'Créateur de marques iconiques',
    icon: 'Megaphone',
    color: 'from-pink-500 to-rose-700',
    requiredSkills: ['market_domination', 'brand_empire', 'digital_marketing'],
    bonuses: [
      { type: 'brand_awareness', value: 30, description: '+30% notoriété de marque' },
      { type: 'sales_conversion', value: 20, description: '+20% conversion ventes' }
    ],
    ultimateAbility: {
      id: 'viral_campaign',
      name: 'Campagne Virale',
      description: 'Lance une campagne qui double les ventes pendant 14 jours',
      cooldown: 45,
      effect: () => {},
      isActive: false
    }
  },
  {
    id: 'diplomate_international',
    name: 'Diplomate International',
    description: 'Négociateur mondial influent',
    icon: 'Globe',
    color: 'from-indigo-500 to-purple-700',
    requiredSkills: ['world_player', 'global_operations', 'export_expertise'],
    bonuses: [
      { type: 'international_expansion', value: 40, description: '+40% succès expansion internationale' },
      { type: 'diplomacy_bonus', value: 30, description: '+30% bonus diplomatie' }
    ],
    ultimateAbility: {
      id: 'economic_summit',
      name: 'Sommet Économique',
      description: 'Organise un sommet qui ouvre tous les marchés',
      cooldown: 180,
      effect: () => {},
      isActive: false
    }
  },
  {
    id: 'stratege_rh',
    name: 'Stratège RH',
    description: 'Créateur de cultures d\'entreprise exceptionnelles',
    icon: 'Users',
    color: 'from-violet-500 to-fuchsia-700',
    requiredSkills: ['people_first', 'talent_factory', 'talent_retention'],
    bonuses: [
      { type: 'employee_productivity', value: 30, description: '+30% productivité employés' },
      { type: 'employee_morale', value: 30, description: '+30% moral employés' }
    ],
    ultimateAbility: {
      id: 'team_retreat',
      name: 'Retraite Team Building',
      description: 'Maximise le moral et la cohésion pendant 60 jours',
      cooldown: 90,
      effect: () => {},
      isActive: false
    }
  },
  {
    id: 'baron_immobilier',
    name: 'Baron Immobilier',
    description: 'Maître de l\'empire immobilier',
    icon: 'Building',
    color: 'from-amber-600 to-yellow-800',
    requiredSkills: ['legal_empire', 'financial_engineering'],
    bonuses: [
      { type: 'cost_reduction', value: 25, description: '-25% coûts immobiliers' },
      { type: 'investment_returns', value: 20, description: '+20% rendements immobiliers' }
    ],
    ultimateAbility: {
      id: 'property_empire',
      name: 'Empire Immobilier',
      description: 'Acquisition automatique du meilleur bien disponible',
      cooldown: 120,
      effect: () => {},
      isActive: false
    }
  }
];

// Jalons de progression
export const SKILL_MILESTONES: SkillMilestone[] = [
  {
    id: 'first_skill',
    name: 'Premier Pas',
    description: 'Débloquer votre première compétence',
    requirement: { type: 'skills_unlocked', value: 1 },
    reward: { type: 'skill_points', value: 1 },
    isCompleted: false
  },
  {
    id: 'tier1_complete',
    name: 'Fondations Solides',
    description: 'Débloquer 10 compétences de Tier 1',
    requirement: { type: 'skills_unlocked', value: 10 },
    reward: { type: 'skill_points', value: 3 },
    isCompleted: false
  },
  {
    id: 'reach_tier2',
    name: 'En Progression',
    description: 'Atteindre le Tier 2',
    requirement: { type: 'tier_reached', value: 2 },
    reward: { type: 'skill_points', value: 2 },
    isCompleted: false
  },
  {
    id: 'master_category',
    name: 'Spécialiste',
    description: 'Maximiser toutes les compétences d\'une catégorie',
    requirement: { type: 'category_mastered', value: 1 },
    reward: { type: 'skill_points', value: 5 },
    isCompleted: false
  },
  {
    id: 'reach_tier3',
    name: 'Expert',
    description: 'Atteindre le Tier 3',
    requirement: { type: 'tier_reached', value: 3 },
    reward: { type: 'skill_points', value: 3 },
    isCompleted: false
  },
  {
    id: 'reach_tier4',
    name: 'Maître',
    description: 'Atteindre le Tier 4',
    requirement: { type: 'tier_reached', value: 4 },
    reward: { type: 'unlock_specialization', value: 'any' },
    isCompleted: false
  },
  {
    id: 'total_levels_50',
    name: 'Polyvalent',
    description: 'Accumuler 50 niveaux de compétences',
    requirement: { type: 'total_levels', value: 50 },
    reward: { type: 'skill_points', value: 5 },
    isCompleted: false
  },
  {
    id: 'reach_tier5',
    name: 'Légende',
    description: 'Atteindre le Tier 5',
    requirement: { type: 'tier_reached', value: 5 },
    reward: { type: 'permanent_bonus', value: 1, effect: { type: 'revenue_bonus', value: 10, description: '+10% revenus permanent' } },
    isCompleted: false
  }
];
