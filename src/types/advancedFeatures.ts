// ============================================
// ADVANCED FEATURES - 500+ Functionalities
// ============================================

// ==================== FINANCE AVANCÉE (100+ features) ====================
export type StockType = 'action' | 'obligation' | 'option' | 'warrant' | 'crypto' | 'etf' | 'commodity';
export type CryptoType = 'bitcoin' | 'ethereum' | 'stablecoin' | 'altcoin' | 'token';
export type FinancialInstrument = 'future' | 'option_call' | 'option_put' | 'swap' | 'forward' | 'cfd';
export type MergerType = 'acquisition' | 'fusion' | 'joint_venture' | 'prise_participation' | 'leveraged_buyout';
export type FundingRound = 'pre_seed' | 'seed' | 'serie_a' | 'serie_b' | 'serie_c' | 'ipo' | 'spe';
export type DividendPolicy = 'none' | 'quarterly' | 'annual' | 'special';
export type TaxOptimization = 'holding' | 'defiscalisation' | 'credit_impot' | 'prix_transfert' | 'offshore';
export type AuditType = 'interne' | 'externe' | 'fiscal' | 'social' | 'environnemental';

export interface StockPortfolio {
  id: string;
  stocks: StockPosition[];
  totalValue: number;
  totalGain: number;
  lastUpdate: number;
}

export interface StockPosition {
  id: string;
  type: StockType;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  buyDate: number;
  dividendYield?: number;
  volatility: number;
  sector: string;
}

export interface CryptoWallet {
  id: string;
  cryptos: CryptoPosition[];
  totalValue: number;
  securityLevel: 'hot' | 'cold' | 'hardware';
}

export interface CryptoPosition {
  id: string;
  type: CryptoType;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  buyDate: number;
  stakingReward?: number;
}

export interface DerivativeContract {
  id: string;
  instrument: FinancialInstrument;
  underlyingAsset: string;
  strikePrice: number;
  expirationDate: number;
  premium: number;
  notional: number;
  isLong: boolean;
  margin: number;
}

export interface MergerDeal {
  id: string;
  type: MergerType;
  targetCompany: string;
  dealValue: number;
  synergies: number;
  integrationCost: number;
  status: 'negotiation' | 'due_diligence' | 'approval' | 'integration' | 'completed' | 'failed';
  startDate: number;
  completionDate?: number;
  employees: number;
  revenue: number;
}

export interface FundingEvent {
  id: string;
  round: FundingRound;
  amount: number;
  valuation: number;
  dilution: number;
  investors: Investor[];
  date: number;
  terms: string;
}

export interface Investor {
  id: string;
  name: string;
  type: 'vc' | 'angel' | 'pe' | 'bank' | 'corporate' | 'crowdfunding';
  investment: number;
  equity: number;
  boardSeat: boolean;
  influence: number;
}

export interface CashFlowForecast {
  id: string;
  period: number;
  projectedIncome: number[];
  projectedExpenses: number[];
  projectedBalance: number[];
  accuracy: number;
  lastUpdate: number;
}

export interface Budget {
  id: string;
  department: string;
  allocated: number;
  spent: number;
  remaining: number;
  variance: number;
  period: 'monthly' | 'quarterly' | 'annual';
}

export interface FinancialRatio {
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  returnOnAssets: number;
  returnOnEquity: number;
  grossMargin: number;
  netMargin: number;
  assetTurnover: number;
  inventoryTurnover: number;
  receivablesTurnover: number;
}

export interface Hedge {
  id: string;
  type: 'currency' | 'interest' | 'commodity' | 'inflation';
  underlyingRisk: string;
  amount: number;
  cost: number;
  expirationDate: number;
  effectiveness: number;
}

export interface TaxStrategy {
  id: string;
  type: TaxOptimization;
  name: string;
  annualSaving: number;
  setupCost: number;
  risk: number;
  legalCompliance: number;
  active: boolean;
}

export interface AuditReport {
  id: string;
  type: AuditType;
  date: number;
  auditor: string;
  findings: AuditFinding[];
  overallRating: 'excellent' | 'satisfactory' | 'needs_improvement' | 'critical';
  cost: number;
}

