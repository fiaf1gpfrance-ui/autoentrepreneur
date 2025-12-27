// Types for Simu'Entrepreneur game - Extended Version

export type LegalStatus = 'auto-entrepreneur' | 'sarl' | 'sas';
export type Sector = 'tech' | 'artisanat' | 'services' | 'industrie';
export type ContractType = 'cdi' | 'cdd' | 'alternance';
export type EmployeeTrait = 'syndicaliste' | 'workaholic' | 'creatif' | 'rigoureux' | 'leader' | 'discret' | 'negociateur' | 'perfectionniste';
export type ProductPhase = 'rd' | 'lancement' | 'maturite' | 'declin';
export type EventCategory = 'administratif' | 'marche' | 'interne' | 'economique' | 'juridique' | 'international' | 'fournisseur' | 'client' | 'banque';
export type EconomicWeather = 'croissance' | 'stable' | 'recession' | 'crise';

// ==================== BANKING SYSTEM ====================
export type LoanType = 'court_terme' | 'moyen_terme' | 'long_terme' | 'immobilier';
export type InvestmentType = 'livret' | 'compte_terme' | 'actions' | 'obligations' | 'sicav';
export type BankRelationship = 'nouveau' | 'client' | 'prefere' | 'vip';

export interface BankLoan {
  id: string;
  type: LoanType;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  monthlyPayment: number;
  startDate: number;
  duration: number; // months
  remainingMonths: number;
  guarantee?: string;
  penalty: number;
  missedPayments: number;
}

export interface Overdraft {
  limit: number;
  currentUsage: number;
  interestRate: number;
  monthlyFees: number;
  approved: boolean;
}

export interface Investment {
  id: string;
  type: InvestmentType;
  amount: number;
  interestRate: number;
  startDate: number;
  maturityDate?: number;
  currentValue: number;
  locked: boolean;
}

export interface BankAccount {
  bankName: string;
  relationship: BankRelationship;
  creditScore: number; // 0-1000
  loans: BankLoan[];
  overdraft: Overdraft;
  investments: Investment[];
  monthlyFees: number;
  transactionHistory: BankTransaction[];
}

export interface BankTransaction {
  id: string;
  date: number;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  category: string;
}

// ==================== REAL ESTATE SYSTEM ====================
export type PropertyType = 'bureau' | 'entrepot' | 'usine' | 'boutique' | 'siege_social';
export type LeaseType = 'location' | 'achat' | 'credit_bail';

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  size: number; // m²
  maxEmployees: number;
  leaseType: LeaseType;
  monthlyRent?: number;
  purchasePrice?: number;
  currentValue: number;
  moralBonus: number;
  productivityBonus: number;
  location: string;
  prestige: number; // 1-10
  condition: number; // 1-100
  maintenanceCost: number;
}

// ==================== SUPPLY CHAIN ====================
export type SupplierRelation = 'nouveau' | 'regulier' | 'partenaire' | 'strategique';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  relation: SupplierRelation;
  reliability: number; // 1-100
  quality: number; // 1-100
  priceLevel: number; // 0.8-1.5 multiplier
  paymentDelay: number; // days
  minOrderAmount: number;
  deliveryTime: number; // days
  contracts: SupplierContract[];
}

export interface SupplierContract {
  id: string;
  supplierId: string;
  productType: string;
  monthlyVolume: number;
  unitPrice: number;
  duration: number;
  startDate: number;
  penalty: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitCost: number;
  reorderLevel: number;
  maxStock: number;
  supplierId: string;
}

// ==================== CLIENTS & CONTRACTS ====================
export type ClientType = 'particulier' | 'tpe' | 'pme' | 'grand_compte' | 'public';
export type ContractStatus = 'negotiation' | 'active' | 'completed' | 'dispute' | 'cancelled';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  sector: string;
  creditRating: number; // 1-100
  paymentDelay: number; // days
  totalRevenue: number;
  relationshipScore: number; // 1-100
  contracts: ClientContract[];
  lastContactDate: number;
}

export interface ClientContract {
  id: string;
  clientId: string;
  name: string;
  status: ContractStatus;
  value: number;
  monthlyValue: number;
  startDate: number;
  endDate: number;
  paymentTerms: number; // days
  penalties: number;
  unpaidAmount: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  contractId: string;
  amount: number;
  issueDate: number;
  dueDate: number;
  paid: boolean;
  paidDate?: number;
  overdue: boolean;
}

