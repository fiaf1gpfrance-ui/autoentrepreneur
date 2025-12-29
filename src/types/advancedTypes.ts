// ==================== ADVANCED TYPES FOR ULTRA-REALISTIC SIMULATION ====================

// ==================== FINANCE & ACCOUNTING ====================

export interface BalanceSheet {
  date: number;
  // ACTIF
  assets: {
    // Immobilisations
    fixedAssets: {
      intangible: number;          // Immobilisations incorporelles (brevets, marques)
      tangible: number;            // Immobilisations corporelles (bâtiments, machines)
      financial: number;           // Immobilisations financières (participations)
      depreciation: number;        // Amortissements cumulés
      netFixed: number;           // Total net immobilisations
    };
    // Actif circulant
    currentAssets: {
      inventory: number;           // Stocks
      receivables: number;         // Créances clients
      otherReceivables: number;    // Autres créances
      prepaidExpenses: number;     // Charges constatées d'avance
      cashAndEquivalents: number;  // Trésorerie
      totalCurrent: number;
    };
    totalAssets: number;
  };
  // PASSIF
  liabilities: {
    // Capitaux propres
    equity: {
      shareCapital: number;        // Capital social
      reserves: number;            // Réserves
      retainedEarnings: number;    // Report à nouveau
      netIncome: number;           // Résultat de l'exercice
      totalEquity: number;
    };
    // Provisions
    provisions: {
      riskProvisions: number;      // Provisions pour risques
      chargesProvisions: number;   // Provisions pour charges
      totalProvisions: number;
    };
    // Dettes
    debts: {
      financialDebts: number;      // Emprunts et dettes financières
      supplierPayables: number;    // Dettes fournisseurs
      taxPayables: number;         // Dettes fiscales
      socialPayables: number;      // Dettes sociales
      otherPayables: number;       // Autres dettes
      deferredRevenue: number;     // Produits constatés d'avance
      totalDebts: number;
    };
    totalLiabilities: number;
  };
}

export interface IncomeStatement {
  period: { start: number; end: number };
  // Produits d'exploitation
  operatingRevenue: {
    salesRevenue: number;          // Ventes de marchandises
    productionRevenue: number;     // Production vendue
    serviceRevenue: number;        // Prestations de services
    subsidies: number;             // Subventions d'exploitation
    otherRevenue: number;          // Autres produits
    totalOperating: number;
  };
  // Charges d'exploitation
  operatingExpenses: {
    purchases: number;             // Achats
    inventoryVariation: number;    // Variation de stocks
    externalServices: number;      // Services extérieurs
    taxes: number;                 // Impôts et taxes
    salaries: number;              // Salaires et traitements
    socialCharges: number;         // Charges sociales
    depreciation: number;          // Dotations aux amortissements
    provisions: number;            // Dotations aux provisions
    otherExpenses: number;         // Autres charges
    totalOperating: number;
  };
  operatingIncome: number;         // Résultat d'exploitation
  // Résultat financier
  financialResult: {
    financialRevenue: number;      // Produits financiers
    financialExpenses: number;     // Charges financières
    netFinancial: number;
  };
  // Résultat exceptionnel
  exceptionalResult: {
    exceptionalRevenue: number;
    exceptionalExpenses: number;
    netExceptional: number;
  };
  // Impôt et résultat
  corporateTax: number;
  profitSharing: number;           // Participation des salariés
  netIncome: number;               // Résultat net
}

export interface CashFlowStatement {
  period: { start: number; end: number };
  // Flux d'exploitation
  operatingCashFlow: {
    netIncome: number;
    depreciation: number;
    provisionChanges: number;
    workingCapitalChange: number;
    totalOperating: number;
  };
  // Flux d'investissement
  investingCashFlow: {
    assetAcquisitions: number;
    assetDisposals: number;
    financialInvestments: number;
    totalInvesting: number;
  };
  // Flux de financement
  financingCashFlow: {
    capitalIncrease: number;
    dividendsPaid: number;
    loanProceeds: number;
    loanRepayments: number;
    totalFinancing: number;
  };
  netCashChange: number;
  openingCash: number;
  closingCash: number;
}

