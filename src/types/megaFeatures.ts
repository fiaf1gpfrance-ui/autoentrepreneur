// ============= MEGA FEATURES - 500+ nouvelles fonctionnalités =============

import { Sector } from './game';

// ==================== SYSTÈME DE COMPÉTITION AVANCÉ ====================

export type CompetitorPersonality = 
  | 'aggressive_shark' // Attaque constamment, guerre des prix
  | 'innovation_leader' // Focus R&D, produits révolutionnaires
  | 'silent_giant' // Gros mais discret, acquisitions silencieuses
  | 'alliance_builder' // Forme des coalitions
  | 'opportunist' // Exploite les faiblesses
  | 'traditionalist' // Conservateur, marché stable
  | 'disruptor' // Casse les codes du marché
  | 'guerilla_fighter'; // Petites attaques constantes

export interface AdvancedCompetitorAI {
  id: string;
  name: string;
  logo: string;
  sector: Sector;
  personality: CompetitorPersonality;
  
  // Stats dynamiques
  treasury: number;
  marketShare: number;
  reputation: number;
  innovation: number;
  aggressiveness: number;
  employees: number;
  
  // État
  isHostile: boolean;
  inAlliance: boolean;
  allianceWith: string[];
  targetingPlayer: boolean;
  weaknesses: CompetitorWeakness[];
  strengths: CompetitorStrength[];
  
  // Historique
  actionsHistory: AIAction[];
  relationshipScore: number; // -100 à 100
  spiedOn: boolean;
  sabotaged: boolean;
  
  // Secrets découverts
  knownSecrets: DiscoveredSecret[];
  
  // Produits et stratégie
  products: AIProduct[];
  currentStrategy: AIStrategy;
  nextPlannedAction?: PlannedAction;
  
  // Finances
  stockPrice: number;
  stockTrend: 'up' | 'down' | 'stable';
  isAcquisitionTarget: boolean;
  acquisitionPrice: number;
}

export interface AIProduct {
  id: string;
  name: string;
  price: number;
  quality: number;
  marketShare: number;
  rdProgress: number;
  launchDate: number;
}

export interface AIStrategy {
  type: 'expansion' | 'consolidation' | 'attack' | 'defense' | 'innovation' | 'acquisition';
  target?: string;
  budget: number;
  duration: number;
  startedAt: number;
}

export interface AIAction {
  id: string;
  type: AIActionType;
  date: number;
  target?: string;
  success: boolean;
  impact: ActionImpact;
  wasRetaliation: boolean;
}

export type AIActionType =
  | 'price_cut' | 'price_increase'
  | 'marketing_blitz' | 'viral_campaign'
  | 'product_launch' | 'product_discontinue'
  | 'talent_poaching' | 'mass_hiring'
  | 'expansion' | 'merger' | 'acquisition_attempt'
  | 'patent_filing' | 'lawsuit'
  | 'sabotage' | 'espionage'
  | 'alliance_formation' | 'alliance_break'
  | 'public_statement' | 'press_conference'
  | 'investor_pitch' | 'ipo_announcement'
  | 'layoffs' | 'restructuring'
  | 'partnership' | 'exclusive_deal';

export interface ActionImpact {
  playerMarketShare?: number;
  playerReputation?: number;
  playerRevenue?: number;
  sectorPrices?: number;
  competitorMarketShare?: number;
}

export interface PlannedAction {
  type: AIActionType;
  targetDate: number;
  probability: number;
  canBeBlocked: boolean;
  blockCost: number;
}

export interface CompetitorWeakness {
  type: 'financial' | 'reputation' | 'talent' | 'technology' | 'legal' | 'supply_chain';
  severity: 1 | 2 | 3 | 4 | 5;
  description: string;
  exploitable: boolean;
  exploitCost: number;
  exploitImpact: ActionImpact;
}

export interface CompetitorStrength {
  type: 'market_leader' | 'innovation' | 'brand' | 'resources' | 'network' | 'patents';
  level: 1 | 2 | 3 | 4 | 5;
  description: string;
}

export interface DiscoveredSecret {
  id: string;
  type: 'financial' | 'product' | 'strategy' | 'scandal' | 'partnership' | 'legal';
  description: string;
  value: number;
  discoveredAt: number;
  canExploit: boolean;
  exploitOptions: ExploitOption[];
}

export interface ExploitOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  impact: ActionImpact;
  legalRisk: boolean;
}

// ==================== ESPIONNAGE AVANCÉ ====================

export interface SpyAgent {
  id: string;
  name: string;
  skill: number;
  loyalty: number;
  status: 'available' | 'on_mission' | 'compromised' | 'captured';
  currentMission?: SpyMission;
  successfulMissions: number;
  failedMissions: number;
  salary: number;
}

