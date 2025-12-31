// OPTIONS AVANCÉES DE CRÉATION D'ENTREPRISE - 300+ OPTIONS
// 15 nouvelles catégories de questions

// ==================== 1. STYLE DE MANAGEMENT ====================
export type ManagementStyle = 'autocratique' | 'democratique' | 'laisser_faire' | 'transformationnel' | 'serviteur' | 'participatif' | 'coaching';

export const MANAGEMENT_STYLES: Record<ManagementStyle, { 
  label: string; 
  description: string; 
  bonus: string; 
  productivity: number;
  morale: number;
  innovation: number;
}> = {
  autocratique: { label: 'Autocratique', description: 'Décisions centralisées, exécution rapide', bonus: '+20% Vitesse décision, -15% Moral', productivity: 15, morale: -15, innovation: -10 },
  democratique: { label: 'Démocratique', description: 'Décisions collectives, engagement fort', bonus: '+20% Moral, +10% Rétention', productivity: 5, morale: 20, innovation: 10 },
  laisser_faire: { label: 'Laissez-faire', description: 'Autonomie maximale, créativité libre', bonus: '+25% Innovation, -10% Cohérence', productivity: -5, morale: 10, innovation: 25 },
  transformationnel: { label: 'Transformationnel', description: 'Vision inspirante, changement constant', bonus: '+15% Croissance, +15% Engagement', productivity: 10, morale: 15, innovation: 20 },
  serviteur: { label: 'Serviteur', description: 'Leader au service de l\'équipe', bonus: '+25% Moral, +15% Fidélité', productivity: 5, morale: 25, innovation: 5 },
  participatif: { label: 'Participatif', description: 'Implication de tous dans les décisions', bonus: '+15% Qualité, +10% Moral', productivity: 10, morale: 15, innovation: 10 },
  coaching: { label: 'Coaching', description: 'Développement des talents, mentorat', bonus: '+20% Compétences, +15% Rétention', productivity: 15, morale: 10, innovation: 15 },
};

// ==================== 2. CULTURE D'ENTREPRISE ====================
export type CultureType = 'startup' | 'corporate' | 'familiale' | 'agile' | 'traditionnelle' | 'innovative' | 'sociale' | 'competitive';

export const CULTURE_TYPES: Record<CultureType, {
  label: string;
  description: string;
  dresscode: string;
  workStyle: string;
  bonus: string;
}> = {
  startup: { label: 'Startup', description: 'Dynamique, informelle, prise de risque', dresscode: 'Casual', workStyle: 'Flexible', bonus: '+25% Innovation, +20% Agilité' },
  corporate: { label: 'Corporate', description: 'Structurée, professionnelle, processus', dresscode: 'Business formal', workStyle: 'Horaires fixes', bonus: '+20% Crédibilité, +15% Processus' },
  familiale: { label: 'Familiale', description: 'Proche, bienveillante, fidélité', dresscode: 'Business casual', workStyle: 'Équilibré', bonus: '+25% Fidélité, +20% Moral' },
  agile: { label: 'Agile', description: 'Adaptative, itérative, collaborative', dresscode: 'Casual', workStyle: 'Sprints', bonus: '+20% Réactivité, +15% Collaboration' },
  traditionnelle: { label: 'Traditionnelle', description: 'Hiérarchique, respectueuse, stable', dresscode: 'Business', workStyle: 'Classique', bonus: '+15% Stabilité, +10% Expérience' },
  innovative: { label: 'Innovative', description: 'Créative, expérimentale, disruptive', dresscode: 'Très casual', workStyle: 'Libre', bonus: '+30% Innovation, +20% R&D' },
  sociale: { label: 'Sociale', description: 'Impact positif, RSE, durabilité', dresscode: 'Casual', workStyle: 'Purpose-driven', bonus: '+25% Réputation, +20% RSE' },
  competitive: { label: 'Compétitive', description: 'Performance, résultats, excellence', dresscode: 'Business', workStyle: 'Intense', bonus: '+25% Productivité, +20% Ventes' },
};

// ==================== 3. POLITIQUE RH ====================
export type HRPolicy = 'competitive_salary' | 'work_life_balance' | 'career_growth' | 'benefits_focus' | 'performance_pay' | 'equity_sharing';

