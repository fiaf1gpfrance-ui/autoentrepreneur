// Advanced Commercial Engine - Ultra-Realistic Sales & CRM Management
import { Company, Client, ClientContract, Product, Competitor } from '@/types/game';

// ==================== CRM ====================

export interface CRMContact {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  decisionMaker: boolean;
  influencer: boolean;
  relationship: number; // 0-100
  lastContact: number;
  preferences: string[];
  notes: ContactNote[];
  activities: ContactActivity[];
}

export interface ContactNote {
  id: string;
  date: number;
  author: string;
  content: string;
  type: 'meeting' | 'call' | 'email' | 'note' | 'important';
}

export interface ContactActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'negotiation' | 'follow_up';
  date: number;
  duration: number; // minutes
  outcome: string;
  nextAction?: string;
  nextActionDate?: number;
}

// ==================== SALES PIPELINE ====================

export interface SalesPipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  opportunities: Opportunity[];
  metrics: PipelineMetrics;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number; // % chance to close
  avgDaysInStage: number;
  requiredActivities: string[];
  autoActions?: string[];
}

export interface Opportunity {
  id: string;
  name: string;
  clientId: string;
  contactIds: string[];
  value: number;
  currency: string;
  products: OpportunityProduct[];
  stage: string;
  probability: number;
  expectedCloseDate: number;
  createdDate: number;
  lastActivityDate: number;
  source: LeadSource;
  salesRepId: string;
  competitors: string[];
  lostReason?: string;
  wonReason?: string;
  notes: string;
  activities: OpportunityActivity[];
  documents: OpportunityDocument[];
}