export interface SpyMission {
  id: string;
  type: SpyMissionType;
  targetCompetitorId: string;
  startDate: number;
  duration: number;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  successProbability: number;
  cost: number;
  potentialGain: SpyMissionGain;
  status: 'in_progress' | 'success' | 'failure' | 'detected';
}

export type SpyMissionType =
  | 'financial_audit' // Découvrir la santé financière
  | 'product_intel' // Produits en développement
  | 'strategy_discovery' // Plans stratégiques
  | 'talent_scouting' // Identifier les talents
  | 'price_intelligence' // Structure de prix
  | 'supply_chain_mapping' // Fournisseurs et coûts
  | 'patent_research' // Brevets et R&D
  | 'scandal_search' // Chercher des scandales
  | 'infiltration' // Placer un agent longue durée
  | 'sabotage_preparation' // Préparer une action de sabotage
  | 'counter_intelligence'; // Découvrir s'ils vous espionnent

export interface SpyMissionGain {
  secrets: DiscoveredSecret[];
  marketIntel: MarketIntel;
  weaknessesFound: CompetitorWeakness[];
}

export interface MarketIntel {
  priceInfo?: { product: string; cost: number; margin: number }[];
  upcomingProducts?: { name: string; launchDate: number; estimatedPrice: number }[];
  financials?: { revenue: number; profit: number; debt: number };
  strategies?: string[];
  partnerships?: string[];
}

// ==================== ALLIANCES & COALITIONS ====================

export interface Alliance {
  id: string;
  name: string;
  members: string[]; // IDs (player + competitors)
  leader: string;
  type: AllianceType;
  benefits: AllianceBenefit[];
  obligations: AllianceObligation[];
  createdAt: number;
  expiresAt?: number;
  strength: number; // 1-100
  publicAnnounced: boolean;
}

export type AllianceType =
  | 'non_aggression' // Ne pas s'attaquer
  | 'price_fixing' // Fixer les prix ensemble (illégal!)
  | 'market_sharing' // Partager le marché
  | 'joint_venture' // Projet commun
  | 'defense_pact' // Se défendre mutuellement
  | 'research_sharing' // Partager la R&D
  | 'supply_chain' // Approvisionnement commun
  | 'distribution' // Distribution commune
  | 'hostile_coalition'; // Coalition contre un ennemi commun

export interface AllianceBenefit {
  type: 'cost_reduction' | 'market_access' | 'technology_sharing' | 'protection' | 'intelligence';
  value: number;
  description: string;
}

export interface AllianceObligation {
  type: 'revenue_share' | 'market_restriction' | 'non_compete' | 'information_sharing' | 'mutual_defense';
  value: number;
  description: string;
}

// ==================== ACTIONS OFFENSIVES ====================

export interface OffensiveAction {
  id: string;
  type: OffensiveActionType;
  name: string;
  description: string;
  cost: number;
  duration: number;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  legalRisk: boolean;
  requirements: ActionRequirement[];
  effects: OffensiveEffect[];
  cooldown: number;
}

export type OffensiveActionType =
  // Actions légales
  | 'aggressive_pricing'
  | 'marketing_war'
  | 'talent_raid'
  | 'patent_blocking'
  | 'supplier_lockdown'
  | 'distribution_exclusivity'
  | 'customer_poaching'
  | 'lobbying'
  | 'legal_harassment'
  // Actions grises
  | 'negative_pr'
  | 'fake_reviews'
  | 'influencer_attack'
  // Actions illégales
  | 'sabotage_production'
  | 'data_theft'
  | 'bribery'
  | 'blackmail';

export interface ActionRequirement {
  type: 'treasury' | 'reputation' | 'employees' | 'alliance' | 'intel' | 'spy';
  value: number;
}

export interface OffensiveEffect {
  target: 'player' | 'competitor' | 'market';
  attribute: string;
  value: number;
  duration?: number;
}

// ==================== MARCHÉ AVANCÉ ====================

export interface MarketDynamics {
  sector: Sector;
  totalSize: number;
  growthRate: number;
  saturation: number;
  barriers: EntryBarrier[];
  regulations: Regulation[];
  trends: MarketTrend[];
  seasonality: SeasonalFactor[];
  keyPlayers: string[];
  priceIndex: number;
  qualityStandard: number;
}

export interface EntryBarrier {
  type: 'capital' | 'expertise' | 'patents' | 'regulation' | 'brand' | 'network';
  level: 1 | 2 | 3 | 4 | 5;
  bypassCost: number;
}

