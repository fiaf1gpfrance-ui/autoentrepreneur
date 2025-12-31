// ==================== ADVANCED COMMERCIAL SYSTEMS ====================

export type LeadSource = 'website' | 'referral' | 'cold_call' | 'trade_show' | 'social_media' | 'advertising' | 'partnership';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type DealStage = 'prospecting' | 'qualification' | 'needs_analysis' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  score: number; // 1-100
  estimatedValue: number;
  createdAt: number;
  lastContactAt: number;
  notes: string[];
  assignedTo?: string;
}

export interface Deal {
  id: string;
  leadId: string;
  name: string;
  value: number;
  stage: DealStage;
  probability: number; // 0-100
  expectedCloseDate: number;
  createdAt: number;
  products: string[];
  competitors: string[];
  notes: string[];
  activities: DealActivity[];
}

export interface DealActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'negotiation';
  date: number;
  description: string;
  outcome?: 'positive' | 'neutral' | 'negative';
}

export interface SalesPipeline {
  leads: Lead[];
  deals: Deal[];
  conversionRates: Record<DealStage, number>;
  averageDealValue: number;
  averageSalesCycle: number; // days
  winRate: number;
}

export interface Quote {
  id: string;
  clientId: string;
  dealId?: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax: number;
  total: number;
  validUntil: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: number;
}

export interface QuoteItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface SalesTarget {
  id: string;
  employeeId?: string;
  type: 'revenue' | 'deals' | 'new_clients' | 'retention';
  period: 'monthly' | 'quarterly' | 'yearly';
  target: number;
  current: number;
  startDate: number;
  endDate: number;
  bonus?: number;
}

export interface CustomerFeedback {
  id: string;
  clientId: string;
  type: 'nps' | 'csat' | 'review' | 'complaint' | 'suggestion';
  score?: number; // 1-10
  comment: string;
  date: number;
  resolved: boolean;
  response?: string;
}

// ==================== ADVANCED PRODUCTION SYSTEMS ====================

export type MachineStatus = 'running' | 'idle' | 'maintenance' | 'broken' | 'offline';
export type QualityGrade = 'A' | 'B' | 'C' | 'D' | 'rejected';

export interface ProductionLine {
  id: string;
  name: string;
  productId: string;
  capacity: number; // units per day
  currentOutput: number;
  efficiency: number; // 0-100
  machines: Machine[];
  workers: string[]; // employee IDs
  shifts: ProductionShift[];
  maintenanceSchedule: MaintenanceSchedule;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: MachineStatus;
  efficiency: number; // 0-100
  age: number; // days
  maintenanceLevel: number; // 0-100
  nextMaintenance: number;
  operatingCost: number; // per day
  purchasePrice: number;
  depreciationRate: number;
  currentValue: number;
}

export interface ProductionShift {
  id: string;
  name: string;
  startHour: number;
  endHour: number;
  workers: string[];
  productivity: number;
  active: boolean;
}

export interface MaintenanceSchedule {
  lastMaintenance: number;
  nextMaintenance: number;
  maintenanceType: 'preventive' | 'corrective' | 'predictive';
  estimatedCost: number;
  estimatedDowntime: number; // hours
}

export interface QualityControl {
  id: string;
  productId: string;
  batchId: string;
  inspectionDate: number;
  sampleSize: number;
  defectRate: number;
  grades: Record<QualityGrade, number>;
  passed: boolean;
  inspector: string;
  notes: string;
}

export interface ProductionBatch {
  id: string;
  productId: string;
  lineId: string;
  quantity: number;
  startDate: number;
  endDate?: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  qualityCheck?: QualityControl;
  rawMaterialsUsed: { itemId: string; quantity: number }[];
  laborCost: number;
  materialCost: number;
  overheadCost: number;
  unitCost: number;
}

export interface AutomationSystem {
  id: string;
  name: string;
  type: 'robot' | 'plc' | 'scada' | 'erp_integration' | 'ai_optimization';
  lineId: string;
  purchasePrice: number;
  installationCost: number;
  maintenanceCost: number;
  efficiencyBoost: number;
  laborReduction: number; // percentage of workers replaced
  active: boolean;
  installedAt: number;
}

// ==================== ADVANCED HR SYSTEMS ====================

export type PerformanceRating = 1 | 2 | 3 | 4 | 5;
export type EmployeeStatus = 'active' | 'probation' | 'leave' | 'suspended' | 'terminated';

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: { start: number; end: number };
  rating: PerformanceRating;
  goals: Goal[];
  strengths: string[];
  improvements: string[];
  comments: string;
  salaryAdjustment?: number;
  bonusAwarded?: number;
  promotionRecommended: boolean;
  date: number;
}

export interface Goal {
  id: string;
  description: string;
  target: number;
  current: number;
  deadline: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  weight: number; // importance 0-100
}

export interface CareerPath {
  id: string;
  employeeId: string;
  currentRole: string;
  targetRole: string;
  steps: CareerStep[];
  estimatedTimeframe: number; // months
  progress: number; // 0-100
}

export interface CareerStep {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  completed: boolean;
  completedAt?: number;
}

export interface RecruitmentCampaign {
  id: string;
  role: string;
  department: string;
  salary: { min: number; max: number };
  requirements: string[];
  applications: JobApplication[];
  status: 'draft' | 'active' | 'paused' | 'closed';
  budget: number;
  spent: number;
  startDate: number;
  deadline: number;
  channels: RecruitmentChannel[];
}

export interface RecruitmentChannel {
  name: 'linkedin' | 'indeed' | 'website' | 'referral' | 'headhunter' | 'job_fair';
  cost: number;
  applicationsReceived: number;
  conversionRate: number;
}

