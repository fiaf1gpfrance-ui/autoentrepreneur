import { 
  Lead, 
  LeadSource, 
  LeadStatus, 
  Deal, 
  DealStage, 
  Quote, 
  QuoteItem,
  SalesTarget,
  CustomerFeedback,
  SalesPipeline,
  DealActivity,
} from '@/types/advancedSystems';

// Lead generation engine
export const LEAD_SOURCES: Record<LeadSource, { cost: number; quality: number; volume: number }> = {
  website: { cost: 50, quality: 60, volume: 20 },
  referral: { cost: 0, quality: 90, volume: 5 },
  cold_call: { cost: 100, quality: 30, volume: 30 },
  trade_show: { cost: 5000, quality: 75, volume: 50 },
  social_media: { cost: 200, quality: 50, volume: 40 },
  advertising: { cost: 1000, quality: 55, volume: 60 },
  partnership: { cost: 500, quality: 80, volume: 15 },
};

export const STAGE_PROBABILITIES: Record<DealStage, number> = {
  prospecting: 10,
  qualification: 20,
  needs_analysis: 40,
  proposal: 60,
  negotiation: 80,
  closing: 90,
  won: 100,
  lost: 0,
};

export function generateLead(source: LeadSource, currentDay: number): Lead {
  const sourceConfig = LEAD_SOURCES[source];
  const quality = sourceConfig.quality + (Math.random() - 0.5) * 30;
  
  const companyNames = [
    'TechCorp', 'Innovation Labs', 'Digital Solutions', 'Global Industries',
    'Smart Systems', 'Future Tech', 'Cloud Dynamics', 'Data Driven Co',
    'NextGen Solutions', 'Prime Industries', 'Elite Services', 'Alpha Consulting',
  ];
  
  const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Nicolas', 'Julie', 'Thomas', 'Emma'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];
  
  return {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    companyName: `${companyName} ${Math.floor(Math.random() * 1000)}`,
    contactName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: `+33 ${Math.floor(Math.random() * 900000000) + 100000000}`,
    source,
    status: 'new',
    score: Math.min(100, Math.max(1, Math.floor(quality))),
    estimatedValue: Math.floor(5000 + Math.random() * 95000),
    createdAt: currentDay,
    lastContactAt: currentDay,
    notes: [],
  };
}

export function qualifyLead(lead: Lead, skills: number): { qualified: boolean; score: number } {
  const baseChance = lead.score / 100;
  const skillBonus = skills / 200;
  const qualified = Math.random() < (baseChance + skillBonus);
  
  return {
    qualified,
    score: qualified ? Math.min(100, lead.score + 10) : lead.score,
  };
}