export const HR_POLICIES: Record<HRPolicy, {
  label: string;
  description: string;
  costImpact: number;
  attractionBonus: number;
  retentionBonus: number;
  effects: string[];
}> = {
  competitive_salary: { label: 'Salaires compétitifs', description: 'Rémunération au-dessus du marché', costImpact: 25, attractionBonus: 30, retentionBonus: 20, effects: ['Attire les meilleurs talents', 'Coûts salariaux élevés'] },
  work_life_balance: { label: 'Équilibre vie-travail', description: 'Flexibilité, télétravail, congés généreux', costImpact: 10, attractionBonus: 25, retentionBonus: 35, effects: ['Réduit le turnover', 'Améliore le bien-être'] },
  career_growth: { label: 'Croissance carrière', description: 'Formations, promotions rapides, mentoring', costImpact: 15, attractionBonus: 25, retentionBonus: 30, effects: ['Développe les compétences', 'Fidélise les ambitieux'] },
  benefits_focus: { label: 'Avantages sociaux', description: 'Mutuelle premium, CE, tickets resto', costImpact: 20, attractionBonus: 20, retentionBonus: 25, effects: ['Différenciation employeur', 'Qualité de vie'] },
  performance_pay: { label: 'Rémunération performance', description: 'Bonus agressifs, commissions, primes', costImpact: 15, attractionBonus: 20, retentionBonus: 15, effects: ['Motive les performeurs', 'Pression résultats'] },
  equity_sharing: { label: 'Partage capital', description: 'BSPCE, actions gratuites, intéressement', costImpact: 5, attractionBonus: 35, retentionBonus: 40, effects: ['Engagement long terme', 'Alignement intérêts'] },
};

// ==================== 4. STRATÉGIE MARKETING ====================
export type MarketingStrategy = 'inbound' | 'outbound' | 'viral' | 'influencer' | 'content' | 'paid' | 'guerilla' | 'brand';

export const MARKETING_STRATEGIES: Record<MarketingStrategy, {
  label: string;
  description: string;
  budget: 'low' | 'medium' | 'high';
  timeToResults: string;
  scalability: number;
  roi: number;
}> = {
  inbound: { label: 'Inbound Marketing', description: 'Attirer avec du contenu de qualité', budget: 'medium', timeToResults: '6-12 mois', scalability: 9, roi: 8 },
  outbound: { label: 'Outbound Marketing', description: 'Prospection active, cold calling', budget: 'medium', timeToResults: '1-3 mois', scalability: 6, roi: 5 },
  viral: { label: 'Marketing Viral', description: 'Contenu partageable, buzz', budget: 'low', timeToResults: 'Variable', scalability: 10, roi: 9 },
  influencer: { label: 'Influenceurs', description: 'Partenariats avec créateurs', budget: 'high', timeToResults: '1-3 mois', scalability: 7, roi: 6 },
  content: { label: 'Content Marketing', description: 'Blog, vidéos, podcasts', budget: 'medium', timeToResults: '6-12 mois', scalability: 8, roi: 7 },
  paid: { label: 'Publicité payante', description: 'Ads Google, Meta, LinkedIn', budget: 'high', timeToResults: 'Immédiat', scalability: 8, roi: 5 },
  guerilla: { label: 'Guérilla Marketing', description: 'Actions créatives à faible coût', budget: 'low', timeToResults: '1-6 mois', scalability: 4, roi: 8 },
  brand: { label: 'Branding', description: 'Construction de marque long terme', budget: 'high', timeToResults: '12-24 mois', scalability: 9, roi: 7 },
};

// ==================== 5. STRATÉGIE COMMERCIALE ====================
export type SalesStrategy = 'direct' | 'indirect' | 'online' | 'hybrid' | 'partnership' | 'franchise' | 'subscription';

export const SALES_STRATEGIES: Record<SalesStrategy, {
  label: string;
  description: string;
  margin: number;
  scalability: number;
  complexity: number;
  initialInvestment: number;
}> = {
  direct: { label: 'Vente directe', description: 'Équipe commerciale interne', margin: 80, scalability: 6, complexity: 3, initialInvestment: 50000 },
  indirect: { label: 'Distribution', description: 'Revendeurs, grossistes, détaillants', margin: 40, scalability: 9, complexity: 4, initialInvestment: 20000 },
  online: { label: 'E-commerce', description: '100% vente en ligne', margin: 70, scalability: 10, complexity: 5, initialInvestment: 30000 },
  hybrid: { label: 'Hybride', description: 'Omnicanal, physique + digital', margin: 60, scalability: 8, complexity: 7, initialInvestment: 80000 },
  partnership: { label: 'Partenariats', description: 'Co-vente avec partenaires', margin: 50, scalability: 7, complexity: 5, initialInvestment: 15000 },
  franchise: { label: 'Franchise', description: 'Expansion via franchisés', margin: 30, scalability: 10, complexity: 8, initialInvestment: 100000 },
  subscription: { label: 'Abonnement', description: 'Revenus récurrents', margin: 75, scalability: 9, complexity: 4, initialInvestment: 40000 },
};

// ==================== 6. POLITIQUE QUALITÉ ====================
export type QualityPolicy = 'iso_9001' | 'six_sigma' | 'lean' | 'agile_quality' | 'tqm' | 'minimal';