export interface AuditFinding {
  id: string;
  severity: 'info' | 'minor' | 'major' | 'critical';
  description: string;
  recommendation: string;
  remediated: boolean;
}

// ==================== RH ÉTENDU (100+ features) ====================
export type RecruitmentChannel = 'linkedin' | 'indeed' | 'campus' | 'cabinet' | 'cooptation' | 'spontanee' | 'salon';
export type LeaveType = 'conge_paye' | 'rtt' | 'maladie' | 'maternite' | 'paternite' | 'sabbatique' | 'formation' | 'sans_solde';
export type PerformanceRating = 'exceptional' | 'exceeds' | 'meets' | 'needs_improvement' | 'unsatisfactory';
export type WorkArrangement = 'on_site' | 'hybrid' | 'remote' | 'flexible';
export type ConflictType = 'interpersonal' | 'hierarchical' | 'salary' | 'conditions' | 'harassment';
export type SuccessionPriority = 'critical' | 'high' | 'medium' | 'low';

export interface RecruitmentCampaign {
  id: string;
  position: string;
  department: string;
  channel: RecruitmentChannel;
  budget: number;
  applicants: JobApplicant[];
  status: 'open' | 'screening' | 'interviewing' | 'offer' | 'closed';
  startDate: number;
  deadline: number;
  requirements: string[];
  salary: { min: number; max: number };
}

export interface JobApplicant {
  id: string;
  name: string;
  email: string;
  experience: number;
  skills: number;
  salaryExpectation: number;
  availability: number;
  score: number;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  notes: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: number;
  endDate: number;
  days: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason?: string;
  approverId?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  date: number;
  rating: PerformanceRating;
  goals: PerformanceGoal[];
  feedback: string;
  developmentPlan: string;
  salaryRecommendation?: number;
}

export interface PerformanceGoal {
  id: string;
  description: string;
  weight: number;
  achievement: number;
  comments: string;
}

export interface TeamStructure {
  id: string;
  name: string;
  managerId: string;
  members: string[];
  budget: number;
  objectives: string[];
  performance: number;
}

export interface WorkPolicy {
  id: string;
  name: string;
  arrangement: WorkArrangement;
  remoteDays?: number;
  coreHours?: { start: string; end: string };
  flexibleHours: boolean;
  overtime: 'paid' | 'compensatory' | 'none';
  affectedEmployees: number;
}

export interface EmployeeConflict {
  id: string;
  type: ConflictType;
  parties: string[];
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  status: 'reported' | 'investigating' | 'mediation' | 'resolved' | 'escalated';
  resolutionDate?: number;
  outcome?: string;
}

export interface SuccessionPlan {
  id: string;
  position: string;
  incumbentId: string;
  priority: SuccessionPriority;
  successors: Successor[];
  lastReview: number;
}

export interface Successor {
  id: string;
  employeeId: string;
  readiness: 'ready_now' | 'ready_1_year' | 'ready_3_years' | 'development';
  developmentNeeds: string[];
  mentorId?: string;
}

export interface WellnessProgram {
  id: string;
  name: string;
  type: 'fitness' | 'mental_health' | 'nutrition' | 'ergonomics' | 'social';
  cost: number;
  participants: number;
  satisfaction: number;
  moralImpact: number;
  productivityImpact: number;
}

export interface InternationalAssignment {
  id: string;
  employeeId: string;
  hostCountry: string;
  startDate: number;
  duration: number;
  cost: number;
  allowances: {
    housing: number;
    travel: number;
    education: number;
    hardship: number;
  };
  status: 'preparing' | 'active' | 'returning' | 'completed';
}

export interface DiversityMetrics {
  genderRatio: { male: number; female: number; other: number };
  ageDistribution: { under30: number; thirties: number; forties: number; fiftyPlus: number };
  disabilityRate: number;
  internationalEmployees: number;
  inclusionScore: number;
}

export interface PayrollRun {
  id: string;
  period: string;
  grossTotal: number;
  netTotal: number;
  taxesTotal: number;
  employeeCount: number;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
  payDate: number;
}