export interface Regulation {
  id: string;
  name: string;
  type: 'environmental' | 'safety' | 'consumer' | 'labor' | 'competition' | 'data';
  complianceCost: number;
  penaltyForNonCompliance: number;
  effective: boolean;
  lobbyable: boolean;
  lobbyCost: number;
}

export interface MarketTrend {
  id: string;
  name: string;
  type: 'technology' | 'consumer' | 'economic' | 'social' | 'environmental';
  impact: 'positive' | 'negative' | 'neutral';
  magnitude: number;
  duration: number;
  startedAt: number;
}

export interface SeasonalFactor {
  month: number;
  demandMultiplier: number;
  priceMultiplier: number;
}

// ==================== ÉVÉNEMENTS ÉCONOMIQUES RICHES ====================

export interface EconomicEvent {
  id: string;
  type: EconomicEventType;
  name: string;
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  duration: number;
  startedAt: number;
  effects: EconomicEffect[];
  opportunities: EventOpportunity[];
  responses: EventResponse[];
  affectedSectors: Sector[];
  global: boolean;
}

export type EconomicEventType =
  // Crises
  | 'recession' | 'depression' | 'inflation_spike' | 'deflation'
  | 'currency_crash' | 'stock_crash' | 'banking_crisis'
  | 'supply_chain_crisis' | 'energy_crisis' | 'labor_shortage'
  // Catastrophes
  | 'pandemic' | 'natural_disaster' | 'war' | 'terrorist_attack'
  | 'cyberattack' | 'infrastructure_failure'
  // Opportunités
  | 'economic_boom' | 'new_market' | 'technology_breakthrough'
  | 'regulation_change' | 'competitor_failure' | 'merger_wave'
  // Politique
  | 'election' | 'trade_war' | 'sanctions' | 'tax_reform'
  | 'subsidies' | 'nationalization';

export interface EconomicEffect {
  type: 'demand' | 'supply' | 'price' | 'cost' | 'credit' | 'labor' | 'confidence';
  value: number;
  sectors?: Sector[];
}

export interface EventOpportunity {
  id: string;
  name: string;
  description: string;
  cost: number;
  benefit: number;
  riskLevel: number;
  timeLimit: number;
}

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  cost: number;
  effectiveness: number;
  sideEffects: string[];
}

// ==================== BOURSE & IPO AVANCÉ ====================

export interface StockMarketData {
  playerStock?: PlayerStock;
  indices: MarketIndex[];
  watchlist: WatchlistStock[];
  portfolio: PortfolioPosition[];
  tradingHistory: Trade[];
  dividendsReceived: number;
}

export interface PlayerStock {
  ticker: string;
  price: number;
  priceHistory: { date: number; price: number }[];
  shares: number;
  publicFloat: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  volatility: number;
  analysts: AnalystRating[];
  majorShareholders: Shareholder[];
}

export interface AnalystRating {
  firm: string;
  rating: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  targetPrice: number;
  date: number;
}

export interface Shareholder {
  id: string;
  name: string;
  type: 'founder' | 'investor' | 'institution' | 'employee' | 'public';
  shares: number;
  percentage: number;
  votingRights: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface WatchlistStock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  sector: string;
}

export interface PortfolioPosition {
  id: string;
  ticker: string;
  name: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
}

export interface Trade {
  id: string;
  ticker: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  date: number;
  fees: number;
}

// ==================== ASSURANCES AVANCÉES ====================

export interface InsurancePolicy {
  id: string;
  type: InsuranceType;
  name: string;
  provider: string;
  coverage: number;
  deductible: number;
  monthlyPremium: number;
  annualPremium: number;
  active: boolean;
  startDate: number;
  endDate: number;
  claims: InsuranceClaim[];
  exclusions: string[];
  bonusMalus: number;
}

export type InsuranceType =
  | 'property' | 'liability' | 'business_interruption' | 'cyber'
  | 'key_person' | 'directors_officers' | 'product_liability'
  | 'professional_indemnity' | 'credit' | 'political_risk'
  | 'trade_credit' | 'environmental';

export interface InsuranceClaim {
  id: string;
  policyId: string;
  type: string;
  amount: number;
  date: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  paidAmount?: number;
}

// ==================== PROGRESSION & COMPÉTENCES ====================

export interface SkillTree {
  categories: SkillCategory[];
  totalPoints: number;
  availablePoints: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
  unlocked: boolean;
  unlocksAt: { level?: number; achievement?: string };
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  currentLevel: number;
  cost: number;
  effects: SkillEffect[];
  prerequisites: string[];
  unlocked: boolean;
}

export interface SkillEffect {
  type: string;
  value: number;
  description: string;
}

// ==================== DYNASTIE & HÉRITAGE ====================