// ==================== LEGAL SYSTEM ====================
export type LegalCaseType = 'prudhommes' | 'commercial' | 'fiscal' | 'propriete_intellectuelle' | 'contrat';
export type LegalCaseStatus = 'preparation' | 'en_cours' | 'mediation' | 'jugement' | 'appel' | 'cloture';

export interface Lawyer {
  id: string;
  name: string;
  specialty: LegalCaseType;
  hourlyRate: number;
  successRate: number;
  reputation: number;
}

export interface LegalCase {
  id: string;
  type: LegalCaseType;
  title: string;
  description: string;
  status: LegalCaseStatus;
  lawyerId?: string;
  startDate: number;
  estimatedCost: number;
  actualCost: number;
  potentialLoss: number;
  potentialGain: number;
  winProbability: number;
  opponent: string;
}

export interface IntellectualProperty {
  id: string;
  type: 'brevet' | 'marque' | 'droit_auteur' | 'dessin_modele';
  name: string;
  registrationDate: number;
  expirationDate: number;
  annualFee: number;
  value: number;
}

// ==================== ADVANCED HR ====================
export type TrainingType = 'technique' | 'management' | 'langue' | 'securite' | 'commercial';
export type BenefitType = 'mutuelle' | 'tickets_resto' | 'interessement' | 'participation' | 'ce' | 'teletravail' | 'voiture';

export interface Training {
  id: string;
  employeeId: string;
  type: TrainingType;
  name: string;
  duration: number; // days
  cost: number;
  skillBoost: number;
  startDate: number;
  completed: boolean;
}

export interface SocialBenefit {
  type: BenefitType;
  name: string;
  monthlyCost: number;
  moralBonus: number;
  active: boolean;
  eligibleEmployees: number;
}

export interface Union {
  id: string;
  name: string;
  memberCount: number;
  influence: number; // 0-100
  demands: UnionDemand[];
  lastNegotiation: number;
  relationship: number; // 0-100
}

export interface UnionDemand {
  id: string;
  type: 'salaire' | 'conditions' | 'avantages' | 'securite' | 'temps_travail';
  description: string;
  priority: 'faible' | 'moyenne' | 'haute' | 'critique';
  costImpact: number;
  moralImpact: number;
  deadline?: number;
  accepted?: boolean;
}

// ==================== INTERNATIONAL ====================
export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'JPY' | 'CNY';

export interface ForeignMarket {
  id: string;
  country: string;
  currency: Currency;
  exchangeRate: number;
  marketSize: number;
  penetration: number; // 0-100
  entryBarrier: number; // 0-100
  customsDuty: number; // %
  taxRate: number;
  hasSubsidiary: boolean;
  localPartner?: string;
  revenue: number;
}

export interface Subsidiary {
  id: string;
  name: string;
  country: string;
  employees: number;
  treasury: number;
  revenue: number;
  expenses: number;
  managerId?: string;
}

// ==================== ACHIEVEMENTS ====================
export type AchievementCategory = 'finance' | 'rh' | 'production' | 'commercial' | 'legal' | 'international';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  requirement: string;
  reward: {
    treasury?: number;
    credibility?: number;
    unlocks?: string[];
  };
  unlocked: boolean;
  unlockedDate?: number;
  progress?: number;
  target?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: MissionObjective[];
  deadline?: number;
  reward: {
    treasury?: number;
    credibility?: number;
  };
  completed: boolean;
  failed: boolean;
}

export interface MissionObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

// ==================== COMPETITION AI ====================
export interface Competitor {
  id: string;
  name: string;
  sector: Sector;
  size: 'startup' | 'pme' | 'eti' | 'grande_entreprise';
  marketShare: number;
  aggressiveness: number; // 0-100
  innovation: number; // 0-100
  reputation: number; // 0-100
  products: CompetitorProduct[];
  lastAction?: string;
  priceLevel: number; // 0.7-1.3
}

export interface CompetitorProduct {
  name: string;
  price: number;
  quality: number;
  marketShare: number;
}