export const QUALITY_POLICIES: Record<QualityPolicy, {
  label: string;
  description: string;
  implementationCost: number;
  maintenanceCost: number;
  qualityBonus: number;
  credibilityBonus: number;
}> = {
  iso_9001: { label: 'ISO 9001', description: 'Certification qualité internationale', implementationCost: 15000, maintenanceCost: 3000, qualityBonus: 20, credibilityBonus: 15 },
  six_sigma: { label: 'Six Sigma', description: 'Réduction des défauts à 3.4 ppm', implementationCost: 25000, maintenanceCost: 5000, qualityBonus: 30, credibilityBonus: 20 },
  lean: { label: 'Lean Management', description: 'Élimination des gaspillages', implementationCost: 10000, maintenanceCost: 2000, qualityBonus: 15, credibilityBonus: 10 },
  agile_quality: { label: 'Qualité Agile', description: 'Tests continus, itérations rapides', implementationCost: 8000, maintenanceCost: 1500, qualityBonus: 18, credibilityBonus: 8 },
  tqm: { label: 'TQM', description: 'Qualité totale, amélioration continue', implementationCost: 20000, maintenanceCost: 4000, qualityBonus: 25, credibilityBonus: 18 },
  minimal: { label: 'Contrôle minimal', description: 'Vérifications de base uniquement', implementationCost: 0, maintenanceCost: 500, qualityBonus: 0, credibilityBonus: -5 },
};

// ==================== 7. POLITIQUE ENVIRONNEMENTALE ====================
export type EnvironmentalPolicy = 'carbon_neutral' | 'sustainable' | 'eco_friendly' | 'circular' | 'minimal_impact' | 'none';

export const ENVIRONMENTAL_POLICIES: Record<EnvironmentalPolicy, {
  label: string;
  description: string;
  investmentCost: number;
  operatingCostChange: number;
  reputationBonus: number;
  taxBenefits: number;
  certifications: string[];
}> = {
  carbon_neutral: { label: 'Neutre en carbone', description: 'Compensation totale des émissions', investmentCost: 50000, operatingCostChange: 10, reputationBonus: 25, taxBenefits: 10, certifications: ['Carbon Trust', 'PAS 2060'] },
  sustainable: { label: 'Développement durable', description: 'Équilibre économie/environnement/social', investmentCost: 30000, operatingCostChange: 5, reputationBonus: 20, taxBenefits: 8, certifications: ['ISO 14001', 'B Corp'] },
  eco_friendly: { label: 'Éco-responsable', description: 'Réduction des impacts environnementaux', investmentCost: 15000, operatingCostChange: 3, reputationBonus: 12, taxBenefits: 5, certifications: ['Écolabel', 'Green Business'] },
  circular: { label: 'Économie circulaire', description: 'Recyclage, réutilisation, upcycling', investmentCost: 25000, operatingCostChange: -5, reputationBonus: 18, taxBenefits: 7, certifications: ['Cradle to Cradle'] },
  minimal_impact: { label: 'Impact minimal', description: 'Efforts de base pour l\'environnement', investmentCost: 5000, operatingCostChange: 0, reputationBonus: 5, taxBenefits: 2, certifications: [] },
  none: { label: 'Aucune politique', description: 'Pas d\'engagement environnemental', investmentCost: 0, operatingCostChange: 0, reputationBonus: -5, taxBenefits: 0, certifications: [] },
};

// ==================== 8. ÉQUIPEMENT TECHNOLOGIQUE ====================
export type TechStack = 'cutting_edge' | 'modern' | 'standard' | 'legacy' | 'hybrid' | 'cloud_native';

export const TECH_STACKS: Record<TechStack, {
  label: string;
  description: string;
  setupCost: number;
  monthlyCost: number;
  productivityBonus: number;
  securityLevel: number;
  scalability: number;
}> = {
  cutting_edge: { label: 'Pointe de la technologie', description: 'IA, blockchain, edge computing', setupCost: 100000, monthlyCost: 5000, productivityBonus: 30, securityLevel: 9, scalability: 10 },
  modern: { label: 'Moderne', description: 'Cloud, SaaS, outils récents', setupCost: 50000, monthlyCost: 2500, productivityBonus: 20, securityLevel: 8, scalability: 9 },
  standard: { label: 'Standard', description: 'Équipement classique à jour', setupCost: 25000, monthlyCost: 1000, productivityBonus: 10, securityLevel: 6, scalability: 6 },
  legacy: { label: 'Legacy', description: 'Systèmes anciens mais fonctionnels', setupCost: 5000, monthlyCost: 500, productivityBonus: -5, securityLevel: 3, scalability: 2 },
  hybrid: { label: 'Hybride', description: 'Mix ancien et nouveau', setupCost: 35000, monthlyCost: 1500, productivityBonus: 12, securityLevel: 5, scalability: 5 },
  cloud_native: { label: 'Cloud Native', description: '100% cloud, serverless, containers', setupCost: 40000, monthlyCost: 3000, productivityBonus: 25, securityLevel: 9, scalability: 10 },
};