// ==================== PRODUCTION & LOGISTIQUE (100+ features) ====================
export type MachineStatus = 'operational' | 'maintenance' | 'breakdown' | 'idle' | 'setup';
export type QualityStandard = 'iso9001' | 'iso14001' | 'iso45001' | 'iso27001' | 'haccp' | 'gmp' | 'ce';
export type ShippingMethod = 'road' | 'rail' | 'sea' | 'air' | 'multimodal';
export type WarehouseZone = 'receiving' | 'storage' | 'picking' | 'packing' | 'shipping' | 'hazmat';

export interface ProductionLine {
  id: string;
  name: string;
  productId: string;
  capacity: number;
  currentOutput: number;
  efficiency: number;
  machines: Machine[];
  operators: string[];
  shifts: ProductionShift[];
  status: 'running' | 'stopped' | 'maintenance';
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: MachineStatus;
  purchaseDate: number;
  purchasePrice: number;
  currentValue: number;
  maintenanceSchedule: number[];
  lastMaintenance: number;
  nextMaintenance: number;
  breakdownRate: number;
  efficiency: number;
  energyConsumption: number;
}

export interface ProductionShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  workers: number;
  productionTarget: number;
  actualProduction: number;
  qualityRate: number;
}

export interface MaintenanceTicket {
  id: string;
  machineId: string;
  type: 'preventive' | 'corrective' | 'predictive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedCost: number;
  actualCost?: number;
  estimatedDowntime: number;
  actualDowntime?: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdDate: number;
  completedDate?: number;
}

export interface QualityControl {
  id: string;
  productId: string;
  batchNumber: string;
  inspectionDate: number;
  inspector: string;
  tests: QualityTest[];
  overallResult: 'pass' | 'fail' | 'conditional';
  defectRate: number;
  actions: string[];
}

export interface QualityTest {
  id: string;
  name: string;
  standard: string;
  target: number;
  actual: number;
  tolerance: number;
  passed: boolean;
}

export interface Certification {
  id: string;
  standard: QualityStandard;
  name: string;
  issueDate: number;
  expirationDate: number;
  auditor: string;
  status: 'active' | 'pending_renewal' | 'expired' | 'suspended';
  cost: number;
  reputationBonus: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  size: number;
  capacity: number;
  utilization: number;
  zones: WarehouseZoneConfig[];
  cost: number;
  staff: number;
  automated: boolean;
}

export interface WarehouseZoneConfig {
  type: WarehouseZone;
  size: number;
  capacity: number;
  utilization: number;
  temperature?: { min: number; max: number };
}

export interface Shipment {
  id: string;
  orderId: string;
  method: ShippingMethod;
  carrier: string;
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  cost: number;
  estimatedDelivery: number;
  actualDelivery?: number;
  status: 'preparing' | 'in_transit' | 'delivered' | 'delayed' | 'returned';
  trackingNumber: string;
}

export interface Route {
  id: string;
  name: string;
  stops: RouteStop[];
  distance: number;
  duration: number;
  cost: number;
  frequency: 'daily' | 'weekly' | 'on_demand';
  vehicleType: string;
}

export interface RouteStop {
  location: string;
  arrivalTime: string;
  departureTime: string;
  type: 'pickup' | 'delivery' | 'cross_dock';
}

export interface FleetVehicle {
  id: string;
  type: 'truck' | 'van' | 'forklift' | 'trailer';
  licensePlate: string;
  capacity: number;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  fuelConsumption: number;
  mileage: number;
  nextService: number;
  cost: number;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reason: string;
  date: number;
  userId: string;
}

export interface ProductionOrder {
  id: string;
  productId: string;
  quantity: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  dueDate: number;
  startDate?: number;
  completionDate?: number;
  status: 'planned' | 'scheduled' | 'in_progress' | 'completed' | 'on_hold';
  lineId?: string;
  materials: BillOfMaterial[];
}

export interface BillOfMaterial {
  componentId: string;
  componentName: string;
  quantity: number;
  unit: string;
  cost: number;
  available: boolean;
}

export interface LeanMetric {
  oee: number; // Overall Equipment Effectiveness
  taktTime: number;
  cycleTime: number;
  leadTime: number;
  wip: number; // Work In Progress
  defectRate: number;
  firstPassYield: number;
}