// ==================== EXTENDED EMPLOYEE ====================
export interface Employee {
  id: string;
  name: string;
  role: string;
  skills: number;
  moral: number;
  contractType: ContractType;
  trait: EmployeeTrait;
  brutSalary: number;
  hireDate: number;
  productivity: number;
  // Extended fields
  seniority: number;
  experience: number;
  education: 'bac' | 'bac+2' | 'bac+3' | 'bac+5' | 'doctorat';
  trainings: Training[];
  evaluationScore?: number;
  lastRaise?: number;
  promotions: number;
  absences: number;
  warnings: number;
  bonus: number;
  benefits: BenefitType[];
  managerId?: string;
  teamId?: string;
}

export interface Product {
  id: string;
  name: string;
  phase: ProductPhase;
  rdCost: number;
  rdProgress: number;
  basePrice: number;
  currentPrice: number;
  quality: number;
  marketingBudget: number;
  salesVolume: number;
  phaseStartDay: number;
  // Extended fields
  patents: IntellectualProperty[];
  costOfGoods: number;
  margin: number;
  targetMarket: string;
  certifications: string[];
  exportEnabled: boolean;
  competitorPriceIndex: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  severity: 'info' | 'warning' | 'critical';
  effects: {
    treasury?: number;
    credibility?: number;
    moral?: number;
    productivity?: number;
    bankScore?: number;
    marketShare?: number;
  };
  choices?: {
    label: string;
    effects: {
      treasury?: number;
      credibility?: number;
      moral?: number;
      bankScore?: number;
    };
    requirements?: {
      treasury?: number;
      credibility?: number;
    };
  }[];
  day: number;
  expires?: number;
}

export interface TaxDeclaration {
  type: 'tva' | 'urssaf' | 'is' | 'cfe' | 'cvae' | 'taxe_apprentissage';
  amount: number;
  dueDate: number;
  paid: boolean;
  penalty?: number;
  quarter?: number;
  year?: number;
}

export interface FinancialHistory {
  day: number;
  treasury: number;
  revenue: number;
  expenses: number;
  netResult: number;
  // Extended
  loans?: number;
  investments?: number;
  clientReceivables?: number;
  supplierPayables?: number;
}