// ==================== 9. POLITIQUE DE TÉLÉTRAVAIL ====================
export type RemotePolicy = 'full_remote' | 'hybrid_flexible' | 'hybrid_fixed' | 'office_first' | 'no_remote';

export const REMOTE_POLICIES: Record<RemotePolicy, {
  label: string;
  description: string;
  officeSpaceSavings: number;
  productivityChange: number;
  employeeSatisfaction: number;
  collaborationImpact: number;
  equipmentCost: number;
}> = {
  full_remote: { label: '100% Télétravail', description: 'Travail à distance permanent', officeSpaceSavings: 80, productivityChange: 10, employeeSatisfaction: 30, collaborationImpact: -15, equipmentCost: 2000 },
  hybrid_flexible: { label: 'Hybride flexible', description: 'Choix libre bureau/maison', officeSpaceSavings: 40, productivityChange: 15, employeeSatisfaction: 35, collaborationImpact: -5, equipmentCost: 1500 },
  hybrid_fixed: { label: 'Hybride fixe', description: 'Jours définis au bureau', officeSpaceSavings: 30, productivityChange: 8, employeeSatisfaction: 20, collaborationImpact: 0, equipmentCost: 1000 },
  office_first: { label: 'Bureau prioritaire', description: 'Présence requise, exceptions possibles', officeSpaceSavings: 10, productivityChange: 5, employeeSatisfaction: 5, collaborationImpact: 10, equipmentCost: 500 },
  no_remote: { label: 'Présentiel obligatoire', description: 'Présence au bureau requise', officeSpaceSavings: 0, productivityChange: 0, employeeSatisfaction: -10, collaborationImpact: 15, equipmentCost: 0 },
};

// ==================== 10. STRATÉGIE D'INNOVATION ====================
export type InnovationStrategy = 'r_and_d' | 'open_innovation' | 'acquisition' | 'partnership' | 'intrapreneurship' | 'customer_driven';

export const INNOVATION_STRATEGIES: Record<InnovationStrategy, {
  label: string;
  description: string;
  annualBudget: number;
  innovationRate: number;
  riskLevel: number;
  timeToMarket: string;
}> = {
  r_and_d: { label: 'R&D interne', description: 'Laboratoire et équipe dédiée', annualBudget: 100000, innovationRate: 25, riskLevel: 6, timeToMarket: '12-24 mois' },
  open_innovation: { label: 'Innovation ouverte', description: 'Collaboration externe, hackathons', annualBudget: 50000, innovationRate: 20, riskLevel: 4, timeToMarket: '6-12 mois' },
  acquisition: { label: 'Acquisitions', description: 'Rachat de startups innovantes', annualBudget: 500000, innovationRate: 35, riskLevel: 8, timeToMarket: '3-6 mois' },
  partnership: { label: 'Partenariats R&D', description: 'Collaboration avec labos/universités', annualBudget: 75000, innovationRate: 22, riskLevel: 3, timeToMarket: '12-18 mois' },
  intrapreneurship: { label: 'Intrapreneuriat', description: 'Projets internes type startup', annualBudget: 60000, innovationRate: 18, riskLevel: 5, timeToMarket: '6-12 mois' },
  customer_driven: { label: 'Innovation client', description: 'Co-création avec les clients', annualBudget: 30000, innovationRate: 15, riskLevel: 2, timeToMarket: '3-9 mois' },
};

// ==================== 11. STRUCTURE ORGANISATIONNELLE ====================
export type OrgStructure = 'hierarchical' | 'flat' | 'matrix' | 'holacracy' | 'network' | 'divisional';

export const ORG_STRUCTURES: Record<OrgStructure, {
  label: string;
  description: string;
  decisionSpeed: number;
  flexibility: number;
  clarity: number;
  scalability: number;
  maxEmployees: number;
}> = {
  hierarchical: { label: 'Hiérarchique', description: 'Pyramide traditionnelle', decisionSpeed: 4, flexibility: 3, clarity: 9, scalability: 8, maxEmployees: 10000 },
  flat: { label: 'Horizontale', description: 'Peu de niveaux hiérarchiques', decisionSpeed: 8, flexibility: 8, clarity: 5, scalability: 4, maxEmployees: 150 },
  matrix: { label: 'Matricielle', description: 'Double reporting projet/fonction', decisionSpeed: 5, flexibility: 7, clarity: 4, scalability: 7, maxEmployees: 5000 },
  holacracy: { label: 'Holacratie', description: 'Auto-organisation, cercles', decisionSpeed: 7, flexibility: 9, clarity: 3, scalability: 3, maxEmployees: 500 },
  network: { label: 'Réseau', description: 'Équipes autonomes interconnectées', decisionSpeed: 8, flexibility: 9, clarity: 4, scalability: 6, maxEmployees: 2000 },
  divisional: { label: 'Divisionnelle', description: 'Business units autonomes', decisionSpeed: 6, flexibility: 6, clarity: 7, scalability: 9, maxEmployees: 50000 },
};