export interface Dynasty {
  familyName: string;
  founded: number;
  currentGeneration: number;
  heirs: Heir[];
  familyWealth: number;
  familyReputation: number;
  familyTraits: FamilyTrait[];
  legacyBonuses: LegacyBonus[];
  familyHistory: HistoricalEvent[];
}

export interface Heir {
  id: string;
  name: string;
  age: number;
  education: string;
  skills: { [key: string]: number };
  traits: string[];
  readiness: number;
  relationship: number;
  designated: boolean;
}

export interface FamilyTrait {
  id: string;
  name: string;
  description: string;
  effects: { type: string; value: number }[];
  inherited: boolean;
}

export interface LegacyBonus {
  id: string;
  name: string;
  description: string;
  effect: { type: string; value: number };
  permanent: boolean;
}

export interface HistoricalEvent {
  year: number;
  type: 'founding' | 'expansion' | 'crisis' | 'succession' | 'achievement' | 'scandal';
  description: string;
  impact: number;
}

// ==================== TEMPLATES DE CONCURRENTS AVANCÉS ====================

export const ADVANCED_COMPETITOR_TEMPLATES: Omit<AdvancedCompetitorAI, 'id' | 'actionsHistory' | 'knownSecrets'>[] = [
  // TECH SECTOR
  {
    name: 'NexaTech Industries',
    logo: '🔷',
    sector: 'tech',
    personality: 'innovation_leader',
    treasury: 5000000,
    marketShare: 28,
    reputation: 85,
    innovation: 95,
    aggressiveness: 45,
    employees: 450,
    isHostile: false,
    inAlliance: false,
    allianceWith: [],
    targetingPlayer: false,
    weaknesses: [
      { type: 'financial', severity: 2, description: 'Dépenses R&D excessives', exploitable: true, exploitCost: 50000, exploitImpact: { competitorMarketShare: -3 } },
    ],
    strengths: [
      { type: 'innovation', level: 5, description: 'Leader en brevets' },
      { type: 'brand', level: 4, description: 'Marque premium reconnue' },
    ],
    relationshipScore: 0,
    spiedOn: false,
    sabotaged: false,
    products: [
      { id: 'nt1', name: 'CloudMaster Pro', price: 799, quality: 92, marketShare: 15, rdProgress: 100, launchDate: 0 },
      { id: 'nt2', name: 'AI Assistant X', price: 199, quality: 88, marketShare: 13, rdProgress: 100, launchDate: 50 },
    ],
    currentStrategy: { type: 'innovation', budget: 500000, duration: 90, startedAt: 0 },
    stockPrice: 127.50,
    stockTrend: 'up',
    isAcquisitionTarget: false,
    acquisitionPrice: 25000000,
  },
  {
    name: 'BudgetSoft Solutions',
    logo: '💰',
    sector: 'tech',
    personality: 'aggressive_shark',
    treasury: 800000,
    marketShare: 12,
    reputation: 45,
    innovation: 35,
    aggressiveness: 95,
    employees: 85,
    isHostile: true,
    inAlliance: false,
    allianceWith: [],
    targetingPlayer: true,
    weaknesses: [
      { type: 'reputation', severity: 4, description: 'Mauvaise image de marque', exploitable: true, exploitCost: 20000, exploitImpact: { competitorMarketShare: -5 } },
      { type: 'talent', severity: 3, description: 'Turnover élevé', exploitable: true, exploitCost: 30000, exploitImpact: { competitorMarketShare: -3 } },
    ],
    strengths: [
      { type: 'market_leader', level: 3, description: 'Prix imbattables' },
    ],
    relationshipScore: -50,
    spiedOn: false,
    sabotaged: false,
    products: [
      { id: 'bs1', name: 'CheapCloud', price: 49, quality: 45, marketShare: 12, rdProgress: 100, launchDate: 0 },
    ],
    currentStrategy: { type: 'attack', target: 'player', budget: 100000, duration: 30, startedAt: 0 },
    stockPrice: 12.30,
    stockTrend: 'stable',
    isAcquisitionTarget: true,
    acquisitionPrice: 2500000,
  },
  {
    name: 'GlobalTech Corp',
    logo: '🌐',
    sector: 'tech',
    personality: 'silent_giant',
    treasury: 50000000,
    marketShare: 35,
    reputation: 78,
    innovation: 70,
    aggressiveness: 30,
    employees: 5000,
    isHostile: false,
    inAlliance: true,
    allianceWith: ['comp_4'],
    targetingPlayer: false,
    weaknesses: [
      { type: 'technology', severity: 2, description: 'Stack technique vieillissant', exploitable: true, exploitCost: 100000, exploitImpact: { competitorMarketShare: -2 } },
    ],
    strengths: [
      { type: 'resources', level: 5, description: 'Trésorerie massive' },
      { type: 'network', level: 5, description: 'Réseau mondial' },
      { type: 'brand', level: 4, description: 'Marque historique' },
    ],
    relationshipScore: 20,
    spiedOn: false,
    sabotaged: false,
    products: [
      { id: 'gt1', name: 'Enterprise Suite', price: 2999, quality: 80, marketShare: 20, rdProgress: 100, launchDate: 0 },
      { id: 'gt2', name: 'Cloud Platform', price: 599, quality: 75, marketShare: 15, rdProgress: 100, launchDate: 0 },
    ],
    currentStrategy: { type: 'consolidation', budget: 1000000, duration: 180, startedAt: 0 },
    stockPrice: 284.70,
    stockTrend: 'up',
    isAcquisitionTarget: false,
    acquisitionPrice: 500000000,
  },
  {
    name: 'StartupRocket',
    logo: '🚀',
    sector: 'tech',
    personality: 'disruptor',
    treasury: 150000,
    marketShare: 3,
    reputation: 55,
    innovation: 88,
    aggressiveness: 80,
    employees: 15,
    isHostile: false,
    inAlliance: false,
    allianceWith: [],
    targetingPlayer: false,
    weaknesses: [
      { type: 'financial', severity: 5, description: 'Runway limité', exploitable: true, exploitCost: 10000, exploitImpact: { competitorMarketShare: -2 } },
      { type: 'supply_chain', severity: 3, description: 'Dépendance à un fournisseur', exploitable: true, exploitCost: 25000, exploitImpact: { competitorMarketShare: -3 } },
    ],
    strengths: [
      { type: 'innovation', level: 4, description: 'Produit révolutionnaire' },
    ],
    relationshipScore: 10,
    spiedOn: false,
    sabotaged: false,
    products: [
      { id: 'sr1', name: 'DisruptApp', price: 29, quality: 78, marketShare: 3, rdProgress: 100, launchDate: 0 },
    ],
    currentStrategy: { type: 'expansion', budget: 50000, duration: 60, startedAt: 0 },
    stockPrice: 0,
    stockTrend: 'stable',
    isAcquisitionTarget: true,
    acquisitionPrice: 500000,
  },
  // SERVICES SECTOR
  {
    name: 'Excellence Conseil',
    logo: '👑',
    sector: 'services',
    personality: 'traditionalist',
    treasury: 3000000,
    marketShare: 25,
    reputation: 92,
    innovation: 45,
    aggressiveness: 25,
    employees: 180,
    isHostile: false,
    inAlliance: false,
    allianceWith: [],
    targetingPlayer: false,
    weaknesses: [
      { type: 'technology', severity: 3, description: 'Digitalisation en retard', exploitable: true, exploitCost: 40000, exploitImpact: { competitorMarketShare: -4 } },
    ],
    strengths: [
      { type: 'brand', level: 5, description: 'Réputation impeccable' },
      { type: 'network', level: 4, description: 'Carnet d\'adresses prestigieux' },
    ],
    relationshipScore: 30,
    spiedOn: false,
    sabotaged: false,
    products: [
      { id: 'ec1', name: 'Conseil Premium', price: 3500, quality: 95, marketShare: 15, rdProgress: 100, launchDate: 0 },
      { id: 'ec2', name: 'Audit Excellence', price: 2000, quality: 90, marketShare: 10, rdProgress: 100, launchDate: 0 },
    ],
    currentStrategy: { type: 'defense', budget: 200000, duration: 120, startedAt: 0 },
    stockPrice: 89.20,
    stockTrend: 'stable',
    isAcquisitionTarget: false,
    acquisitionPrice: 15000000,
  },
  {
    name: 'FlexiService',
    logo: '⚡',
    sector: 'services',
    personality: 'opportunist',
    treasury: 400000,
    marketShare: 8,
    reputation: 58,
    innovation: 65,
    aggressiveness: 70,
    employees: 45,
    isHostile: false,
    inAlliance: false,
    allianceWith: [],
    targetingPlayer: false,
    weaknesses: [
      { type: 'legal', severity: 2, description: 'Contrats fragiles', exploitable: true, exploitCost: 30000, exploitImpact: { competitorMarketShare: -3 } },
    ],
    strengths: [
      { type: 'market_leader', level: 3, description: 'Réactivité exceptionnelle' },
    ],
    relationshipScore: 0,
    spiedOn: false,
    sabotaged: false,
    products: [
      { id: 'fs1', name: 'Service Express', price: 299, quality: 70, marketShare: 8, rdProgress: 100, launchDate: 0 },
    ],
    currentStrategy: { type: 'expansion', budget: 80000, duration: 45, startedAt: 0 },
    stockPrice: 23.40,
    stockTrend: 'up',
    isAcquisitionTarget: true,
    acquisitionPrice: 1200000,
  },
  // INDUSTRIE SECTOR
  {
    name: 'IndustriaMax',
    logo: '🏭',
    sector: 'industrie',
    personality: 'silent_giant',
    treasury: 20000000,
    marketShare: 32,
    reputation: 75,
    innovation: 55,
    aggressiveness: 40,
    employees: 2500,
    isHostile: false,
    inAlliance: true,
    allianceWith: ['comp_8'],
    targetingPlayer: false,
    weaknesses: [
      { type: 'reputation', severity: 2, description: 'Image polluante', exploitable: true, exploitCost: 60000, exploitImpact: { playerReputation: 5, competitorMarketShare: -3 } },
    ],
    strengths: [
      { type: 'resources', level: 5, description: 'Capacité de production massive' },
      { type: 'patents', level: 4, description: 'Portfolio de brevets solide' },
    ],
    relationshipScore: 15,
    spiedOn: false,
    sabotaged: false,
    products: [
      { id: 'im1', name: 'Machine Pro X', price: 45000, quality: 85, marketShare: 20, rdProgress: 100, launchDate: 0 },
      { id: 'im2', name: 'Composant Alpha', price: 250, quality: 80, marketShare: 12, rdProgress: 100, launchDate: 0 },
    ],
    currentStrategy: { type: 'consolidation', budget: 500000, duration: 180, startedAt: 0 },
    stockPrice: 156.80,
    stockTrend: 'stable',
    isAcquisitionTarget: false,
    acquisitionPrice: 100000000,
  },
  {
    name: 'GreenFactory',
    logo: '🌿',
    sector: 'industrie',
    personality: 'innovation_leader',
    treasury: 1500000,
    marketShare: 10,
    reputation: 88,
    innovation: 82,
    aggressiveness: 35,
    employees: 200,
    isHostile: false,
    inAlliance: false,
    allianceWith: [],
    targetingPlayer: false,
    weaknesses: [
      { type: 'financial', severity: 3, description: 'Marges faibles', exploitable: true, exploitCost: 45000, exploitImpact: { competitorMarketShare: -4 } },
    ],
    strengths: [
      { type: 'brand', level: 4, description: 'Image écologique forte' },
      { type: 'innovation', level: 4, description: 'Technologies vertes' },
    ],
    relationshipScore: 25,
    spiedOn: false,
    sabotaged: false,
    products: [
      { id: 'gf1', name: 'EcoMachine', price: 55000, quality: 82, marketShare: 7, rdProgress: 100, launchDate: 0 },
      { id: 'gf2', name: 'BioPart', price: 320, quality: 85, marketShare: 3, rdProgress: 100, launchDate: 0 },
    ],
    currentStrategy: { type: 'innovation', budget: 300000, duration: 90, startedAt: 0 },
    stockPrice: 67.30,
    stockTrend: 'up',
    isAcquisitionTarget: true,
    acquisitionPrice: 8000000,
  },
  // ARTISANAT SECTOR
  {
    name: 'Maître Artisan',
    logo: '🔨',
    sector: 'artisanat',
    personality: 'traditionalist',
    treasury: 200000,
    marketShare: 18,
    reputation: 95,
    innovation: 25,
    aggressiveness: 15,
    employees: 25,
    isHostile: false,
    inAlliance: false,
    allianceWith: [],
    targetingPlayer: false,
    weaknesses: [
      { type: 'technology', severity: 4, description: 'Aucune présence digitale', exploitable: true, exploitCost: 15000, exploitImpact: { competitorMarketShare: -5 } },
    ],
    strengths: [
      { type: 'brand', level: 5, description: 'Réputation d\'excellence' },
    ],
    relationshipScore: 40,
    spiedOn: false,
    sabotaged: false,
    products: [
      { id: 'ma1', name: 'Création Sur-Mesure', price: 850, quality: 98, marketShare: 18, rdProgress: 100, launchDate: 0 },
    ],
    currentStrategy: { type: 'defense', budget: 30000, duration: 180, startedAt: 0 },
    stockPrice: 0,
    stockTrend: 'stable',
    isAcquisitionTarget: true,
    acquisitionPrice: 600000,
  },
  {
    name: 'ArtisanModerne',
    logo: '✨',
    sector: 'artisanat',
    personality: 'disruptor',
    treasury: 80000,
    marketShare: 8,
    reputation: 65,
    innovation: 75,
    aggressiveness: 60,
    employees: 12,
    isHostile: false,
    inAlliance: false,
    allianceWith: [],
    targetingPlayer: true,
    weaknesses: [
      { type: 'reputation', severity: 2, description: 'Perçu comme moins authentique', exploitable: true, exploitCost: 20000, exploitImpact: { competitorMarketShare: -3 } },
    ],
    strengths: [
      { type: 'innovation', level: 3, description: 'Mélange tradition et modernité' },
    ],
    relationshipScore: -10,
    spiedOn: false,
    sabotaged: false,
    products: [
      { id: 'am1', name: 'Artisanat 2.0', price: 450, quality: 80, marketShare: 8, rdProgress: 100, launchDate: 0 },
    ],
    currentStrategy: { type: 'attack', target: 'player', budget: 20000, duration: 30, startedAt: 0 },
    stockPrice: 0,
    stockTrend: 'stable',
    isAcquisitionTarget: true,
    acquisitionPrice: 300000,
  },
];

