// Marketing & Commercial Engine - 60+ marketing features
import { Company, Product, Client, Competitor } from '@/types/game';

// ==================== CAMPAIGN TYPES ====================
export type CampaignType = 
  | 'affichage' | 'radio' | 'tv' | 'presse' | 'digital' 
  | 'influencer' | 'evenement' | 'sponsoring' | 'email' 
  | 'sms' | 'social_media' | 'seo' | 'sea' | 'content' 
  | 'guerrilla' | 'viral' | 'partenariat' | 'fidelite'
  | 'referral' | 'retargeting';

export type CampaignStatus = 'planification' | 'en_cours' | 'terminee' | 'annulee';
export type TargetAudience = 'b2b' | 'b2c' | 'premium' | 'mass_market' | 'niche' | 'international';

export interface MarketingCampaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  budget: number;
  spentBudget: number;
  startDate: number;
  endDate: number;
  targetAudience: TargetAudience;
  targetProduct?: string;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  creativityScore: number;
  kpis: CampaignKPI[];
}

export interface CampaignKPI {
  name: string;
  target: number;
  current: number;
  unit: string;
}

// ==================== SALES FEATURES ====================
export type SalesPipelineStage = 'prospect' | 'qualification' | 'proposition' | 'negociation' | 'closing' | 'won' | 'lost';

export interface SalesOpportunity {
  id: string;
  clientName: string;
  value: number;
  probability: number;
  stage: SalesPipelineStage;
  assignedTo: string;
  createdDate: number;
  expectedCloseDate: number;
  productId: string;
  notes: string;
  activities: SalesActivity[];
}

export interface SalesActivity {
  id: string;
  type: 'appel' | 'email' | 'reunion' | 'demo' | 'proposition' | 'negociation';
  date: number;
  notes: string;
  outcome: 'positive' | 'neutral' | 'negative';
}

export interface SalesTarget {
  period: 'mensuel' | 'trimestriel' | 'annuel';
  target: number;
  achieved: number;
  salesPersonId?: string;
}

// ==================== BRAND & REPUTATION ====================
export interface BrandMetrics {
  awareness: number; // 0-100
  consideration: number; // 0-100
  preference: number; // 0-100
  loyalty: number; // 0-100
  advocacy: number; // 0-100
  sentiment: number; // -100 to 100
  mentions: number;
  mediaValue: number;
}

export interface PublicRelations {
  pressContacts: number;
  pressReleases: number;
  mediaAppearances: number;
  crisisEvents: number;
  influencerRelations: number;
  communityEngagement: number;
  csr_score: number;
}

// ==================== PRICING STRATEGIES ====================
export type PricingStrategy = 
  | 'penetration' | 'ecremage' | 'alignement' | 'valeur' 
  | 'psychologique' | 'bundle' | 'freemium' | 'abonnement'
  | 'dynamique' | 'premium' | 'low_cost' | 'gratuite';

export interface PricingModel {
  strategy: PricingStrategy;
  basePrice: number;
  discount: number;
  seasonalMultiplier: number;
  competitorIndex: number;
  elasticity: number;
  optimalPrice: number;
}

// ==================== CAMPAIGN COSTS & EFFECTS ====================
export const CAMPAIGN_COSTS: Record<CampaignType, { minBudget: number; reachPerEuro: number; conversionRate: number; duration: number }> = {
  affichage: { minBudget: 5000, reachPerEuro: 100, conversionRate: 0.001, duration: 30 },
  radio: { minBudget: 10000, reachPerEuro: 200, conversionRate: 0.002, duration: 14 },
  tv: { minBudget: 50000, reachPerEuro: 500, conversionRate: 0.003, duration: 7 },
  presse: { minBudget: 3000, reachPerEuro: 50, conversionRate: 0.005, duration: 30 },
  digital: { minBudget: 1000, reachPerEuro: 300, conversionRate: 0.01, duration: 30 },
  influencer: { minBudget: 2000, reachPerEuro: 400, conversionRate: 0.015, duration: 7 },
  evenement: { minBudget: 15000, reachPerEuro: 20, conversionRate: 0.05, duration: 3 },
  sponsoring: { minBudget: 20000, reachPerEuro: 150, conversionRate: 0.002, duration: 90 },
  email: { minBudget: 500, reachPerEuro: 1000, conversionRate: 0.02, duration: 7 },
  sms: { minBudget: 1000, reachPerEuro: 500, conversionRate: 0.03, duration: 3 },
  social_media: { minBudget: 500, reachPerEuro: 600, conversionRate: 0.008, duration: 30 },
  seo: { minBudget: 2000, reachPerEuro: 100, conversionRate: 0.02, duration: 180 },
  sea: { minBudget: 1000, reachPerEuro: 200, conversionRate: 0.025, duration: 30 },
  content: { minBudget: 1500, reachPerEuro: 80, conversionRate: 0.015, duration: 90 },
  guerrilla: { minBudget: 3000, reachPerEuro: 800, conversionRate: 0.01, duration: 7 },
  viral: { minBudget: 5000, reachPerEuro: 2000, conversionRate: 0.005, duration: 14 },
  partenariat: { minBudget: 10000, reachPerEuro: 150, conversionRate: 0.02, duration: 180 },
  fidelite: { minBudget: 5000, reachPerEuro: 50, conversionRate: 0.1, duration: 365 },
  referral: { minBudget: 2000, reachPerEuro: 100, conversionRate: 0.15, duration: 365 },
  retargeting: { minBudget: 1000, reachPerEuro: 400, conversionRate: 0.04, duration: 30 },
};