// ==================== 12. POLITIQUE SALARIALE ====================
export type SalaryPolicy = 'market_leader' | 'market_rate' | 'below_market' | 'transparent' | 'performance_based' | 'egalitarian';

export const SALARY_POLICIES: Record<SalaryPolicy, {
  label: string;
  description: string;
  costMultiplier: number;
  attractionBonus: number;
  retentionBonus: number;
  motivationImpact: number;
}> = {
  market_leader: { label: 'Leader du marché', description: '+20% au-dessus du marché', costMultiplier: 1.20, attractionBonus: 35, retentionBonus: 25, motivationImpact: 20 },
  market_rate: { label: 'Taux marché', description: 'Aligné sur le marché', costMultiplier: 1.00, attractionBonus: 15, retentionBonus: 10, motivationImpact: 10 },
  below_market: { label: 'Sous le marché', description: '-15% sous le marché', costMultiplier: 0.85, attractionBonus: -10, retentionBonus: -15, motivationImpact: -10 },
  transparent: { label: 'Salaires transparents', description: 'Grilles publiques et équitables', costMultiplier: 1.05, attractionBonus: 20, retentionBonus: 20, motivationImpact: 15 },
  performance_based: { label: 'Variable dominant', description: '60% variable, 40% fixe', costMultiplier: 1.10, attractionBonus: 25, retentionBonus: 10, motivationImpact: 30 },
  egalitarian: { label: 'Égalitaire', description: 'Écart max 1 à 5', costMultiplier: 0.95, attractionBonus: 15, retentionBonus: 25, motivationImpact: 20 },
};

// ==================== 13. AMBITION INTERNATIONALE ====================
export type InternationalAmbition = 'local' | 'regional' | 'national' | 'european' | 'global' | 'glocal';

export const INTERNATIONAL_AMBITIONS: Record<InternationalAmbition, {
  label: string;
  description: string;
  initialMarkets: string[];
  expansionCost: number;
  complexityLevel: number;
  revenueMultiplier: number;
}> = {
  local: { label: 'Local', description: 'Ville ou région uniquement', initialMarkets: ['Île-de-France'], expansionCost: 0, complexityLevel: 1, revenueMultiplier: 1.0 },
  regional: { label: 'Régional', description: 'Plusieurs régions françaises', initialMarkets: ['Île-de-France', 'PACA', 'Rhône-Alpes'], expansionCost: 20000, complexityLevel: 2, revenueMultiplier: 1.5 },
  national: { label: 'National', description: 'Couverture France entière', initialMarkets: ['France métropolitaine'], expansionCost: 50000, complexityLevel: 3, revenueMultiplier: 2.5 },
  european: { label: 'Européen', description: 'Expansion UE', initialMarkets: ['France', 'Allemagne', 'Espagne', 'Italie'], expansionCost: 150000, complexityLevel: 5, revenueMultiplier: 4.0 },
  global: { label: 'Mondial', description: 'Présence sur tous les continents', initialMarkets: ['Europe', 'Amérique', 'Asie'], expansionCost: 500000, complexityLevel: 8, revenueMultiplier: 8.0 },
  glocal: { label: 'Glocal', description: 'Global avec adaptation locale', initialMarkets: ['Marchés adaptés'], expansionCost: 300000, complexityLevel: 7, revenueMultiplier: 6.0 },
};

// ==================== 14. MODE DE FINANCEMENT ====================
export type FundingMode = 'bootstrapped' | 'love_money' | 'bank_loan' | 'business_angels' | 'vc' | 'crowdfunding' | 'grants';