export interface Company {
  name: string;
  legalStatus: LegalStatus;
  sector: Sector;
  capital: number;
  treasury: number;
  credibility: number;
  employees: Employee[];
  products: Product[];
  taxDeclarations: TaxDeclaration[];
  monthlyRevenue: number;
  monthlyExpenses: number;
  tvaCollected: number;
  tvaDeductible: number;
  urssafDebt: number;
  isDebt: number;
  financialHistory: FinancialHistory[];
  // Extended
  bankAccount: BankAccount;
  properties: Property[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  clients: Client[];
  invoices: Invoice[];
  legalCases: LegalCase[];
  lawyers: Lawyer[];
  intellectualProperty: IntellectualProperty[];
  socialBenefits: SocialBenefit[];
  unions: Union[];
  foreignMarkets: ForeignMarket[];
  subsidiaries: Subsidiary[];
  achievements: Achievement[];
  missions: Mission[];
  competitors: Competitor[];
  foundedDate: number;
  ceo: string;
  slogan?: string;
  headquarters?: string;
  marketShare: number;
  reputation: number;
  innovationScore: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface GameState {
  company: Company | null;
  day: number;
  month: number;
  year: number;
  isPaused: boolean;
  gameSpeed: number;
  economicWeather: EconomicWeather;
  events: GameEvent[];
  activeEvents: GameEvent[];
  gameOver: boolean;
  gameOverReason?: string;
  consecutiveNegativeMonths: number;
  // Extended
  inflationRate: number;
  interestRate: number;
  exchangeRates: Record<Currency, number>;
  marketTrends: Record<Sector, number>;
  globalEconomy: number;
  tutorialCompleted: boolean;
  difficulty: 'facile' | 'normal' | 'difficile' | 'hardcore';
  statistics: GameStatistics;
}

export interface GameStatistics {
  totalRevenue: number;
  totalExpenses: number;
  totalTaxesPaid: number;
  totalSalariesPaid: number;
  employeesHired: number;
  employeesFired: number;
  productsLaunched: number;
  contractsSigned: number;
  lawsuitsWon: number;
  lawsuitsLost: number;
  loansRepaid: number;
  investmentsReturned: number;
  countriesExpanded: number;
  achievementsUnlocked: number;
}

// Tax rates (French system 2024)
export const TAX_RATES = {
  urssaf_patronal: 0.45,
  urssaf_salarial: 0.22,
  tva_standard: 0.20,
  tva_reduit: 0.10,
  tva_super_reduit: 0.055,
  is_standard: 0.25,
  is_pme: 0.15,
  ae_charges: 0.22,
  cfe_rate: 0.015,
  cvae_rate: 0.0075,
  taxe_apprentissage: 0.0068,
  formation_continue: 0.01,
} as const;

export const SECTOR_MODIFIERS = {
  tech: {
    marginMultiplier: 1.4,
    salaryMultiplier: 1.5,
    innovationSpeed: 1.3,
    clientLoyalty: 0.7,
    exportPotential: 1.5,
    competitionIntensity: 1.4,
  },
  artisanat: {
    marginMultiplier: 0.8,
    salaryMultiplier: 0.9,
    innovationSpeed: 0.6,
    clientLoyalty: 1.4,
    exportPotential: 0.6,
    competitionIntensity: 0.7,
  },
  services: {
    marginMultiplier: 1.1,
    salaryMultiplier: 1.0,
    innovationSpeed: 1.0,
    clientLoyalty: 1.0,
    exportPotential: 1.0,
    competitionIntensity: 1.0,
  },
  industrie: {
    marginMultiplier: 1.0,
    salaryMultiplier: 1.1,
    innovationSpeed: 0.8,
    clientLoyalty: 1.2,
    exportPotential: 1.3,
    competitionIntensity: 1.1,
  },
} as const;

export const LEGAL_STATUS_MODIFIERS = {
  'auto-entrepreneur': {
    maxRevenue: 77700,
    taxSimplicity: 1.5,
    flexibility: 0.5,
    credibilityBonus: -10,
    maxEmployees: 0,
    canExport: false,
  },
  sarl: {
    maxRevenue: Infinity,
    taxSimplicity: 1.0,
    flexibility: 1.0,
    credibilityBonus: 0,
    maxEmployees: 50,
    canExport: true,
  },
  sas: {
    maxRevenue: Infinity,
    taxSimplicity: 0.8,
    flexibility: 1.3,
    credibilityBonus: 10,
    maxEmployees: Infinity,
    canExport: true,
  },
} as const;

// Loan configurations
export const LOAN_CONFIGS = {
  court_terme: {
    name: 'Prêt Court Terme',
    minAmount: 5000,
    maxAmount: 50000,
    minDuration: 3,
    maxDuration: 12,
    baseRate: 0.06,
    requiresGuarantee: false,
  },
  moyen_terme: {
    name: 'Prêt Moyen Terme',
    minAmount: 20000,
    maxAmount: 200000,
    minDuration: 12,
    maxDuration: 60,
    baseRate: 0.045,
    requiresGuarantee: true,
  },
  long_terme: {
    name: 'Prêt Long Terme',
    minAmount: 50000,
    maxAmount: 1000000,
    minDuration: 60,
    maxDuration: 180,
    baseRate: 0.035,
    requiresGuarantee: true,
  },
  immobilier: {
    name: 'Crédit Immobilier',
    minAmount: 100000,
    maxAmount: 5000000,
    minDuration: 120,
    maxDuration: 300,
    baseRate: 0.028,
    requiresGuarantee: true,
  },
} as const;

// Investment configurations
export const INVESTMENT_CONFIGS = {
  livret: {
    name: 'Livret Entreprise',
    minAmount: 1000,
    maxAmount: 100000,
    baseRate: 0.03,
    locked: false,
    risk: 0,
  },
  compte_terme: {
    name: 'Compte à Terme',
    minAmount: 10000,
    maxAmount: 500000,
    baseRate: 0.04,
    locked: true,
    risk: 0.05,
  },
  actions: {
    name: 'Actions',
    minAmount: 5000,
    maxAmount: Infinity,
    baseRate: 0.08,
    locked: false,
    risk: 0.3,
  },
  obligations: {
    name: 'Obligations',
    minAmount: 10000,
    maxAmount: Infinity,
    baseRate: 0.05,
    locked: true,
    risk: 0.1,
  },
  sicav: {
    name: 'SICAV',
    minAmount: 1000,
    maxAmount: Infinity,
    baseRate: 0.06,
    locked: false,
    risk: 0.2,
  },
} as const;

// Property configurations
export const PROPERTY_CONFIGS = {
  bureau: {
    name: 'Bureau',
    baseRentPerM2: 25,
    basePricePerM2: 3000,
    maxEmployeesPerM2: 0.1,
    moralBonus: 5,
    productivityBonus: 5,
  },
  entrepot: {
    name: 'Entrepôt',
    baseRentPerM2: 8,
    basePricePerM2: 800,
    maxEmployeesPerM2: 0.05,
    moralBonus: 0,
    productivityBonus: 10,
  },
  usine: {
    name: 'Usine',
    baseRentPerM2: 12,
    basePricePerM2: 1200,
    maxEmployeesPerM2: 0.08,
    moralBonus: -5,
    productivityBonus: 15,
  },
  boutique: {
    name: 'Boutique',
    baseRentPerM2: 40,
    basePricePerM2: 5000,
    maxEmployeesPerM2: 0.15,
    moralBonus: 10,
    productivityBonus: 0,
  },
  siege_social: {
    name: 'Siège Social',
    baseRentPerM2: 50,
    basePricePerM2: 6000,
    maxEmployeesPerM2: 0.12,
    moralBonus: 15,
    productivityBonus: 10,
  },
} as const;

// Countries for international expansion
export const COUNTRIES = {
  germany: { name: 'Allemagne', currency: 'EUR' as Currency, exchangeRate: 1, marketSize: 100, entryBarrier: 30, customsDuty: 0, taxRate: 0.30 },
  uk: { name: 'Royaume-Uni', currency: 'GBP' as Currency, exchangeRate: 0.86, marketSize: 80, entryBarrier: 40, customsDuty: 0.05, taxRate: 0.19 },
  usa: { name: 'États-Unis', currency: 'USD' as Currency, exchangeRate: 1.08, marketSize: 200, entryBarrier: 60, customsDuty: 0.03, taxRate: 0.21 },
  switzerland: { name: 'Suisse', currency: 'CHF' as Currency, exchangeRate: 0.94, marketSize: 30, entryBarrier: 50, customsDuty: 0, taxRate: 0.18 },
  japan: { name: 'Japon', currency: 'JPY' as Currency, exchangeRate: 160, marketSize: 90, entryBarrier: 70, customsDuty: 0.04, taxRate: 0.23 },
  china: { name: 'Chine', currency: 'CNY' as Currency, exchangeRate: 7.8, marketSize: 300, entryBarrier: 80, customsDuty: 0.10, taxRate: 0.25 },
} as const;

// Benefits configurations
export const BENEFIT_CONFIGS: Record<BenefitType, { name: string; baseCost: number; moralBonus: number }> = {
  mutuelle: { name: 'Mutuelle Entreprise', baseCost: 80, moralBonus: 5 },
  tickets_resto: { name: 'Tickets Restaurant', baseCost: 100, moralBonus: 8 },
  interessement: { name: 'Intéressement', baseCost: 200, moralBonus: 12 },
  participation: { name: 'Participation', baseCost: 150, moralBonus: 10 },
  ce: { name: 'Comité d\'Entreprise', baseCost: 50, moralBonus: 15 },
  teletravail: { name: 'Télétravail', baseCost: 30, moralBonus: 20 },
  voiture: { name: 'Voiture de fonction', baseCost: 500, moralBonus: 25 },
};

// Training configurations
export const TRAINING_CONFIGS: Record<TrainingType, { name: string; baseCost: number; duration: number; skillBoost: number }> = {
  technique: { name: 'Formation Technique', baseCost: 2000, duration: 5, skillBoost: 10 },
  management: { name: 'Formation Management', baseCost: 3500, duration: 3, skillBoost: 8 },
  langue: { name: 'Formation Langues', baseCost: 1500, duration: 10, skillBoost: 5 },
  securite: { name: 'Formation Sécurité', baseCost: 800, duration: 1, skillBoost: 3 },
  commercial: { name: 'Formation Commerciale', baseCost: 2500, duration: 4, skillBoost: 8 },
};