export function createDealFromLead(lead: Lead, currentDay: number): Deal {
  return {
    id: `deal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    leadId: lead.id,
    name: `Opportunité ${lead.companyName}`,
    value: lead.estimatedValue,
    stage: 'prospecting',
    probability: STAGE_PROBABILITIES.prospecting,
    expectedCloseDate: currentDay + 30 + Math.floor(Math.random() * 60),
    createdAt: currentDay,
    products: [],
    competitors: [],
    notes: [],
    activities: [],
  };
}

export function advanceDealStage(deal: Deal, success: boolean): Deal {
  const stages: DealStage[] = ['prospecting', 'qualification', 'needs_analysis', 'proposal', 'negotiation', 'closing', 'won'];
  const currentIndex = stages.indexOf(deal.stage);
  
  if (!success) {
    return { ...deal, stage: 'lost', probability: 0 };
  }
  
  if (currentIndex < stages.length - 1) {
    const newStage = stages[currentIndex + 1];
    return {
      ...deal,
      stage: newStage,
      probability: STAGE_PROBABILITIES[newStage],
    };
  }
  
  return deal;
}

export function addDealActivity(deal: Deal, activity: Omit<DealActivity, 'id'>): Deal {
  return {
    ...deal,
    activities: [
      ...deal.activities,
      {
        ...activity,
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    ],
  };
}

export function createQuote(
  clientId: string,
  items: Omit<QuoteItem, 'discount'>[],
  discount: number,
  discountType: 'percentage' | 'fixed',
  currentDay: number
): Quote {
  const itemsWithDiscount = items.map(item => ({
    ...item,
    discount: 0,
  }));
  
  const subtotal = itemsWithDiscount.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = discountType === 'percentage' ? subtotal * (discount / 100) : discount;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.20;
  const total = taxableAmount + tax;
  
  return {
    id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    clientId,
    items: itemsWithDiscount,
    subtotal,
    discount,
    discountType,
    tax,
    total,
    validUntil: currentDay + 30,
    status: 'draft',
    createdAt: currentDay,
  };
}

export function createSalesTarget(
  employeeId: string | undefined,
  type: SalesTarget['type'],
  period: SalesTarget['period'],
  target: number,
  currentDay: number,
  bonus?: number
): SalesTarget {
  const periodDays = period === 'monthly' ? 30 : period === 'quarterly' ? 90 : 365;
  
  return {
    id: `target_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    employeeId,
    type,
    period,
    target,
    current: 0,
    startDate: currentDay,
    endDate: currentDay + periodDays,
    bonus,
  };
}

export function recordFeedback(
  clientId: string,
  type: CustomerFeedback['type'],
  score: number | undefined,
  comment: string,
  currentDay: number
): CustomerFeedback {
  return {
    id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    clientId,
    type,
    score,
    comment,
    date: currentDay,
    resolved: false,
  };
}

export function calculatePipelineMetrics(pipeline: SalesPipeline): {
  totalValue: number;
  weightedValue: number;
  avgDealSize: number;
  stageBreakdown: Record<DealStage, number>;
} {
  const activeDeals = pipeline.deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
  
  const totalValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = activeDeals.reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);
  const avgDealSize = activeDeals.length > 0 ? totalValue / activeDeals.length : 0;
  
  const stageBreakdown: Record<DealStage, number> = {
    prospecting: 0,
    qualification: 0,
    needs_analysis: 0,
    proposal: 0,
    negotiation: 0,
    closing: 0,
    won: 0,
    lost: 0,
  };
  
  pipeline.deals.forEach(deal => {
    stageBreakdown[deal.stage] += deal.value;
  });
  
  return { totalValue, weightedValue, avgDealSize, stageBreakdown };
}

export function generateLeadBatch(
  source: LeadSource,
  budget: number,
  currentDay: number
): { leads: Lead[]; cost: number } {
  const sourceConfig = LEAD_SOURCES[source];
  const maxLeads = Math.floor(budget / sourceConfig.cost);
  const actualLeads = Math.min(maxLeads, sourceConfig.volume);
  
  const leads: Lead[] = [];
  for (let i = 0; i < actualLeads; i++) {
    leads.push(generateLead(source, currentDay));
  }
  
  return {
    leads,
    cost: actualLeads * sourceConfig.cost,
  };
}

export function calculateNPS(feedback: CustomerFeedback[]): number {
  const npsResponses = feedback.filter(f => f.type === 'nps' && f.score !== undefined);
  if (npsResponses.length === 0) return 0;
  
  const promoters = npsResponses.filter(f => f.score! >= 9).length;
  const detractors = npsResponses.filter(f => f.score! <= 6).length;
  
  return Math.round(((promoters - detractors) / npsResponses.length) * 100);
}

export function calculateCSAT(feedback: CustomerFeedback[]): number {
  const csatResponses = feedback.filter(f => f.type === 'csat' && f.score !== undefined);
  if (csatResponses.length === 0) return 0;
  
  const satisfied = csatResponses.filter(f => f.score! >= 4).length;
  return Math.round((satisfied / csatResponses.length) * 100);
}