export interface FinancialRatios {
  // Ratios de rentabilité
  profitability: {
    grossMargin: number;           // Marge brute
    operatingMargin: number;       // Marge opérationnelle
    netMargin: number;             // Marge nette
    roa: number;                   // Return on Assets
    roe: number;                   // Return on Equity
    roce: number;                  // Return on Capital Employed
  };
  // Ratios de liquidité
  liquidity: {
    currentRatio: number;          // Ratio de liquidité générale
    quickRatio: number;            // Ratio de liquidité réduite
    cashRatio: number;             // Ratio de trésorerie
  };
  // Ratios de solvabilité
  solvency: {
    debtToEquity: number;          // Ratio d'endettement
    equityRatio: number;           // Ratio d'autonomie financière
    interestCoverage: number;      // Ratio de couverture des intérêts
    debtServiceCoverage: number;   // DSCR
  };
  // Ratios d'activité
  activity: {
    assetTurnover: number;         // Rotation des actifs
    inventoryTurnover: number;     // Rotation des stocks
    receivablesTurnover: number;   // Rotation des créances
    payablesTurnover: number;      // Rotation des dettes fournisseurs
    dso: number;                   // Days Sales Outstanding
    dio: number;                   // Days Inventory Outstanding
    dpo: number;                   // Days Payables Outstanding
    cashConversionCycle: number;   // Cycle de conversion de trésorerie
  };
  // Ratios de valorisation
  valuation: {
    bookValue: number;             // Valeur comptable
    enterpriseValue: number;       // Valeur d'entreprise
    ebitda: number;                // EBITDA
    evToEbitda: number;            // EV/EBITDA
  };
}

export interface Budget {
  id: string;
  name: string;
  year: number;
  type: 'annual' | 'quarterly' | 'monthly' | 'project';
  status: 'draft' | 'approved' | 'active' | 'closed';
  // Lignes budgétaires
  lines: BudgetLine[];
  // Totaux
  totalRevenue: number;
  totalExpenses: number;
  netBudget: number;
  // Suivi
  actualRevenue: number;
  actualExpenses: number;
  variance: number;
  variancePercent: number;
}

export interface BudgetLine {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  type: 'revenue' | 'expense';
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  notes: string;
}

export interface Forecast {
  id: string;
  name: string;
  createdAt: number;
  horizon: number;  // months
  scenarios: ForecastScenario[];
  assumptions: ForecastAssumption[];
}

export interface ForecastScenario {
  id: string;
  name: string;
  probability: number;
  projectedRevenue: number[];
  projectedExpenses: number[];
  projectedCashFlow: number[];
  projectedProfit: number[];
}

export interface ForecastAssumption {
  id: string;
  name: string;
  category: string;
  baseValue: number;
  growthRate: number;
  volatility: number;
}

export interface Audit {
  id: string;
  type: 'internal' | 'external' | 'fiscal' | 'social' | 'quality';
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  auditor: string;
  startDate: number;
  endDate?: number;
  scope: string[];
  findings: AuditFinding[];
  recommendations: string[];
  overallRating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'critical';
  cost: number;
}

export interface AuditFinding {
  id: string;
  severity: 'info' | 'minor' | 'major' | 'critical';
  category: string;
  description: string;
  impact: string;
  recommendation: string;
  resolved: boolean;
  resolvedDate?: number;
}

// ==================== HR & MANAGEMENT ====================

export interface OrgChart {
  id: string;
  departments: Department[];
  hierarchyLevels: number;
  spanOfControl: number;
  totalPositions: number;
  filledPositions: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId?: string;
  parentDepartmentId?: string;
  budget: number;
  headcount: number;
  targetHeadcount: number;
  teams: Team[];
  kpis: DepartmentKPI[];
}

export interface Team {
  id: string;
  name: string;
  departmentId: string;
  leaderId?: string;
  members: string[];
  objectives: string[];
  performance: number;
}

export interface DepartmentKPI {
  id: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  type: '360' | 'annual' | 'probation' | 'quarterly' | 'project';
  period: { start: number; end: number };
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  // Évaluation
  ratings: {
    overall: number;
    skills: number;
    objectives: number;
    behavior: number;
    potential: number;
  };
  objectives: PerformanceObjective[];
  strengths: string[];
  improvements: string[];
  developmentPlan: string[];
  salaryRecommendation?: number;
  promotionRecommended: boolean;
  comments: string;
}

export interface PerformanceObjective {
  id: string;
  description: string;
  weight: number;
  target: number;
  actual: number;
  achieved: boolean;
}

export interface CareerPath {
  id: string;
  employeeId: string;
  currentRole: string;
  currentLevel: number;
  targetRole: string;
  targetLevel: number;
  timeline: number;  // months
  stages: CareerStage[];
  mentorId?: string;
  status: 'active' | 'on_track' | 'behind' | 'completed' | 'abandoned';
}