// ==================== EXPANSION INTERNATIONALE (100+ features) ====================
export type MarketEntryMode = 'export' | 'license' | 'franchise' | 'joint_venture' | 'acquisition' | 'greenfield';
export type RegulatoryStatus = 'pending' | 'approved' | 'conditional' | 'rejected' | 'expired';
export type TransferPricingMethod = 'comparable_uncontrolled' | 'resale_price' | 'cost_plus' | 'profit_split' | 'tnmm';

export interface CountryAnalysis {
  id: string;
  country: string;
  gdp: number;
  gdpGrowth: number;
  inflation: number;
  population: number;
  marketSize: number;
  competitorCount: number;
  entryBarrier: number;
  politicalRisk: number;
  economicRisk: number;
  legalRisk: number;
  culturalDistance: number;
  recommendation: 'high' | 'medium' | 'low' | 'avoid';
}

export interface MarketEntry {
  id: string;
  countryId: string;
  mode: MarketEntryMode;
  investment: number;
  timeline: number;
  risks: string[];
  resources: string[];
  milestones: EntryMilestone[];
  status: 'planning' | 'execution' | 'operational' | 'exit';
}

export interface EntryMilestone {
  id: string;
  name: string;
  date: number;
  completed: boolean;
  cost: number;
  dependencies: string[];
}

export interface LocalPartner {
  id: string;
  name: string;
  country: string;
  type: 'distributor' | 'agent' | 'jv_partner' | 'licensee' | 'franchisor';
  equity?: number;
  revenue: number;
  performance: number;
  relationshipScore: number;
  contractExpiration: number;
}

export interface RegulatoryApproval {
  id: string;
  country: string;
  type: 'business_license' | 'product_cert' | 'import_permit' | 'tax_id' | 'environmental' | 'industry_specific';
  applicationDate: number;
  status: RegulatoryStatus;
  cost: number;
  validUntil?: number;
  conditions: string[];
}

export interface CustomsDuty {
  id: string;
  productCategory: string;
  originCountry: string;
  destinationCountry: string;
  dutyRate: number;
  vatRate: number;
  exciseDuty?: number;
  antidumpingDuty?: number;
  tradeAgreement?: string;
}

export interface CurrencyExposure {
  currency: string;
  assets: number;
  liabilities: number;
  revenue: number;
  expenses: number;
  netExposure: number;
  hedgedAmount: number;
  hedgingCost: number;
}

export interface TransferPricing {
  id: string;
  transactionType: 'goods' | 'services' | 'royalty' | 'interest' | 'management_fee';
  fromEntity: string;
  toEntity: string;
  method: TransferPricingMethod;
  amount: number;
  armLengthPrice: number;
  documentation: boolean;
  auditRisk: number;
}

export interface GlobalTaxStructure {
  id: string;
  holdingCountry: string;
  ipCountry?: string;
  operatingCountries: string[];
  effectiveTaxRate: number;
  taxSavings: number;
  repatriationCost: number;
  complianceRisk: number;
}

export interface ExpatriatePackage {
  id: string;
  employeeId: string;
  hostCountry: string;
  baseSalary: number;
  costOfLivingAdjustment: number;
  housingAllowance: number;
  educationAllowance: number;
  homeLeave: number;
  hardshipPremium: number;
  taxEqualization: boolean;
  totalCost: number;
}

export interface CrossBorderProject {
  id: string;
  name: string;
  countries: string[];
  budget: number;
  teams: { country: string; members: number }[];
  startDate: number;
  endDate: number;
  status: 'planning' | 'active' | 'completed';
  challenges: string[];
}

// ==================== PROGRESSION & PRESTIGE (100+ features) ====================
export type SkillTreeCategory = 'management' | 'finance' | 'marketing' | 'operations' | 'technology' | 'hr' | 'international';
export type PrestigeBonus = 'revenue' | 'reputation' | 'productivity' | 'innovation' | 'luck';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legend';

export interface SkillTree {
  id: string;
  category: SkillTreeCategory;
  name: string;
  skills: Skill[];
  totalPoints: number;
  unlockedSkills: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  tier: number;
  cost: number;
  unlocked: boolean;
  prerequisites: string[];
  effect: SkillEffect;
  icon: string;
}