export interface JobApplication {
  id: string;
  candidateName: string;
  email: string;
  experience: number;
  skills: number; // 1-100
  salaryExpectation: number;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  score: number;
  interviewNotes: string[];
  appliedAt: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'training';
  startDate: number;
  endDate: number;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  approvedBy?: string;
}

export interface TimeTracking {
  id: string;
  employeeId: string;
  date: number;
  hoursWorked: number;
  overtime: number;
  breaks: number;
  productivity: number;
  tasks: string[];
}

export interface Payroll {
  id: string;
  employeeId: string;
  period: { month: number; year: number };
  baseSalary: number;
  overtime: number;
  bonus: number;
  commissions: number;
  deductions: { type: string; amount: number }[];
  taxes: number;
  netPay: number;
  paidAt?: number;
  status: 'pending' | 'processed' | 'paid';
}

// ==================== ADVANCED FINANCE SYSTEMS ====================

export type StockType = 'equity' | 'bond' | 'etf' | 'crypto' | 'commodity' | 'forex';
export type TransactionType = 'buy' | 'sell' | 'dividend' | 'interest' | 'fee';

export interface StockPosition {
  id: string;
  symbol: string;
  name: string;
  type: StockType;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  unrealizedGain: number;
  dividendYield?: number;
  purchaseDate: number;
}

export interface Portfolio {
  id: string;
  name: string;
  positions: StockPosition[];
  cash: number;
  totalValue: number;
  dailyChange: number;
  totalReturn: number;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  benchmark: string;
  createdAt: number;
}

export interface InvestmentTransaction {
  id: string;
  portfolioId: string;
  positionId?: string;
  type: TransactionType;
  amount: number;
  quantity?: number;
  price?: number;
  fees: number;
  date: number;
  notes?: string;
}

export interface FinancialForecast {
  id: string;
  type: 'revenue' | 'expenses' | 'profit' | 'cash_flow';
  period: 'monthly' | 'quarterly' | 'yearly';
  projections: ForecastDataPoint[];
  assumptions: string[];
  scenarios: ForecastScenario[];
  createdAt: number;
}

export interface ForecastDataPoint {
  date: number;
  value: number;
  confidence: number; // 0-100
}

export interface ForecastScenario {
  name: 'optimistic' | 'realistic' | 'pessimistic';
  multiplier: number;
  assumptions: string[];
}

export interface Budget {
  id: string;
  name: string;
  period: { month: number; year: number };
  categories: BudgetCategory[];
  totalBudget: number;
  totalSpent: number;
  status: 'draft' | 'approved' | 'active' | 'closed';
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  variance: number;
  subcategories?: BudgetCategory[];
}

export interface CashFlowStatement {
  period: { start: number; end: number };
  operating: {
    netIncome: number;
    depreciation: number;
    accountsReceivable: number;
    accountsPayable: number;
    inventory: number;
    total: number;
  };
  investing: {
    capitalExpenditures: number;
    acquisitions: number;
    investments: number;
    total: number;
  };
  financing: {
    debtIssuance: number;
    debtRepayment: number;
    dividends: number;
    equityIssuance: number;
    total: number;
  };
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

export interface TaxPlanning {
  id: string;
  year: number;
  estimatedIncome: number;
  estimatedTax: number;
  deductions: TaxDeduction[];
  credits: TaxCredit[];
  strategies: TaxStrategy[];
  quarterlyPayments: { quarter: number; amount: number; paid: boolean }[];
}

export interface TaxDeduction {
  id: string;
  category: string;
  description: string;
  amount: number;
  documentation: boolean;
}

export interface TaxCredit {
  id: string;
  name: string;
  type: 'research' | 'employment' | 'investment' | 'environmental';
  amount: number;
  eligible: boolean;
  applied: boolean;
}

export interface TaxStrategy {
  id: string;
  name: string;
  description: string;
  potentialSavings: number;
  complexity: 'low' | 'medium' | 'high';
  implemented: boolean;
}

// ==================== COMPANY EXTENSION ====================

export interface AdvancedCompanyData {
  // Commercial
  salesPipeline: SalesPipeline;
  quotes: Quote[];
  salesTargets: SalesTarget[];
  customerFeedback: CustomerFeedback[];
  
  // Production
  productionLines: ProductionLine[];
  batches: ProductionBatch[];
  qualityControls: QualityControl[];
  automationSystems: AutomationSystem[];
  
  // HR
  performanceReviews: PerformanceReview[];
  careerPaths: CareerPath[];
  recruitmentCampaigns: RecruitmentCampaign[];
  leaveRequests: LeaveRequest[];
  timeTracking: TimeTracking[];
  payrolls: Payroll[];
  
  // Finance
  portfolios: Portfolio[];
  investmentTransactions: InvestmentTransaction[];
  financialForecasts: FinancialForecast[];
  budgets: Budget[];
  taxPlanning: TaxPlanning[];
}

// Initialize empty advanced data
export const createAdvancedCompanyData = (): AdvancedCompanyData => ({
  salesPipeline: {
    leads: [],
    deals: [],
    conversionRates: {
      prospecting: 0,
      qualification: 0,
      needs_analysis: 0,
      proposal: 0,
      negotiation: 0,
      closing: 0,
      won: 0,
      lost: 0,
    },
    averageDealValue: 0,
    averageSalesCycle: 30,
    winRate: 0,
  },
  quotes: [],
  salesTargets: [],
  customerFeedback: [],
  productionLines: [],
  batches: [],
  qualityControls: [],
  automationSystems: [],
  performanceReviews: [],
  careerPaths: [],
  recruitmentCampaigns: [],
  leaveRequests: [],
  timeTracking: [],
  payrolls: [],
  portfolios: [],
  investmentTransactions: [],
  financialForecasts: [],
  budgets: [],
  taxPlanning: [],
});