export interface CareerStage {
  id: string;
  name: string;
  requirements: string[];
  skills: string[];
  duration: number;
  completed: boolean;
  completedDate?: number;
}

export interface SuccessionPlan {
  id: string;
  positionId: string;
  positionName: string;
  currentHolderId?: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  successors: SuccessorCandidate[];
  riskLevel: number;
  developmentActions: string[];
}

export interface SuccessorCandidate {
  employeeId: string;
  readiness: 'ready_now' | 'ready_1_year' | 'ready_2_years' | 'developing';
  strengths: string[];
  gaps: string[];
  developmentPlan: string[];
  priority: number;
}

export interface CSE {  // Comité Social et Économique
  id: string;
  members: CSEMember[];
  meetings: CSEMeeting[];
  budget: {
    functioning: number;
    socialActivities: number;
    used: number;
  };
  nextElection: number;
  consultations: CSEConsultation[];
}

export interface CSEMember {
  employeeId: string;
  role: 'president' | 'secretary' | 'treasurer' | 'member' | 'substitute';
  mandate: { start: number; end: number };
  hoursPerMonth: number;
}

export interface CSEMeeting {
  id: string;
  date: number;
  type: 'ordinary' | 'extraordinary';
  agenda: string[];
  attendees: string[];
  decisions: string[];
  minutesUrl?: string;
}

export interface CSEConsultation {
  id: string;
  subject: string;
  category: 'economic' | 'social' | 'safety' | 'organization';
  deadline: number;
  status: 'pending' | 'in_progress' | 'opinion_given' | 'closed';
  opinion?: 'favorable' | 'unfavorable' | 'reserved';
  comments: string;
}

export interface CollectiveAgreement {
  id: string;
  name: string;
  idcc: string;  // Identifiant Convention Collective
  applicableFrom: number;
  minimumWages: { level: string; coefficient: number; minSalary: number }[];
  workingHours: number;
  paidLeave: number;
  seniorityBonuses: { years: number; bonus: number }[];
  specificRules: string[];
}

export interface LaborDispute {
  id: string;
  type: 'individual' | 'collective';
  category: 'wages' | 'dismissal' | 'harassment' | 'discrimination' | 'working_conditions' | 'other';
  status: 'open' | 'mediation' | 'prudhommes' | 'appeal' | 'resolved';
  employeeIds: string[];
  description: string;
  claimAmount: number;
  lawyerId?: string;
  hearingDates: number[];
  outcome?: 'won' | 'lost' | 'settled' | 'dismissed';
  settlementAmount?: number;
  costs: number;
}

export interface RecruitmentProcess {
  id: string;
  positionTitle: string;
  department: string;
  status: 'draft' | 'open' | 'screening' | 'interviewing' | 'offer' | 'closed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  budget: { minSalary: number; maxSalary: number; recruitmentCost: number };
  requirements: { skill: string; level: 'junior' | 'mid' | 'senior' | 'expert'; mandatory: boolean }[];
  candidates: RecruitmentCandidate[];
  timeline: { posted: number; deadline: number; startDate: number };
  source: 'internal' | 'external' | 'referral' | 'agency' | 'school';
  hiringManagerId: string;
}

export interface RecruitmentCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resume: string;
  status: 'applied' | 'screening' | 'interview_1' | 'interview_2' | 'technical' | 'offer' | 'hired' | 'rejected' | 'withdrawn';
  score: number;
  interviews: { date: number; interviewerId: string; rating: number; notes: string }[];
  salaryExpectation: number;
  availabilityDate: number;
  source: string;
}

// ==================== PRODUCTION & LOGISTICS ====================

export interface ProductionLine {
  id: string;
  name: string;
  type: 'assembly' | 'manufacturing' | 'packaging' | 'processing';
  status: 'active' | 'maintenance' | 'idle' | 'broken';
  capacity: number;         // units per hour
  efficiency: number;       // 0-100%
  utilization: number;      // 0-100%
  workers: number;
  machines: Machine[];
  currentOrder?: ProductionOrder;
  maintenanceSchedule: MaintenanceSchedule;
  qualityMetrics: QualityMetrics;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'idle' | 'maintenance' | 'broken';
  purchaseDate: number;
  purchasePrice: number;
  currentValue: number;
  efficiency: number;
  operatingHours: number;
  maintenanceCost: number;
  energyConsumption: number;
  nextMaintenance: number;
}