// ==================== MARKETING FUNCTIONS ====================

// Create a new campaign
export function createCampaign(
  name: string,
  type: CampaignType,
  budget: number,
  startDate: number,
  targetAudience: TargetAudience,
  targetProduct?: string
): MarketingCampaign {
  const config = CAMPAIGN_COSTS[type];
  return {
    id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    status: 'planification',
    budget: Math.max(budget, config.minBudget),
    spentBudget: 0,
    startDate,
    endDate: startDate + config.duration,
    targetAudience,
    targetProduct,
    reach: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    roi: 0,
    creativityScore: 50 + Math.floor(Math.random() * 30),
    kpis: [
      { name: 'Portée', target: budget * config.reachPerEuro, current: 0, unit: 'personnes' },
      { name: 'Conversions', target: Math.floor(budget * config.reachPerEuro * config.conversionRate), current: 0, unit: 'clients' },
      { name: 'ROI', target: 200, current: 0, unit: '%' },
    ],
  };
}

// Process daily campaign updates
export function processCampaignDay(campaign: MarketingCampaign, currentDay: number): MarketingCampaign {
  if (campaign.status !== 'en_cours') return campaign;
  if (currentDay > campaign.endDate) {
    return { ...campaign, status: 'terminee' };
  }

  const config = CAMPAIGN_COSTS[campaign.type];
  const dailyBudget = campaign.budget / config.duration;
  const dailyReach = dailyBudget * config.reachPerEuro * (campaign.creativityScore / 50);
  const dailyClicks = dailyReach * 0.02;
  const dailyConversions = dailyReach * config.conversionRate;

  const updated = {
    ...campaign,
    spentBudget: Math.min(campaign.budget, campaign.spentBudget + dailyBudget),
    reach: campaign.reach + dailyReach,
    impressions: campaign.impressions + dailyReach * 3,
    clicks: campaign.clicks + dailyClicks,
    conversions: campaign.conversions + dailyConversions,
  };

  // Calculate ROI
  const revenue = updated.conversions * 500; // Average revenue per conversion
  updated.roi = updated.spentBudget > 0 ? ((revenue - updated.spentBudget) / updated.spentBudget) * 100 : 0;

  // Update KPIs
  updated.kpis = updated.kpis.map(kpi => {
    if (kpi.name === 'Portée') return { ...kpi, current: updated.reach };
    if (kpi.name === 'Conversions') return { ...kpi, current: updated.conversions };
    if (kpi.name === 'ROI') return { ...kpi, current: updated.roi };
    return kpi;
  });

  return updated;
}

// Calculate brand metrics
export function calculateBrandMetrics(company: Company): BrandMetrics {
  const baseAwareness = Math.min(100, company.reputation * 0.8);
  const marketingEffect = company.products.reduce((sum, p) => sum + p.marketingBudget, 0) / 10000;
  
  return {
    awareness: Math.min(100, baseAwareness + marketingEffect * 5),
    consideration: Math.min(100, company.credibility * 0.7),
    preference: Math.min(100, company.marketShare * 2),
    loyalty: Math.min(100, company.clients.filter(c => c.contracts.length > 1).length * 2),
    advocacy: Math.min(100, company.reputation * 0.5),
    sentiment: Math.min(100, Math.max(-100, company.credibility - 50)),
    mentions: Math.floor(company.reputation * 100 + marketingEffect * 50),
    mediaValue: company.reputation * 1000 + marketingEffect * 500,
  };
}