export interface OpportunityProduct {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface OpportunityActivity {
  id: string;
  type: string;
  date: number;
  description: string;
  outcome: string;
  nextStep?: string;
}

export interface OpportunityDocument {
  id: string;
  name: string;
  type: 'proposal' | 'quote' | 'contract' | 'presentation' | 'other';
  version: number;
  createdDate: number;
  sentDate?: number;
  signedDate?: number;
}

export interface PipelineMetrics {
  totalValue: number;
  weightedValue: number;
  opportunityCount: number;
  avgDealSize: number;
  winRate: number;
  avgSalesCycle: number; // days
  conversionRates: { stage: string; rate: number }[];
}

export type LeadSource = 'website' | 'referral' | 'cold_call' | 'trade_show' | 'advertising' | 'social_media' | 'partner' | 'other';

// ==================== QUOTATIONS & PROPOSALS ====================

export interface Quote {
  id: string;
  opportunityId: string;
  clientId: string;
  version: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  createdDate: number;
  validUntil: number;
  items: QuoteItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  terms: string;
  notes: string;
  signature?: {
    signedBy: string;
    signedDate: number;
    ipAddress: string;
  };
}

export interface QuoteItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Proposal {
  id: string;
  opportunityId: string;
  clientId: string;
  title: string;
  version: number;
  status: 'draft' | 'review' | 'sent' | 'won' | 'lost';
  createdDate: number;
  sentDate?: number;
  sections: ProposalSection[];
  pricing: Quote;
  teamMembers: string[];
  competitors: string[];
  winProbability: number;
  differentiators: string[];
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'cover' | 'executive_summary' | 'solution' | 'pricing' | 'timeline' | 'team' | 'references' | 'terms';
}

// ==================== TERRITORY & ACCOUNT MANAGEMENT ====================

export interface SalesTerritory {
  id: string;
  name: string;
  type: 'geographic' | 'industry' | 'account_size' | 'product';
  criteria: TerritoryCriteria;
  salesRepId: string;
  accounts: string[]; // client IDs
  quota: number;
  ytdRevenue: number;
  opportunities: string[];
  performance: TerritoryPerformance;
}

export interface TerritoryCriteria {
  regions?: string[];
  industries?: string[];
  minRevenue?: number;
  maxRevenue?: number;
  products?: string[];
}

export interface TerritoryPerformance {
  revenue: number;
  quota: number;
  quotaAttainment: number;
  newAccounts: number;
  lostAccounts: number;
  activeOpportunities: number;
  closedWon: number;
  closedLost: number;
  avgDealSize: number;
}

export interface AccountPlan {
  id: string;
  clientId: string;
  year: number;
  objectives: AccountObjective[];
  swot: SWOT;
  stakeholderMap: Stakeholder[];
  growthStrategy: string;
  riskAssessment: Risk[];
  actionPlan: AccountAction[];
  budget: number;
  expectedRevenue: number;
}

export interface AccountObjective {
  id: string;
  name: string;
  target: number;
  current: number;
  metric: string;
  deadline: number;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Stakeholder {
  contactId: string;
  role: 'champion' | 'decision_maker' | 'influencer' | 'blocker' | 'end_user';
  sentiment: 'positive' | 'neutral' | 'negative';
  influence: number; // 0-100
  engagement: string;
}

export interface Risk {
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface AccountAction {
  id: string;
  description: string;
  owner: string;
  deadline: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 1 | 2 | 3 | 4 | 5;
}

// ==================== COMPETITIVE INTELLIGENCE ====================

export interface CompetitorProfile {
  competitorId: string;
  lastUpdated: number;
  overview: {
    employees: number;
    revenue: number;
    founded: number;
    headquarters: string;
  };
  products: CompetitorProductInfo[];
  pricing: {
    strategy: 'premium' | 'value' | 'penetration' | 'skimming';
    priceVsUs: number; // -1 to 1 (cheaper to more expensive)
  };
  strengths: string[];
  weaknesses: string[];
  winRate: { vsUs: number; overall: number };
  recentWins: string[];
  recentLosses: string[];
  marketShare: number;
  trends: { direction: 'up' | 'down' | 'stable'; momentum: number };
  battleCards: BattleCard[];
}

export interface CompetitorProductInfo {
  name: string;
  category: string;
  features: string[];
  pricing: number;
  vsOurProduct: string;
}

export interface BattleCard {
  id: string;
  scenario: string;
  theirPitch: string;
  ourResponse: string;
  proofPoints: string[];
  objectionHandlers: { objection: string; response: string }[];
}

// ==================== SALES FORECASTING ====================

export interface SalesForecast {
  id: string;
  period: { start: number; end: number };
  type: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  scenarios: ForecastScenario[];
  accuracy: number;
  lastUpdated: number;
}

export interface ForecastScenario {
  name: 'best_case' | 'commit' | 'expected' | 'worst_case';
  value: number;
  opportunities: { id: string; value: number; probability: number }[];
  assumptions: string[];
}

export interface SalesTarget {
  id: string;
  type: 'revenue' | 'units' | 'new_customers' | 'retention' | 'margin';
  period: { start: number; end: number };
  target: number;
  actual: number;
  attainment: number;
  breakdown: { category: string; target: number; actual: number }[];
}

// ==================== PRICING STRATEGY ====================

export interface PricingStrategy {
  id: string;
  productId: string;
  basePrice: number;
  currency: string;
  model: 'fixed' | 'tiered' | 'usage' | 'subscription' | 'dynamic';
  tiers?: PricingTier[];
  discountRules: DiscountRule[];
  competitorAdjustment: number; // -1 to 1
  volumeDiscounts: { minQuantity: number; discount: number }[];
  promotions: Promotion[];
}

export interface PricingTier {
  name: string;
  minQuantity: number;
  maxQuantity: number;
  pricePerUnit: number;
}

export interface DiscountRule {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y';
  value: number;
  conditions: {
    minQuantity?: number;
    customerType?: string[];
    products?: string[];
    validFrom?: number;
    validTo?: number;
  };
  approvalRequired: boolean;
  maxDiscount: number;
}

export interface Promotion {
  id: string;
  name: string;
  type: 'discount' | 'bundle' | 'freebie' | 'cashback';
  value: number;
  startDate: number;
  endDate: number;
  conditions: string[];
  budget: number;
  spent: number;
  conversions: number;
  roi: number;
}

// ==================== ENGINE FUNCTIONS ====================

export function calculatePipelineMetrics(opportunities: Opportunity[], stages: PipelineStage[]): PipelineMetrics {
  const totalValue = opportunities.reduce((sum, o) => sum + o.value, 0);
  const weightedValue = opportunities.reduce((sum, o) => sum + o.value * (o.probability / 100), 0);
  const opportunityCount = opportunities.length;
  const avgDealSize = opportunityCount > 0 ? totalValue / opportunityCount : 0;
  
  const wonOpps = opportunities.filter(o => o.stage === 'won');
  const lostOpps = opportunities.filter(o => o.stage === 'lost');
  const closedOpps = wonOpps.length + lostOpps.length;
  const winRate = closedOpps > 0 ? (wonOpps.length / closedOpps) * 100 : 0;
  
  const avgSalesCycle = wonOpps.length > 0
    ? wonOpps.reduce((sum, o) => sum + (o.expectedCloseDate - o.createdDate), 0) / wonOpps.length / (24 * 60 * 60 * 1000)
    : 30;
  
  const conversionRates = stages.map((stage, index) => {
    if (index === 0) return { stage: stage.name, rate: 100 };
    const inThisStage = opportunities.filter(o => stages.findIndex(s => s.id === o.stage) >= index).length;
    const inPrevStage = opportunities.filter(o => stages.findIndex(s => s.id === o.stage) >= index - 1).length;
    return { stage: stage.name, rate: inPrevStage > 0 ? (inThisStage / inPrevStage) * 100 : 0 };
  });
  
  return {
    totalValue,
    weightedValue,
    opportunityCount,
    avgDealSize,
    winRate,
    avgSalesCycle,
    conversionRates
  };
}

export function generateSalesForecast(
  opportunities: Opportunity[],
  historicalData: { period: number; revenue: number }[],
  period: { start: number; end: number }
): SalesForecast {
  const activeOpps = opportunities.filter(o => 
    o.expectedCloseDate >= period.start && 
    o.expectedCloseDate <= period.end &&
    o.stage !== 'lost' && o.stage !== 'won'
  );
  
  const scenarios: ForecastScenario[] = [
    {
      name: 'best_case',
      value: activeOpps.reduce((sum, o) => sum + o.value, 0),
      opportunities: activeOpps.map(o => ({ id: o.id, value: o.value, probability: 100 })),
      assumptions: ['Tous les deals en cours sont gagnés']
    },
    {
      name: 'expected',
      value: activeOpps.reduce((sum, o) => sum + o.value * (o.probability / 100), 0),
      opportunities: activeOpps.map(o => ({ id: o.id, value: o.value, probability: o.probability })),
      assumptions: ['Basé sur les probabilités actuelles']
    },
    {
      name: 'commit',
      value: activeOpps.filter(o => o.probability >= 75).reduce((sum, o) => sum + o.value, 0),
      opportunities: activeOpps.filter(o => o.probability >= 75).map(o => ({ id: o.id, value: o.value, probability: o.probability })),
      assumptions: ['Uniquement les deals à 75%+ de probabilité']
    },
    {
      name: 'worst_case',
      value: activeOpps.filter(o => o.probability >= 90).reduce((sum, o) => sum + o.value * 0.8, 0),
      opportunities: activeOpps.filter(o => o.probability >= 90).map(o => ({ id: o.id, value: o.value * 0.8, probability: o.probability })),
      assumptions: ['Uniquement les deals quasi-certains avec marge de sécurité']
    }
  ];
  
  return {
    id: `forecast_${Date.now()}`,
    period,
    type: 'monthly',
    scenarios,
    accuracy: 75,
    lastUpdated: Date.now()
  };
}

export function calculateQuotaAttainment(
  target: number,
  actual: number,
  period: { start: number; end: number }
): { attainment: number; pace: number; projection: number; status: 'ahead' | 'on_track' | 'behind' | 'critical' } {
  const now = Date.now();
  const totalDays = (period.end - period.start) / (24 * 60 * 60 * 1000);
  const elapsedDays = Math.min((now - period.start) / (24 * 60 * 60 * 1000), totalDays);
  const remainingDays = totalDays - elapsedDays;
  
  const attainment = (actual / target) * 100;
  const expectedProgress = (elapsedDays / totalDays) * 100;
  const pace = expectedProgress > 0 ? attainment / expectedProgress : 0;
  const dailyRate = elapsedDays > 0 ? actual / elapsedDays : 0;
  const projection = actual + dailyRate * remainingDays;
  
  let status: 'ahead' | 'on_track' | 'behind' | 'critical';
  if (pace >= 1.1) status = 'ahead';
  else if (pace >= 0.9) status = 'on_track';
  else if (pace >= 0.7) status = 'behind';
  else status = 'critical';
  
  return { attainment, pace, projection, status };
}

export function scoreOpportunity(opp: Opportunity, client: Client, competitors: Competitor[]): {
  score: number;
  factors: { factor: string; score: number; weight: number }[];
  recommendation: string;
} {
  const factors: { factor: string; score: number; weight: number }[] = [
    { factor: 'Taille du deal', score: Math.min(opp.value / 100000, 1) * 100, weight: 0.15 },
    { factor: 'Relation client', score: client.relationshipScore, weight: 0.20 },
    { factor: 'Solvabilité client', score: client.creditRating, weight: 0.10 },
    { factor: 'Probabilité de closing', score: opp.probability, weight: 0.25 },
    { factor: 'Pression concurrentielle', score: Math.max(0, 100 - opp.competitors.length * 20), weight: 0.15 },
    { factor: 'Délai de décision', score: calculateTimeScore(opp.expectedCloseDate - Date.now()), weight: 0.15 },
  ];
  
  const score = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  
  let recommendation: string;
  if (score >= 80) recommendation = 'Priorité haute - Investir des ressources maximum';
  else if (score >= 60) recommendation = 'Priorité moyenne - Suivre activement';
  else if (score >= 40) recommendation = 'Priorité basse - Maintenir contact minimal';
  else recommendation = 'À reconsidérer - Évaluer si ça vaut le coût d\'opportunité';
  
  return { score, factors, recommendation };
}

function calculateTimeScore(daysToClose: number): number {
  const days = daysToClose / (24 * 60 * 60 * 1000);
  if (days <= 30) return 100;
  if (days <= 60) return 80;
  if (days <= 90) return 60;
  if (days <= 180) return 40;
  return 20;
}

export function generateBattleCard(competitor: Competitor, ourProducts: Product[]): BattleCard {
  const scenarios = [
    'Prix plus bas',
    'Fonctionnalités manquantes',
    'Références clients',
    'Support technique',
    'Délais de livraison'
  ];
  
  return {
    id: `bc_${competitor.id}_${Date.now()}`,
    scenario: scenarios[Math.floor(Math.random() * scenarios.length)],
    theirPitch: `${competitor.name} propose souvent des prix agressifs et met en avant leur notoriété.`,
    ourResponse: 'Nous nous différencions par la qualité, le support personnalisé et le ROI prouvé.',
    proofPoints: [
      'Satisfaction client de 95%',
      'ROI moyen de 3x en 12 mois',
      'Support 24/7 inclus',
      `Plus de ${ourProducts.length} solutions complémentaires`
    ],
    objectionHandlers: [
      { objection: 'C\'est trop cher', response: 'Analysons ensemble le TCO sur 3 ans et le ROI attendu.' },
      { objection: 'Vous êtes trop petits', response: 'Notre taille nous permet d\'être agiles et de vous offrir un service personnalisé.' },
      { objection: 'On travaille déjà avec X', response: 'Nous pouvons coexister ou migrer progressivement. Commençons par un pilote.' }
    ]
  };
}

export function analyzeCustomerLifetimeValue(
  client: Client,
  contracts: ClientContract[],
  years: number = 5
): {
  ltv: number;
  avgAnnualValue: number;
  churnRisk: number;
  growthPotential: number;
  recommendations: string[];
} {
  const totalRevenue = client.totalRevenue;
  const avgAnnualValue = totalRevenue / Math.max(1, contracts.length);
  const activeContracts = contracts.filter(c => c.status === 'active');
  
  // Estimate future value
  const retentionRate = client.relationshipScore / 100;
  let ltv = 0;
  let projectedAnnual = avgAnnualValue;
  
  for (let y = 0; y < years; y++) {
    ltv += projectedAnnual * Math.pow(retentionRate, y);
    projectedAnnual *= 1.05; // 5% annual growth assumption
  }
  
  const churnRisk = 100 - client.relationshipScore;
  const growthPotential = calculateGrowthPotential(client, activeContracts);
  
  const recommendations: string[] = [];
  if (churnRisk > 30) recommendations.push('Planifier un business review trimestriel');
  if (growthPotential > 50) recommendations.push('Proposer des produits complémentaires');
  if (activeContracts.length === 1) recommendations.push('Diversifier les produits vendus');
  if (client.paymentDelay > 45) recommendations.push('Négocier des conditions de paiement');
  
  return { ltv, avgAnnualValue, churnRisk, growthPotential, recommendations };
}

function calculateGrowthPotential(client: Client, contracts: ClientContract[]): number {
  const baseScore = 50;
  let score = baseScore;
  
  if (client.type === 'grand_compte') score += 20;
  else if (client.type === 'pme') score += 10;
  
  if (contracts.length < 3) score += 15;
  if (client.relationshipScore > 70) score += 15;
  
  return Math.min(100, score);
}

export function calculateSalesVelocity(opportunities: Opportunity[]): {
  velocity: number;
  components: { metric: string; value: number; trend: number }[];
} {
  const wonOpps = opportunities.filter(o => o.stage === 'won');
  const allClosed = opportunities.filter(o => o.stage === 'won' || o.stage === 'lost');
  
  const numberOfOpps = opportunities.length;
  const avgDealValue = wonOpps.reduce((sum, o) => sum + o.value, 0) / Math.max(1, wonOpps.length);
  const winRate = allClosed.length > 0 ? wonOpps.length / allClosed.length : 0;
  const avgSalesCycle = wonOpps.length > 0
    ? wonOpps.reduce((sum, o) => sum + (o.expectedCloseDate - o.createdDate), 0) / wonOpps.length / (24 * 60 * 60 * 1000)
    : 30;
  
  // Sales Velocity = (Opportunities × Win Rate × Avg Deal Value) / Sales Cycle
  const velocity = avgSalesCycle > 0 
    ? (numberOfOpps * winRate * avgDealValue) / avgSalesCycle 
    : 0;
  
  return {
    velocity,
    components: [
      { metric: 'Nombre d\'opportunités', value: numberOfOpps, trend: 5 },
      { metric: 'Taux de conversion', value: winRate * 100, trend: 2 },
      { metric: 'Valeur moyenne', value: avgDealValue, trend: 3 },
      { metric: 'Cycle de vente (jours)', value: avgSalesCycle, trend: -2 }
    ]
  };
}

export function prioritizeLeads(
  opportunities: Opportunity[],
  clients: Client[]
): { opportunityId: string; priority: number; actions: string[] }[] {
  return opportunities.map(opp => {
    const client = clients.find(c => c.id === opp.clientId);
    let priority = 0;
    const actions: string[] = [];
    
    // Value factor
    if (opp.value > 100000) { priority += 30; actions.push('Impliquer la direction'); }
    else if (opp.value > 50000) { priority += 20; }
    else { priority += 10; }
    
    // Probability factor
    priority += opp.probability * 0.3;
    
    // Urgency factor
    const daysToClose = (opp.expectedCloseDate - Date.now()) / (24 * 60 * 60 * 1000);
    if (daysToClose < 14) { priority += 25; actions.push('Action urgente requise'); }
    else if (daysToClose < 30) { priority += 15; }
    
    // Client relationship
    if (client && client.relationshipScore > 70) { priority += 10; }
    if (client && client.relationshipScore < 40) { actions.push('Renforcer la relation client'); }
    
    // Last activity
    const daysSinceActivity = (Date.now() - opp.lastActivityDate) / (24 * 60 * 60 * 1000);
    if (daysSinceActivity > 14) { priority -= 10; actions.push('Relancer - pas d\'activité récente'); }
    
    return { opportunityId: opp.id, priority, actions };
  }).sort((a, b) => b.priority - a.priority);
}