export interface ProductionOrder {
  id: string;
  productId: string;
  quantity: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'planned' | 'in_progress' | 'quality_check' | 'completed' | 'cancelled';
  startDate: number;
  dueDate: number;
  completedDate?: number;
  completedQuantity: number;
  defectQuantity: number;
  assignedLineId?: string;
  materials: { itemId: string; required: number; consumed: number }[];
  laborHours: number;
  cost: number;
}

export interface MaintenanceSchedule {
  lastMaintenance: number;
  nextMaintenance: number;
  maintenanceType: 'preventive' | 'predictive' | 'corrective';
  frequency: number;  // days
  estimatedDuration: number;  // hours
  estimatedCost: number;
  history: MaintenanceRecord[];
}

export interface MaintenanceRecord {
  id: string;
  date: number;
  type: 'preventive' | 'corrective' | 'emergency';
  description: string;
  duration: number;
  cost: number;
  parts: { name: string; cost: number }[];
  technician: string;
  downtime: number;
}

export interface QualityMetrics {
  defectRate: number;        // %
  firstPassYield: number;    // %
  reworkRate: number;        // %
  scrapRate: number;         // %
  customerReturns: number;
  qualityScore: number;      // 0-100
  sixSigmaLevel: number;
  cpk: number;               // Process Capability Index
}

export interface QualityControl {
  id: string;
  type: 'incoming' | 'in_process' | 'final' | 'audit';
  productId?: string;
  batchId?: string;
  date: number;
  inspector: string;
  status: 'passed' | 'failed' | 'conditional';
  checkpoints: QualityCheckpoint[];
  nonConformities: NonConformity[];
  certificate?: string;
}

export interface QualityCheckpoint {
  id: string;
  name: string;
  specification: string;
  measured: number;
  tolerance: { min: number; max: number };
  passed: boolean;
}

export interface NonConformity {
  id: string;
  severity: 'minor' | 'major' | 'critical';
  description: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  cost: number;
}

export interface ISOCertification {
  id: string;
  standard: 'ISO9001' | 'ISO14001' | 'ISO45001' | 'ISO27001' | 'ISO22000' | 'IATF16949';
  status: 'not_started' | 'preparing' | 'auditing' | 'certified' | 'suspended' | 'expired';
  certificationDate?: number;
  expiryDate?: number;
  auditor: string;
  scope: string[];
  requirements: ISORequirement[];
  cost: number;
  annualAuditCost: number;
}

export interface ISORequirement {
  id: string;
  clause: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'implemented' | 'verified';
  evidence: string[];
  nonConformities: number;
}

export interface Warehouse {
  id: string;
  name: string;
  type: 'raw_materials' | 'wip' | 'finished_goods' | 'distribution';
  location: string;
  capacity: number;          // m³ or units
  currentOccupancy: number;
  zones: WarehouseZone[];
  temperature?: { min: number; max: number };
  humidity?: { min: number; max: number };
  operatingCost: number;
  staff: number;
}

export interface WarehouseZone {
  id: string;
  name: string;
  type: 'receiving' | 'storage' | 'picking' | 'packing' | 'shipping' | 'quarantine';
  capacity: number;
  currentOccupancy: number;
  items: InventoryLocation[];
}

export interface InventoryLocation {
  itemId: string;
  quantity: number;
  zone: string;
  rack: string;
  shelf: string;
  position: string;
  lastCounted: number;
  expiryDate?: number;
  batchNumber?: string;
}

export interface SupplyChainMetrics {
  inventoryTurnover: number;
  stockoutRate: number;
  fillRate: number;
  perfectOrderRate: number;
  onTimeDelivery: number;
  leadTime: number;
  orderAccuracy: number;
  warehouseUtilization: number;
  transportationCost: number;
  totalLogisticsCost: number;
}

export interface LeanInitiative {
  id: string;
  name: string;
  type: '5S' | 'Kaizen' | 'Kanban' | 'TPM' | 'SMED' | 'ValueStream' | 'SixSigma' | 'Poka-Yoke';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  area: string;
  team: string[];
  startDate: number;
  endDate?: number;
  targetSavings: number;
  actualSavings: number;
  kpis: { name: string; before: number; after: number; improvement: number }[];
}

// ==================== COMMERCIAL & MARKETING ====================