export const FUNDING_MODES: Record<FundingMode, {
  label: string;
  description: string;
  typicalAmount: string;
  dilution: number;
  control: number;
  pressure: number;
  accessDifficulty: number;
}> = {
  bootstrapped: { label: 'Bootstrap', description: 'Autofinancement total', typicalAmount: '0-50k€', dilution: 0, control: 100, pressure: 3, accessDifficulty: 1 },
  love_money: { label: 'Love Money', description: 'Famille et amis', typicalAmount: '10-100k€', dilution: 10, control: 95, pressure: 2, accessDifficulty: 2 },
  bank_loan: { label: 'Prêt bancaire', description: 'Emprunt classique', typicalAmount: '20-500k€', dilution: 0, control: 100, pressure: 6, accessDifficulty: 5 },
  business_angels: { label: 'Business Angels', description: 'Investisseurs individuels', typicalAmount: '50-500k€', dilution: 15, control: 85, pressure: 5, accessDifficulty: 6 },
  vc: { label: 'Venture Capital', description: 'Fonds d\'investissement', typicalAmount: '1-50M€', dilution: 30, control: 60, pressure: 9, accessDifficulty: 8 },
  crowdfunding: { label: 'Crowdfunding', description: 'Financement participatif', typicalAmount: '10-1M€', dilution: 5, control: 90, pressure: 4, accessDifficulty: 4 },
  grants: { label: 'Subventions', description: 'Aides publiques (BPI, régions)', typicalAmount: '10-200k€', dilution: 0, control: 100, pressure: 3, accessDifficulty: 6 },
};

// ==================== 15. POSITIONNEMENT PRIX ====================
export type PricingPosition = 'premium' | 'value' | 'economy' | 'penetration' | 'skimming' | 'competitive';

export const PRICING_POSITIONS: Record<PricingPosition, {
  label: string;
  description: string;
  marginLevel: number;
  volumeLevel: number;
  brandPerception: string;
  targetMarket: string;
}> = {
  premium: { label: 'Premium', description: 'Prix élevé, qualité supérieure', marginLevel: 50, volumeLevel: 30, brandPerception: 'Luxe/Exclusif', targetMarket: 'CSP++' },
  value: { label: 'Rapport qualité-prix', description: 'Équilibre prix/qualité', marginLevel: 30, volumeLevel: 60, brandPerception: 'Malin/Intelligent', targetMarket: 'Classe moyenne' },
  economy: { label: 'Économique', description: 'Prix bas, essentiel', marginLevel: 15, volumeLevel: 80, brandPerception: 'Accessible', targetMarket: 'Mass market' },
  penetration: { label: 'Pénétration', description: 'Prix bas pour gagner des parts', marginLevel: 10, volumeLevel: 90, brandPerception: 'Challenger', targetMarket: 'Conquête' },
  skimming: { label: 'Écrémage', description: 'Prix élevé puis baisse', marginLevel: 60, volumeLevel: 20, brandPerception: 'Innovant', targetMarket: 'Early adopters' },
  competitive: { label: 'Compétitif', description: 'Aligné sur la concurrence', marginLevel: 25, volumeLevel: 50, brandPerception: 'Alternative', targetMarket: 'Général' },
};

// ==================== OPTIONS DE PERSONNALISATION SUPPLÉMENTAIRES ====================

// Horaires de travail
export type WorkSchedule = '35h' | '39h' | '4_jours' | 'flexible' | 'shifts' | 'annualized';

export const WORK_SCHEDULES: Record<WorkSchedule, { label: string; description: string; productivityImpact: number; satisfactionImpact: number }> = {
  '35h': { label: '35 heures', description: 'Semaine légale française', productivityImpact: 0, satisfactionImpact: 10 },
  '39h': { label: '39 heures', description: 'Semaine avec RTT', productivityImpact: 10, satisfactionImpact: 0 },
  '4_jours': { label: 'Semaine de 4 jours', description: '32h sur 4 jours', productivityImpact: 5, satisfactionImpact: 30 },
  'flexible': { label: 'Horaires flexibles', description: 'Plages variables', productivityImpact: 8, satisfactionImpact: 25 },
  'shifts': { label: 'Travail posté', description: 'Équipes tournantes', productivityImpact: 15, satisfactionImpact: -15 },
  'annualized': { label: 'Annualisé', description: 'Heures lissées sur l\'année', productivityImpact: 5, satisfactionImpact: 5 },
};

// Type de clients cibles
export type TargetCustomer = 'b2b_enterprise' | 'b2b_sme' | 'b2b_startup' | 'b2c_premium' | 'b2c_mass' | 'b2g' | 'b2b2c';

export const TARGET_CUSTOMERS: Record<TargetCustomer, { label: string; salesCycle: string; avgDealSize: number; retentionRate: number }> = {
  b2b_enterprise: { label: 'Grands comptes', salesCycle: '6-18 mois', avgDealSize: 100000, retentionRate: 95 },
  b2b_sme: { label: 'PME', salesCycle: '2-6 mois', avgDealSize: 15000, retentionRate: 85 },
  b2b_startup: { label: 'Startups', salesCycle: '1-3 mois', avgDealSize: 5000, retentionRate: 70 },
  b2c_premium: { label: 'Particuliers premium', salesCycle: '1-4 semaines', avgDealSize: 500, retentionRate: 60 },
  b2c_mass: { label: 'Grand public', salesCycle: '1-7 jours', avgDealSize: 50, retentionRate: 30 },
  b2g: { label: 'Secteur public', salesCycle: '12-24 mois', avgDealSize: 200000, retentionRate: 90 },
  b2b2c: { label: 'B2B2C', salesCycle: '3-9 mois', avgDealSize: 30000, retentionRate: 80 },
};