// ==================== ACTIONS OFFENSIVES DISPONIBLES ====================

export const OFFENSIVE_ACTIONS: OffensiveAction[] = [
  // Actions légales agressives
  {
    id: 'aggressive_pricing',
    type: 'aggressive_pricing',
    name: 'Guerre des Prix',
    description: 'Baissez drastiquement vos prix pour écraser un concurrent',
    cost: 25000,
    duration: 30,
    riskLevel: 2,
    legalRisk: false,
    requirements: [{ type: 'treasury', value: 25000 }],
    effects: [
      { target: 'player', attribute: 'marketShare', value: 5 },
      { target: 'competitor', attribute: 'marketShare', value: -5 },
      { target: 'player', attribute: 'margin', value: -15, duration: 30 },
    ],
    cooldown: 60,
  },
  {
    id: 'marketing_war',
    type: 'marketing_war',
    name: 'Offensive Marketing Totale',
    description: 'Campagne marketing massive ciblant les clients d\'un concurrent',
    cost: 50000,
    duration: 45,
    riskLevel: 2,
    legalRisk: false,
    requirements: [{ type: 'treasury', value: 50000 }],
    effects: [
      { target: 'player', attribute: 'reputation', value: 10 },
      { target: 'competitor', attribute: 'marketShare', value: -3 },
      { target: 'player', attribute: 'leads', value: 50 },
    ],
    cooldown: 45,
  },
  {
    id: 'talent_raid',
    type: 'talent_raid',
    name: 'Raid de Talents',
    description: 'Débauchage agressif des meilleurs employés d\'un concurrent',
    cost: 75000,
    duration: 14,
    riskLevel: 3,
    legalRisk: false,
    requirements: [{ type: 'treasury', value: 75000 }, { type: 'reputation', value: 50 }],
    effects: [
      { target: 'player', attribute: 'skills', value: 15 },
      { target: 'competitor', attribute: 'productivity', value: -20 },
    ],
    cooldown: 90,
  },
  {
    id: 'patent_blocking',
    type: 'patent_blocking',
    name: 'Blocage par Brevets',
    description: 'Utilisez vos brevets pour bloquer les produits d\'un concurrent',
    cost: 100000,
    duration: 90,
    riskLevel: 3,
    legalRisk: false,
    requirements: [{ type: 'treasury', value: 100000 }],
    effects: [
      { target: 'competitor', attribute: 'revenue', value: -20, duration: 90 },
    ],
    cooldown: 180,
  },
  {
    id: 'supplier_lockdown',
    type: 'supplier_lockdown',
    name: 'Verrouillage Fournisseurs',
    description: 'Signez des contrats exclusifs avec les fournisseurs clés',
    cost: 150000,
    duration: 180,
    riskLevel: 2,
    legalRisk: false,
    requirements: [{ type: 'treasury', value: 150000 }],
    effects: [
      { target: 'competitor', attribute: 'costs', value: 25, duration: 180 },
    ],
    cooldown: 365,
  },
  {
    id: 'customer_poaching',
    type: 'customer_poaching',
    name: 'Vol de Clients',
    description: 'Proposez des offres irrésistibles aux clients d\'un concurrent',
    cost: 40000,
    duration: 30,
    riskLevel: 2,
    legalRisk: false,
    requirements: [{ type: 'treasury', value: 40000 }],
    effects: [
      { target: 'player', attribute: 'clients', value: 10 },
      { target: 'competitor', attribute: 'revenue', value: -10 },
    ],
    cooldown: 60,
  },
  {
    id: 'lobbying',
    type: 'lobbying',
    name: 'Lobbying Agressif',
    description: 'Influencez les régulateurs contre un concurrent',
    cost: 200000,
    duration: 120,
    riskLevel: 3,
    legalRisk: false,
    requirements: [{ type: 'treasury', value: 200000 }, { type: 'reputation', value: 60 }],
    effects: [
      { target: 'competitor', attribute: 'complianceCosts', value: 50000 },
    ],
    cooldown: 365,
  },
  {
    id: 'legal_harassment',
    type: 'legal_harassment',
    name: 'Harcèlement Juridique',
    description: 'Multipliez les procédures légales pour épuiser un concurrent',
    cost: 80000,
    duration: 90,
    riskLevel: 3,
    legalRisk: true,
    requirements: [{ type: 'treasury', value: 80000 }],
    effects: [
      { target: 'competitor', attribute: 'legalCosts', value: 150000 },
      { target: 'player', attribute: 'reputation', value: -5 },
    ],
    cooldown: 120,
  },
  // Actions grises
  {
    id: 'negative_pr',
    type: 'negative_pr',
    name: 'Campagne Négative',
    description: 'Lancez une campagne de communication négative contre un concurrent',
    cost: 30000,
    duration: 14,
    riskLevel: 4,
    legalRisk: true,
    requirements: [{ type: 'treasury', value: 30000 }],
    effects: [
      { target: 'competitor', attribute: 'reputation', value: -15 },
      { target: 'player', attribute: 'reputation', value: -5 },
    ],
    cooldown: 90,
  },
  {
    id: 'fake_reviews',
    type: 'fake_reviews',
    name: 'Faux Avis',
    description: 'Inondez les plateformes de faux avis négatifs sur un concurrent',
    cost: 15000,
    duration: 30,
    riskLevel: 4,
    legalRisk: true,
    requirements: [{ type: 'treasury', value: 15000 }],
    effects: [
      { target: 'competitor', attribute: 'reputation', value: -10 },
    ],
    cooldown: 60,
  },
  // Actions illégales (très risquées)
  {
    id: 'sabotage_production',
    type: 'sabotage_production',
    name: '⚠️ Sabotage de Production',
    description: 'Sabotez les installations d\'un concurrent',
    cost: 100000,
    duration: 7,
    riskLevel: 5,
    legalRisk: true,
    requirements: [{ type: 'treasury', value: 100000 }, { type: 'spy', value: 1 }],
    effects: [
      { target: 'competitor', attribute: 'production', value: -50, duration: 60 },
    ],
    cooldown: 365,
  },
  {
    id: 'data_theft',
    type: 'data_theft',
    name: '⚠️ Vol de Données',
    description: 'Volez des données confidentielles d\'un concurrent',
    cost: 50000,
    duration: 14,
    riskLevel: 5,
    legalRisk: true,
    requirements: [{ type: 'treasury', value: 50000 }, { type: 'spy', value: 1 }],
    effects: [
      { target: 'player', attribute: 'intel', value: 100 },
    ],
    cooldown: 180,
  },
];