export interface CRMContact {
  id: string;
  type: 'lead' | 'prospect' | 'customer' | 'partner' | 'churned';
  companyName: string;
  companySize: 'startup' | 'tpe' | 'pme' | 'eti' | 'ge';
  industry: string;
  contacts: ContactPerson[];
  source: string;
  status: 'cold' | 'warm' | 'hot' | 'qualified' | 'negotiating' | 'closed_won' | 'closed_lost';
  score: number;            // 0-100 lead score
  value: number;            // potential value
  probability: number;      // win probability
  tags: string[];
  notes: string[];
  activities: CRMActivity[];
  opportunities: Opportunity[];
  createdAt: number;
  lastContactAt: number;
  assignedTo: string;
}

export interface ContactPerson {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  decisionMaker: boolean;
  influencer: boolean;
  relationship: 'new' | 'developing' | 'established' | 'strong';
}

export interface CRMActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'negotiation' | 'other';
  date: number;
  duration: number;
  subject: string;
  notes: string;
  outcome: string;
  nextAction?: { date: number; type: string; description: string };
  performedBy: string;
}

export interface Opportunity {
  id: string;
  name: string;
  contactId: string;
  stage: 'qualification' | 'needs_analysis' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  value: number;
  probability: number;
  expectedCloseDate: number;
  actualCloseDate?: number;
  products: { productId: string; quantity: number; price: number; discount: number }[];
  competitors: string[];
  winLossReason?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SalesPipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  opportunities: Opportunity[];
  totalValue: number;
  weightedValue: number;
  winRate: number;
  averageCycleTime: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  probability: number;
  order: number;
  daysInStage: number;
  opportunities: number;
  value: number;
}

export interface MarketStudy {
  id: string;
  name: string;
  type: 'market_size' | 'competitor' | 'customer' | 'trend' | 'feasibility';
  status: 'planned' | 'in_progress' | 'completed';
  date: number;
  methodology: string;
  sampleSize?: number;
  cost: number;
  provider?: string;
  findings: MarketFinding[];
  recommendations: string[];
  attachments: string[];
}

export interface MarketFinding {
  id: string;
  category: string;
  insight: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  data: Record<string, number | string>;
}

export interface CompetitorAnalysis {
  id: string;
  competitorId: string;
  date: number;
  // SWOT
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  // Metrics
  estimatedRevenue: number;
  marketShare: number;
  employeeCount: number;
  growthRate: number;
  // Products
  products: { name: string; price: number; quality: number; marketShare: number }[];
  // Strategy
  pricingStrategy: string;
  marketingStrategy: string;
  distributionChannels: string[];
  // Response plan
  responseActions: string[];
}

export interface PricingStrategy {
  id: string;
  productId: string;
  type: 'cost_plus' | 'value_based' | 'competitive' | 'penetration' | 'skimming' | 'dynamic';
  basePrice: number;
  // Cost-plus
  costBasis?: number;
  markup?: number;
  // Value-based
  perceivedValue?: number;
  // Competitive
  competitorPrices?: { competitorId: string; price: number }[];
  positioningVsCompetitors: 'below' | 'at' | 'above' | 'premium';
  // Dynamic
  dynamicRules?: PricingRule[];
  // Discounts
  discountTiers: { minQuantity: number; discount: number }[];
  promotionalPrices: { startDate: number; endDate: number; price: number; reason: string }[];
}

export interface PricingRule {
  id: string;
  condition: string;
  adjustment: number;
  adjustmentType: 'percent' | 'absolute';
  priority: number;
  active: boolean;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  type: 'points' | 'tiered' | 'cashback' | 'subscription';
  active: boolean;
  members: LoyaltyMember[];
  tiers: LoyaltyTier[];
  rewards: LoyaltyReward[];
  rules: LoyaltyRule[];
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  programCost: number;
  retentionImpact: number;
}

export interface LoyaltyMember {
  customerId: string;
  tier: string;
  points: number;
  lifetimePoints: number;
  joinDate: number;
  lastActivity: number;
  redemptions: { date: number; points: number; reward: string }[];
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  pointsMultiplier: number;
  exclusiveRewards: string[];
}

export interface LoyaltyReward {
  id: string;
  name: string;
  type: 'discount' | 'product' | 'experience' | 'donation';
  pointsCost: number;
  value: number;
  available: boolean;
  stock?: number;
}

export interface LoyaltyRule {
  id: string;
  event: string;
  pointsAwarded: number;
  conditions: string[];
}

export interface CustomerSatisfaction {
  id: string;
  type: 'NPS' | 'CSAT' | 'CES';
  date: number;
  responses: SatisfactionResponse[];
  score: number;
  benchmark: number;
  segments: { name: string; score: number; responses: number }[];
  verbatims: { text: string; sentiment: 'positive' | 'neutral' | 'negative'; theme: string }[];
  actionPlan: string[];
}