// Create sales opportunity
export function createSalesOpportunity(
  clientName: string,
  value: number,
  productId: string,
  assignedTo: string,
  currentDay: number
): SalesOpportunity {
  return {
    id: `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    clientName,
    value,
    probability: 20,
    stage: 'prospect',
    assignedTo,
    createdDate: currentDay,
    expectedCloseDate: currentDay + 60,
    productId,
    notes: '',
    activities: [],
  };
}

// Advance sales opportunity
export function advanceSalesStage(opportunity: SalesOpportunity): SalesOpportunity {
  const stageProgression: Record<SalesPipelineStage, { next: SalesPipelineStage; probability: number }> = {
    prospect: { next: 'qualification', probability: 30 },
    qualification: { next: 'proposition', probability: 45 },
    proposition: { next: 'negociation', probability: 60 },
    negociation: { next: 'closing', probability: 75 },
    closing: { next: 'won', probability: 90 },
    won: { next: 'won', probability: 100 },
    lost: { next: 'lost', probability: 0 },
  };

  const { next, probability } = stageProgression[opportunity.stage];
  return { ...opportunity, stage: next, probability };
}

// Calculate optimal price
export function calculateOptimalPrice(product: Product, competitors: Competitor[]): PricingModel {
  const avgCompetitorPrice = competitors.reduce((sum, c) => {
    const competitorProduct = c.products.find(p => p.name.toLowerCase().includes(product.name.toLowerCase().split(' ')[0]));
    return sum + (competitorProduct?.price || product.basePrice);
  }, 0) / Math.max(1, competitors.length);

  const qualityPremium = (product.quality - 50) / 100;
  const elasticity = -1.5 + (product.quality / 100);

  return {
    strategy: product.quality > 80 ? 'premium' : product.quality < 40 ? 'low_cost' : 'valeur',
    basePrice: product.basePrice,
    discount: 0,
    seasonalMultiplier: 1,
    competitorIndex: avgCompetitorPrice > 0 ? product.currentPrice / avgCompetitorPrice : 1,
    elasticity,
    optimalPrice: avgCompetitorPrice * (1 + qualityPremium),
  };
}

// Calculate marketing ROI
export function calculateMarketingROI(campaigns: MarketingCampaign[]): number {
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spentBudget, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.conversions * 500, 0);
  return totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent) * 100 : 0;
}

// Generate campaign suggestions
export function suggestCampaigns(company: Company, budget: number): CampaignType[] {
  const suggestions: CampaignType[] = [];
  
  if (budget < 3000) {
    suggestions.push('email', 'social_media', 'sms');
  } else if (budget < 10000) {
    suggestions.push('digital', 'influencer', 'content', 'sea');
  } else if (budget < 50000) {
    suggestions.push('radio', 'evenement', 'partenariat', 'sponsoring');
  } else {
    suggestions.push('tv', 'viral', 'sponsoring');
  }
  
  // Add loyalty if many clients
  if (company.clients.length > 50) {
    suggestions.push('fidelite', 'referral');
  }
  
  return suggestions;
}

// Calculate customer lifetime value
export function calculateCLTV(client: Client): number {
  const avgContractValue = client.contracts.reduce((sum, c) => sum + c.value, 0) / Math.max(1, client.contracts.length);
  const avgContractDuration = client.contracts.reduce((sum, c) => sum + (c.endDate - c.startDate), 0) / Math.max(1, client.contracts.length) / 365;
  const retentionRate = client.relationshipScore / 100;
  
  return avgContractValue * avgContractDuration * retentionRate * 3;
}

// Segment clients
export function segmentClients(clients: Client[]): Record<string, Client[]> {
  return {
    vip: clients.filter(c => c.totalRevenue > 100000 && c.relationshipScore > 80),
    growth: clients.filter(c => c.totalRevenue > 10000 && c.totalRevenue <= 100000),
    standard: clients.filter(c => c.totalRevenue > 1000 && c.totalRevenue <= 10000),
    dormant: clients.filter(c => c.totalRevenue <= 1000 || c.relationshipScore < 30),
    atRisk: clients.filter(c => c.relationshipScore < 50 && c.totalRevenue > 10000),
  };
}

// Calculate Net Promoter Score
export function calculateNPS(clients: Client[]): number {
  const promoters = clients.filter(c => c.relationshipScore >= 80).length;
  const detractors = clients.filter(c => c.relationshipScore <= 40).length;
  return Math.round(((promoters - detractors) / Math.max(1, clients.length)) * 100);
}