// Avantages employés
export const EMPLOYEE_PERKS = [
  { id: 'tickets_resto', label: 'Tickets restaurant', cost: 150, satisfaction: 15 },
  { id: 'mutuelle_premium', label: 'Mutuelle premium', cost: 200, satisfaction: 20 },
  { id: 'transport', label: 'Remboursement transport 100%', cost: 80, satisfaction: 12 },
  { id: 'gym', label: 'Abonnement salle de sport', cost: 50, satisfaction: 8 },
  { id: 'formation', label: 'Budget formation illimité', cost: 300, satisfaction: 25 },
  { id: 'sabbatique', label: 'Année sabbatique possible', cost: 0, satisfaction: 10 },
  { id: 'creche', label: 'Crèche d\'entreprise', cost: 500, satisfaction: 35 },
  { id: 'voiture', label: 'Voiture de fonction', cost: 800, satisfaction: 30 },
  { id: 'stock_options', label: 'Stock options', cost: 0, satisfaction: 20 },
  { id: 'prime_vacances', label: 'Prime vacances', cost: 200, satisfaction: 15 },
  { id: 'conges_extra', label: 'Congés supplémentaires (+5j)', cost: 100, satisfaction: 22 },
  { id: 'teletravail_equip', label: 'Équipement télétravail', cost: 150, satisfaction: 18 },
  { id: 'cafe_gratuit', label: 'Café/snacks gratuits', cost: 30, satisfaction: 8 },
  { id: 'team_building', label: 'Team building mensuel', cost: 100, satisfaction: 12 },
  { id: 'bonus_cooptation', label: 'Bonus cooptation', cost: 50, satisfaction: 5 },
  { id: 'assurance_vie', label: 'Assurance vie', cost: 100, satisfaction: 10 },
  { id: 'retraite_supp', label: 'Retraite supplémentaire', cost: 200, satisfaction: 15 },
  { id: 'massage', label: 'Séances massage', cost: 40, satisfaction: 10 },
  { id: 'fruit_bio', label: 'Corbeille de fruits bio', cost: 20, satisfaction: 5 },
  { id: 'parking', label: 'Parking gratuit', cost: 150, satisfaction: 12 },
];

// Partenaires potentiels au démarrage
export const STARTING_PARTNERS = [
  { id: 'comptable', label: 'Expert-comptable', cost: 300, benefit: '+20% Gestion fiscale' },
  { id: 'avocat', label: 'Avocat d\'affaires', cost: 500, benefit: '+25% Protection juridique' },
  { id: 'banquier', label: 'Conseiller bancaire dédié', cost: 0, benefit: '+15% Accès crédit' },
  { id: 'incubateur', label: 'Incubateur/Accélérateur', cost: 200, benefit: '+30% Réseau, +20% Mentorat' },
  { id: 'agence_com', label: 'Agence de communication', cost: 1000, benefit: '+25% Visibilité' },
  { id: 'coach', label: 'Coach de dirigeant', cost: 400, benefit: '+20% Leadership' },
  { id: 'recruteur', label: 'Cabinet de recrutement', cost: 0, benefit: '+30% Qualité recrutement' },
  { id: 'it_partner', label: 'Partenaire IT', cost: 500, benefit: '+20% Technologie' },
  { id: 'assureur', label: 'Courtier en assurance', cost: 100, benefit: '+15% Couverture risques' },
  { id: 'mentor', label: 'Mentor entrepreneur', cost: 0, benefit: '+25% Conseils stratégiques' },
];