export interface SkillEffect {
  type: string;
  value: number;
  target?: string;
  duration?: number;
}

export interface PrestigeLevel {
  level: number;
  name: string;
  pointsRequired: number;
  permanentBonuses: PrestigeBonusConfig[];
  unlocks: string[];
  icon: string;
}

export interface PrestigeBonusConfig {
  type: PrestigeBonus;
  value: number;
  description: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  type: 'daily' | 'weekly' | 'story' | 'event' | 'achievement';
  objectives: QuestObjective[];
  rewards: QuestReward;
  deadline?: number;
  startDate: number;
  completed: boolean;
  failed: boolean;
  progress: number;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface QuestReward {
  xp: number;
  money?: number;
  skillPoints?: number;
  prestigePoints?: number;
  items?: string[];
  achievements?: string[];
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'revenue' | 'growth' | 'employees' | 'valuation' | 'innovation' | 'reputation';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  entries: LeaderboardEntry[];
  lastUpdate: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  companyName: string;
  score: number;
  change: number;
  tier: RankTier;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  rules: string[];
  startingConditions: ChallengeCondition[];
  victoryConditions: ChallengeCondition[];
  failureConditions: ChallengeCondition[];
  timeLimit?: number;
  rewards: QuestReward;
  difficulty: QuestDifficulty;
}

export interface ChallengeCondition {
  type: string;
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
  value: number;
  target?: string;
}

export interface UnlockableContent {
  id: string;
  name: string;
  type: 'feature' | 'sector' | 'country' | 'product' | 'cosmetic';
  requirement: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: number;
}

export interface DailyReward {
  day: number;
  claimed: boolean;
  reward: QuestReward;
  streak: number;
}

export interface SeasonPass {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  currentTier: number;
  maxTier: number;
  xp: number;
  xpRequired: number;
  freeRewards: SeasonReward[];
  premiumRewards: SeasonReward[];
  isPremium: boolean;
}

export interface SeasonReward {
  tier: number;
  reward: QuestReward;
  claimed: boolean;
}

export interface PlayerStats {
  totalPlayTime: number;
  companiesCreated: number;
  totalRevenue: number;
  totalProfit: number;
  employeesHired: number;
  productsLaunched: number;
  countriesExpanded: number;
  achievementsUnlocked: number;
  questsCompleted: number;
  prestigeResets: number;
  highestValuation: number;
}

// ==================== ÉVÉNEMENTS AVANCÉS ====================
export interface RandomEvent {
  id: string;
  type: 'opportunity' | 'threat' | 'neutral' | 'story';
  category: string;
  title: string;
  description: string;
  image?: string;
  choices: EventChoice[];
  requirements?: EventRequirement[];
  probability: number;
  cooldown: number;
  lastTriggered?: number;
}

export interface EventChoice {
  id: string;
  text: string;
  effects: EventEffect[];
  requirements?: EventRequirement[];
  followUpEventId?: string;
}

export interface EventEffect {
  type: string;
  target: string;
  value: number;
  duration?: number;
  probability?: number;
}

export interface EventRequirement {
  type: string;
  target: string;
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'has' | 'not_has';
  value: number | string | boolean;
}

// ==================== SIMULATION AVANCÉE ====================
export interface MarketSimulation {
  sectors: SectorState[];
  economicCycle: 'expansion' | 'peak' | 'contraction' | 'trough';
  cycleProgress: number;
  consumerConfidence: number;
  businessConfidence: number;
  inflationRate: number;
  interestRate: number;
  unemploymentRate: number;
}

export interface SectorState {
  sector: string;
  growth: number;
  demand: number;
  supply: number;
  averageMargin: number;
  competitionLevel: number;
  innovationPace: number;
  regulatoryPressure: number;
}

export interface CompetitorAction {
  id: string;
  competitorId: string;
  type: 'price_cut' | 'product_launch' | 'marketing_blitz' | 'acquisition' | 'expansion' | 'layoffs';
  impact: { revenue?: number; marketShare?: number; reputation?: number };
  date: number;
  response?: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  demographics: {
    ageRange: string;
    income: string;
    location: string;
  };
  preferences: {
    priceSenitivity: number;
    qualitySensitivity: number;
    brandLoyalty: number;
    innovationSeeking: number;
  };
  currentShare: number;
  potentialShare: number;
  acquisitionCost: number;
  lifetimeValue: number;
}

// ==================== AUTOMATISATION & IA ====================
export interface AutomationRule {
  id: string;
  name: string;
  active: boolean;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  priority: number;
  lastTriggered?: number;
  triggerCount: number;
}

export interface AutomationTrigger {
  type: 'threshold' | 'schedule' | 'event' | 'condition';
  metric?: string;
  operator?: 'gt' | 'lt' | 'eq' | 'change';
  value?: number | string;
  schedule?: string;
}

export interface AutomationAction {
  type: 'hire' | 'fire' | 'invest' | 'divest' | 'price' | 'marketing' | 'notify';
  target?: string;
  value?: number | string;
  delay?: number;
}

export interface AIAdvisor {
  id: string;
  specialty: 'finance' | 'hr' | 'operations' | 'strategy' | 'marketing';
  name: string;
  avatar: string;
  accuracy: number;
  suggestions: AISuggestion[];
  trusted: boolean;
}

export interface AISuggestion {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  expectedImpact: { metric: string; change: number }[];
  confidence: number;
  accepted?: boolean;
  outcome?: string;
}

// ==================== EXTENDED COMPANY STATE ====================
export interface AdvancedCompanyState {
  // Finance avancée
  stockPortfolio: StockPortfolio;
  cryptoWallet: CryptoWallet;
  derivatives: DerivativeContract[];
  mergers: MergerDeal[];
  fundingHistory: FundingEvent[];
  investors: Investor[];
  cashFlowForecast: CashFlowForecast;
  budgets: Budget[];
  financialRatios: FinancialRatio;
  hedges: Hedge[];
  taxStrategies: TaxStrategy[];
  audits: AuditReport[];
  