export interface SatisfactionResponse {
  customerId: string;
  score: number;
  comment?: string;
  date: number;
  touchpoint: string;
}

export interface DigitalMarketingCampaign {
  id: string;
  name: string;
  channel: 'google_ads' | 'meta_ads' | 'linkedin' | 'email' | 'seo' | 'content' | 'influencer';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  objective: 'awareness' | 'traffic' | 'engagement' | 'leads' | 'sales';
  budget: number;
  spent: number;
  startDate: number;
  endDate: number;
  targeting: CampaignTargeting;
  creatives: CampaignCreative[];
  metrics: CampaignMetrics;
}

export interface CampaignTargeting {
  locations: string[];
  ageRange: { min: number; max: number };
  genders: string[];
  interests: string[];
  behaviors: string[];
  customAudiences: string[];
  excludedAudiences: string[];
  devices: string[];
  schedule: { days: string[]; hours: number[] };
}

export interface CampaignCreative {
  id: string;
  type: 'image' | 'video' | 'carousel' | 'text';
  headline: string;
  description: string;
  callToAction: string;
  mediaUrl?: string;
  performance: { impressions: number; clicks: number; conversions: number };
}

export interface CampaignMetrics {
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversions: number;
  conversionRate: number;
  cpa: number;
  roas: number;
  revenue: number;
  engagement: number;
  shares: number;
  comments: number;
}

export interface SalesTerritory {
  id: string;
  name: string;
  type: 'geographic' | 'industry' | 'named_accounts' | 'product';
  assignedTo: string;
  // Geographic
  regions?: string[];
  postalCodes?: string[];
  // Accounts
  accounts: string[];
  // Performance
  quota: number;
  revenue: number;
  pipeline: number;
  winRate: number;
  averageDealSize: number;
}

// ==================== ADVANCED GAME MECHANICS ====================

export interface ResearchProject {
  id: string;
  name: string;
  category: 'product' | 'process' | 'technology' | 'market';
  status: 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  spent: number;
  team: string[];
  startDate: number;
  estimatedEndDate: number;
  actualEndDate?: number;
  progress: number;
  milestones: { name: string; date: number; completed: boolean }[];
  outcomes: { type: string; value: number; description: string }[];
  riskLevel: 'low' | 'medium' | 'high';
  successProbability: number;
}

export interface Partnership {
  id: string;
  name: string;
  type: 'strategic' | 'distribution' | 'technology' | 'joint_venture' | 'licensing';
  partnerId: string;
  status: 'negotiating' | 'active' | 'suspended' | 'terminated';
  startDate: number;
  endDate?: number;
  terms: string[];
  revenueShare: number;
  exclusivity: boolean;
  territories: string[];
  performance: { metric: string; target: number; actual: number }[];
}

export interface MergerAcquisition {
  id: string;
  type: 'merger' | 'acquisition' | 'divestiture';
  target: string;
  status: 'prospecting' | 'due_diligence' | 'negotiation' | 'closing' | 'integration' | 'completed' | 'failed';
  valuation: number;
  offerPrice: number;
  synergies: { type: string; value: number; timeline: number }[];
  dueDiligence: { area: string; status: string; findings: string }[];
  integrationPlan: string[];
  risks: string[];
  advisors: { name: string; role: string; fee: number }[];
}

export interface ESGScore {
  overall: number;
  environmental: {
    score: number;
    carbonFootprint: number;
    energyEfficiency: number;
    wasteManagement: number;
    waterUsage: number;
    biodiversityImpact: number;
  };
  social: {
    score: number;
    employeeSatisfaction: number;
    diversityIndex: number;
    safetyRecord: number;
    communityEngagement: number;
    supplyChainEthics: number;
  };
  governance: {
    score: number;
    boardDiversity: number;
    executiveCompensation: number;
    transparency: number;
    antiCorruption: number;
    dataPrivacy: number;
  };
  certifications: string[];
  reports: { year: number; url: string }[];
}

export interface GovernmentIncentive {
  id: string;
  name: string;
  type: 'tax_credit' | 'grant' | 'loan' | 'guarantee' | 'subsidy';
  provider: string;
  eligibility: string[];
  amount: number;
  status: 'available' | 'applied' | 'approved' | 'rejected' | 'received';
  applicationDeadline?: number;
  requirements: string[];
  documents: string[];
}