// ==================== SPY MISSIONS DISPONIBLES ====================

export const SPY_MISSIONS: Omit<SpyMission, 'id' | 'targetCompetitorId' | 'startDate' | 'status'>[] = [
  {
    type: 'financial_audit',
    duration: 14,
    riskLevel: 2,
    successProbability: 80,
    cost: 15000,
    potentialGain: {
      secrets: [],
      marketIntel: { financials: { revenue: 0, profit: 0, debt: 0 } },
      weaknessesFound: [],
    },
  },
  {
    type: 'product_intel',
    duration: 21,
    riskLevel: 3,
    successProbability: 70,
    cost: 25000,
    potentialGain: {
      secrets: [],
      marketIntel: { upcomingProducts: [] },
      weaknessesFound: [],
    },
  },
  {
    type: 'strategy_discovery',
    duration: 30,
    riskLevel: 4,
    successProbability: 55,
    cost: 40000,
    potentialGain: {
      secrets: [],
      marketIntel: { strategies: [] },
      weaknessesFound: [],
    },
  },
  {
    type: 'talent_scouting',
    duration: 14,
    riskLevel: 2,
    successProbability: 85,
    cost: 10000,
    potentialGain: {
      secrets: [],
      marketIntel: {},
      weaknessesFound: [],
    },
  },
  {
    type: 'scandal_search',
    duration: 45,
    riskLevel: 4,
    successProbability: 40,
    cost: 60000,
    potentialGain: {
      secrets: [],
      marketIntel: {},
      weaknessesFound: [],
    },
  },
  {
    type: 'infiltration',
    duration: 90,
    riskLevel: 5,
    successProbability: 30,
    cost: 100000,
    potentialGain: {
      secrets: [],
      marketIntel: {},
      weaknessesFound: [],
    },
  },
  {
    type: 'counter_intelligence',
    duration: 21,
    riskLevel: 3,
    successProbability: 75,
    cost: 20000,
    potentialGain: {
      secrets: [],
      marketIntel: {},
      weaknessesFound: [],
    },
  },
];