  // RH étendu
  recruitmentCampaigns: RecruitmentCampaign[];
  leaveRequests: LeaveRequest[];
  performanceReviews: PerformanceReview[];
  teams: TeamStructure[];
  workPolicies: WorkPolicy[];
  conflicts: EmployeeConflict[];
  successionPlans: SuccessionPlan[];
  wellnessPrograms: WellnessProgram[];
  internationalAssignments: InternationalAssignment[];
  diversityMetrics: DiversityMetrics;
  payrollHistory: PayrollRun[];
  
  // Production & Logistique
  productionLines: ProductionLine[];
  machines: Machine[];
  maintenanceTickets: MaintenanceTicket[];
  qualityControls: QualityControl[];
  certifications: Certification[];
  warehouses: Warehouse[];
  shipments: Shipment[];
  routes: Route[];
  fleet: FleetVehicle[];
  inventoryMovements: InventoryMovement[];
  productionOrders: ProductionOrder[];
  leanMetrics: LeanMetric;
  
  // International
  countryAnalyses: CountryAnalysis[];
  marketEntries: MarketEntry[];
  localPartners: LocalPartner[];
  regulatoryApprovals: RegulatoryApproval[];
  customsDuties: CustomsDuty[];
  currencyExposures: CurrencyExposure[];
  transferPricing: TransferPricing[];
  globalTaxStructure: GlobalTaxStructure;
  expatriates: ExpatriatePackage[];
  crossBorderProjects: CrossBorderProject[];
  
  // Progression
  skillTrees: SkillTree[];
  prestigeLevel: PrestigeLevel;
  prestigePoints: number;
  skillPoints: number;
  xp: number;
  quests: Quest[];
  challenges: Challenge[];
  unlocks: UnlockableContent[];
  dailyRewards: DailyReward[];
  seasonPass?: SeasonPass;
  playerStats: PlayerStats;
  
  // Simulation
  marketSimulation: MarketSimulation;
  competitorActions: CompetitorAction[];
  customerSegments: CustomerSegment[];
  
  // Automatisation
  automationRules: AutomationRule[];
  aiAdvisors: AIAdvisor[];
}
