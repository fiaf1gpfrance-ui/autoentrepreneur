// Types for Simu'Entrepreneur game

export type LegalStatus = 'auto-entrepreneur' | 'sarl' | 'sas';
export type Sector = 'tech' | 'artisanat' | 'services' | 'industrie';
export type ContractType = 'cdi' | 'cdd' | 'alternance';
export type EmployeeTrait = 'syndicaliste' | 'workaholic' | 'creatif' | 'rigoureux' | 'leader' | 'discret';
export type ProductPhase = 'rd' | 'lancement' | 'maturite' | 'declin';
export type EventCategory = 'administratif' | 'marche' | 'interne' | 'economique';
export type EconomicWeather = 'croissance' | 'stable' | 'recession' | 'crise';

export interface Employee {
  id: string;
  name: string;
  role: string;
  skills: number; // 1-100
  moral: number; // 1-100
  contractType: ContractType;
  trait: EmployeeTrait;
  brutSalary: number; // Salaire brut mensuel
  hireDate: number; // Game day hired
  productivity: number; // 0-150%
}

export interface Product {
  id: string;
  name: string;
  phase: ProductPhase;
  rdCost: number;
  rdProgress: number; // 0-100%
  basePrice: number;
  currentPrice: number;
  quality: number; // 1-100
  marketingBudget: number;
  salesVolume: number;
  phaseStartDay: number;
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
  };
  choices?: {
    label: string;
    effects: {
      treasury?: number;
      credibility?: number;
      moral?: number;
    };
  }[];
  day: number;
}

export interface TaxDeclaration {
  type: 'tva' | 'urssaf' | 'is';
  amount: number;
  dueDate: number; // Game day
  paid: boolean;
  penalty?: number;
}

export interface FinancialHistory {
  day: number;
  treasury: number;
  revenue: number;
  expenses: number;
  netResult: number;
}

export interface Company {
  name: string;
  legalStatus: LegalStatus;
  sector: Sector;
  capital: number;
  treasury: number;
  credibility: number; // Score CFS 0-100
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
}

export interface GameState {
  company: Company | null;
  day: number;
  month: number;
  year: number;
  isPaused: boolean;
  gameSpeed: number; // 1, 2, 3
  economicWeather: EconomicWeather;
  events: GameEvent[];
  activeEvents: GameEvent[];
  gameOver: boolean;
  gameOverReason?: string;
  consecutiveNegativeMonths: number;
}

// Tax rates (French system 2024)
export const TAX_RATES = {
  // URSSAF - Charges patronales moyennes
  urssaf_patronal: 0.45, // ~45% du brut
  // URSSAF - Charges salariales
  urssaf_salarial: 0.22, // ~22% du brut
  // TVA
  tva_standard: 0.20, // 20%
  tva_reduit: 0.10, // 10%
  // IS - Impôt sur les Sociétés
  is_standard: 0.25, // 25%
  is_pme: 0.15, // 15% sur les premiers 42 500€
  // Auto-entrepreneur
  ae_charges: 0.22, // Versement libératoire moyen
} as const;

// Sector modifiers
export const SECTOR_MODIFIERS = {
  tech: {
    marginMultiplier: 1.4,
    salaryMultiplier: 1.5,
    innovationSpeed: 1.3,
    clientLoyalty: 0.7,
  },
  artisanat: {
    marginMultiplier: 0.8,
    salaryMultiplier: 0.9,
    innovationSpeed: 0.6,
    clientLoyalty: 1.4,
  },
  services: {
    marginMultiplier: 1.1,
    salaryMultiplier: 1.0,
    innovationSpeed: 1.0,
    clientLoyalty: 1.0,
  },
  industrie: {
    marginMultiplier: 1.0,
    salaryMultiplier: 1.1,
    innovationSpeed: 0.8,
    clientLoyalty: 1.2,
  },
} as const;

// Legal status modifiers
export const LEGAL_STATUS_MODIFIERS = {
  'auto-entrepreneur': {
    maxRevenue: 77700,
    taxSimplicity: 1.5, // Easier
    flexibility: 0.5, // Limited
    credibilityBonus: -10,
  },
  sarl: {
    maxRevenue: Infinity,
    taxSimplicity: 1.0,
    flexibility: 1.0,
    credibilityBonus: 0,
  },
  sas: {
    maxRevenue: Infinity,
    taxSimplicity: 0.8, // More complex
    flexibility: 1.3, // More flexible
    credibilityBonus: 10,
  },
} as const;
