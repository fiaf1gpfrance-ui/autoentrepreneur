// Types for investors and funding system

export type InvestorType = 'angel' | 'vc_seed' | 'vc_series_a' | 'vc_series_b' | 'vc_growth' | 'corporate' | 'crowdfunding' | 'bank';

export interface Investor {
  id: string;
  name: string;
  type: InvestorType;
  avatar: string;
  investmentRange: { min: number; max: number };
  equityExpected: { min: number; max: number };
  focus: string[]; // sectors they invest in
  reputation: number;
  strictness: number; // 1-10 how demanding
  networkValue: number; // value of their network
  requirements: InvestorRequirement[];
  unlocked: boolean;
}

export interface InvestorRequirement {
  type: 'revenue' | 'employees' | 'growth' | 'product' | 'traction' | 'team';
  minValue: number;
  description: string;
}

export interface FundingRound {
  id: string;
  type: 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'series_c' | 'ipo';
  amount: number;
  equityGiven: number;
  valuation: number;
  investors: string[]; // investor IDs
  date: number; // game day
  terms: FundingTerms;
  closed: boolean;
}

export interface FundingTerms {
  boardSeat: boolean;
  vetoRights: boolean;
  antiDilution: boolean;
  liquidationPreference: number; // 1x, 2x etc
  reportingRequirements: 'minimal' | 'standard' | 'strict';
}

export interface Valuation {
  preMoneyValuation: number;
  postMoneyValuation: number;
  method: 'dcf' | 'multiples' | 'comparable' | 'venture';
  factors: ValuationFactor[];
  date: number;
}

export interface ValuationFactor {
  name: string;
  impact: number; // percentage impact on valuation
  positive: boolean;
}

export interface Dividend {
  id: string;
  year: number;
  totalAmount: number;
  perShareAmount: number;
  paymentDate: number;
  approved: boolean;
}

export interface Shareholder {
  id: string;
  name: string;
  type: 'founder' | 'cofounder' | 'investor' | 'employee' | 'other';
  shares: number;
  percentage: number;
  votingRights: number;
  entryDate: number;
  entryPrice: number;
}

// Pre-defined investor templates
export const INVESTOR_TEMPLATES: Omit<Investor, 'id' | 'unlocked'>[] = [
  {
    name: 'Michel Dubois - Business Angel',
    type: 'angel',
    avatar: '👴',
    investmentRange: { min: 10000, max: 100000 },
    equityExpected: { min: 5, max: 15 },
    focus: ['tech', 'services'],
    reputation: 60,
    strictness: 3,
    networkValue: 40,
    requirements: [{ type: 'product', minValue: 1, description: 'Au moins un produit lancé' }],
  },
  {
    name: 'Sophie Martin - Angel Tech',
    type: 'angel',
    avatar: '👩‍💼',
    investmentRange: { min: 25000, max: 150000 },
    equityExpected: { min: 8, max: 20 },
    focus: ['tech'],
    reputation: 70,
    strictness: 5,
    networkValue: 60,
    requirements: [
      { type: 'revenue', minValue: 50000, description: 'CA > 50k€' },
      { type: 'employees', minValue: 3, description: '3+ employés' },
    ],
  },
  {
    name: 'Seed Capital Partners',
    type: 'vc_seed',
    avatar: '🏦',
    investmentRange: { min: 100000, max: 500000 },
    equityExpected: { min: 10, max: 25 },
    focus: ['tech', 'industrie'],
    reputation: 80,
    strictness: 7,
    networkValue: 75,
    requirements: [
      { type: 'revenue', minValue: 100000, description: 'CA > 100k€' },
      { type: 'growth', minValue: 50, description: 'Croissance > 50%' },
      { type: 'team', minValue: 5, description: '5+ employés' },
    ],
  },
  {
    name: 'Growth Ventures',
    type: 'vc_series_a',
    avatar: '🚀',
    investmentRange: { min: 500000, max: 3000000 },
    equityExpected: { min: 15, max: 30 },
    focus: ['tech', 'services', 'industrie'],
    reputation: 90,
    strictness: 8,
    networkValue: 90,
    requirements: [
      { type: 'revenue', minValue: 500000, description: 'CA > 500k€' },
      { type: 'growth', minValue: 100, description: 'Croissance > 100%' },
      { type: 'employees', minValue: 15, description: '15+ employés' },
      { type: 'traction', minValue: 1000, description: '1000+ clients' },
    ],
  },
  {
    name: 'TechCorp Strategic',
    type: 'corporate',
    avatar: '🏢',
    investmentRange: { min: 1000000, max: 10000000 },
    equityExpected: { min: 10, max: 40 },
    focus: ['tech'],
    reputation: 85,
    strictness: 9,
    networkValue: 95,
    requirements: [
      { type: 'revenue', minValue: 1000000, description: 'CA > 1M€' },
      { type: 'product', minValue: 3, description: '3+ produits' },
    ],
  },
  {
    name: 'FranceCrowd',
    type: 'crowdfunding',
    avatar: '👥',
    investmentRange: { min: 10000, max: 1000000 },
    equityExpected: { min: 5, max: 20 },
    focus: ['tech', 'artisanat', 'services', 'industrie'],
    reputation: 50,
    strictness: 2,
    networkValue: 30,
    requirements: [{ type: 'product', minValue: 1, description: 'Produit existant' }],
  },
];

export const FUNDING_ROUND_CONFIGS = {
  pre_seed: { name: 'Pré-Seed', typicalAmount: { min: 50000, max: 300000 }, typicalEquity: { min: 5, max: 15 } },
  seed: { name: 'Seed', typicalAmount: { min: 200000, max: 2000000 }, typicalEquity: { min: 10, max: 25 } },
  series_a: { name: 'Série A', typicalAmount: { min: 2000000, max: 15000000 }, typicalEquity: { min: 15, max: 30 } },
  series_b: { name: 'Série B', typicalAmount: { min: 10000000, max: 50000000 }, typicalEquity: { min: 15, max: 25 } },
  series_c: { name: 'Série C', typicalAmount: { min: 30000000, max: 100000000 }, typicalEquity: { min: 10, max: 20 } },
  ipo: { name: 'Introduction en Bourse', typicalAmount: { min: 50000000, max: 1000000000 }, typicalEquity: { min: 10, max: 30 } },
};