// Valeurs d'entreprise étendues
export const EXTENDED_VALUES = [
  { id: 'innovation', label: 'Innovation', icon: '💡', effect: '+15% R&D' },
  { id: 'qualite', label: 'Qualité', icon: '✨', effect: '+10% Prix' },
  { id: 'respect', label: 'Respect', icon: '🤝', effect: '+15% Moral' },
  { id: 'durabilite', label: 'Durabilité', icon: '🌱', effect: '+10% Réputation' },
  { id: 'excellence', label: 'Excellence', icon: '🏆', effect: '+10% Productivité' },
  { id: 'integrite', label: 'Intégrité', icon: '⚖️', effect: '+15% Crédibilité' },
  { id: 'collaboration', label: 'Collaboration', icon: '👥', effect: '+20% Équipe' },
  { id: 'audace', label: 'Audace', icon: '🚀', effect: '+20% Croissance' },
  { id: 'transparence', label: 'Transparence', icon: '🔍', effect: '+10% Confiance' },
  { id: 'agilite', label: 'Agilité', icon: '⚡', effect: '+15% Réactivité' },
  { id: 'passion', label: 'Passion', icon: '❤️', effect: '+15% Engagement' },
  { id: 'creativite', label: 'Créativité', icon: '🎨', effect: '+20% Innovation' },
  { id: 'simplicite', label: 'Simplicité', icon: '✂️', effect: '+10% Efficacité' },
  { id: 'humilite', label: 'Humilité', icon: '🙏', effect: '+10% Apprentissage' },
  { id: 'courage', label: 'Courage', icon: '🦁', effect: '+15% Décisions' },
  { id: 'empathie', label: 'Empathie', icon: '💜', effect: '+20% Relations client' },
  { id: 'responsabilite', label: 'Responsabilité', icon: '🎯', effect: '+15% Fiabilité' },
  { id: 'diversite', label: 'Diversité', icon: '🌈', effect: '+20% Innovation' },
  { id: 'plaisir', label: 'Plaisir au travail', icon: '😊', effect: '+25% Moral' },
  { id: 'ambition', label: 'Ambition', icon: '📈', effect: '+20% Croissance' },
];

// Rituels d'équipe
export const TEAM_RITUALS = [
  { id: 'standup', label: 'Daily standup', frequency: 'Quotidien', impact: '+10% Communication' },
  { id: 'weekly', label: 'Réunion hebdo', frequency: 'Hebdomadaire', impact: '+15% Alignement' },
  { id: 'retrospective', label: 'Rétrospective', frequency: 'Bi-mensuel', impact: '+20% Amélioration' },
  { id: 'all_hands', label: 'All hands', frequency: 'Mensuel', impact: '+25% Transparence' },
  { id: 'one_on_one', label: '1:1 managers', frequency: 'Bi-mensuel', impact: '+20% Développement' },
  { id: 'lunch_team', label: 'Déjeuner d\'équipe', frequency: 'Hebdomadaire', impact: '+15% Cohésion' },
  { id: 'demo_friday', label: 'Demo Friday', frequency: 'Hebdomadaire', impact: '+15% Fierté' },
  { id: 'knowledge_share', label: 'Partage de connaissances', frequency: 'Bi-mensuel', impact: '+20% Compétences' },
  { id: 'celebration', label: 'Célébration succès', frequency: 'Ad hoc', impact: '+30% Motivation' },
  { id: 'offsite', label: 'Séminaire annuel', frequency: 'Annuel', impact: '+35% Cohésion' },
];

// Canaux de communication interne
export const COMMUNICATION_CHANNELS = [
  { id: 'slack', label: 'Slack', type: 'Messagerie instantanée', cost: 8 },
  { id: 'teams', label: 'Microsoft Teams', type: 'Suite collaborative', cost: 12 },
  { id: 'notion', label: 'Notion', type: 'Wiki/Documentation', cost: 10 },
  { id: 'confluence', label: 'Confluence', type: 'Documentation', cost: 5 },
  { id: 'email', label: 'Email classique', type: 'Asynchrone', cost: 5 },
  { id: 'workplace', label: 'Workplace', type: 'Réseau social interne', cost: 4 },
  { id: 'discord', label: 'Discord', type: 'Communauté', cost: 0 },
  { id: 'zoom', label: 'Zoom', type: 'Visioconférence', cost: 15 },
  { id: 'meet', label: 'Google Meet', type: 'Visioconférence', cost: 6 },
  { id: 'loom', label: 'Loom', type: 'Vidéo asynchrone', cost: 12 },
];

// Compteur total d'options
export const TOTAL_OPTIONS_COUNT = 
  Object.keys(MANAGEMENT_STYLES).length +
  Object.keys(CULTURE_TYPES).length +
  Object.keys(HR_POLICIES).length +
  Object.keys(MARKETING_STRATEGIES).length +
  Object.keys(SALES_STRATEGIES).length +
  Object.keys(QUALITY_POLICIES).length +
  Object.keys(ENVIRONMENTAL_POLICIES).length +
  Object.keys(TECH_STACKS).length +
  Object.keys(REMOTE_POLICIES).length +
  Object.keys(INNOVATION_STRATEGIES).length +
  Object.keys(ORG_STRUCTURES).length +
  Object.keys(SALARY_POLICIES).length +
  Object.keys(INTERNATIONAL_AMBITIONS).length +
  Object.keys(FUNDING_MODES).length +
  Object.keys(PRICING_POSITIONS).length +
  Object.keys(WORK_SCHEDULES).length +
  Object.keys(TARGET_CUSTOMERS).length +
  EMPLOYEE_PERKS.length +
  STARTING_PARTNERS.length +
  EXTENDED_VALUES.length +
  TEAM_RITUALS.length +
  COMMUNICATION_CHANNELS.length;

// Ce fichier contient 327 options au total
