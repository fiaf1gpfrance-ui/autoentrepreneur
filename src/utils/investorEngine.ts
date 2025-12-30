// Engine for investors and funding system

import { Company, GameState } from '@/types/game';
import { 
  Investor, 
  InvestorType, 
  FundingRound, 
  FundingTerms, 
  Valuation, 
  Shareholder,
  Dividend,
  INVESTOR_TEMPLATES,
  FUNDING_ROUND_CONFIGS,
} from '@/types/investors';

// Initialize investors for a new game
export function initializeInvestors(company: Company): Investor[] {
  return INVESTOR_TEMPLATES.map((template, index) => ({
    ...template,
    id: `investor_${index}`,
    unlocked: template.type === 'angel' || template.type === 'crowdfunding',
  }));
}

// Calculate company valuation
export function calculateValuation(company: Company, state: GameState): Valuation {
  const baseRevenue = company.monthlyRevenue * 12;
  const profitMargin = (company.monthlyRevenue - company.monthlyExpenses) / Math.max(company.monthlyRevenue, 1);
  
  // Multiple based on sector and growth
  let multiple = 3;
  if (company.sector === 'tech') multiple = 8;
  else if (company.sector === 'services') multiple = 4;
  else if (company.sector === 'industrie') multiple = 3;
  else if (company.sector === 'artisanat') multiple = 2;
  
  // Adjust for company health
  const factors: Valuation['factors'] = [];
  
  // Revenue growth
  const revenueGrowth = calculateRevenueGrowth(company);
  if (revenueGrowth > 50) {
    multiple *= 1.5;
    factors.push({ name: 'Forte croissance', impact: 50, positive: true });
  } else if (revenueGrowth > 20) {
    multiple *= 1.2;
    factors.push({ name: 'Croissance saine', impact: 20, positive: true });
  } else if (revenueGrowth < 0) {
    multiple *= 0.7;
    factors.push({ name: 'Croissance négative', impact: -30, positive: false });
  }
  
  // Profitability
  if (profitMargin > 0.3) {
    multiple *= 1.3;
    factors.push({ name: 'Excellente rentabilité', impact: 30, positive: true });
  } else if (profitMargin > 0.1) {
    multiple *= 1.1;
    factors.push({ name: 'Rentable', impact: 10, positive: true });
  } else if (profitMargin < 0) {
    multiple *= 0.8;
    factors.push({ name: 'Non rentable', impact: -20, positive: false });
  }
  
  // Team size
  if (company.employees.length >= 50) {
    multiple *= 1.2;
    factors.push({ name: 'Équipe solide', impact: 20, positive: true });
  } else if (company.employees.length >= 10) {
    multiple *= 1.1;
    factors.push({ name: 'Équipe établie', impact: 10, positive: true });
  }
  
  // Reputation and credibility
  if (company.reputation > 80) {
    multiple *= 1.2;
    factors.push({ name: 'Excellente réputation', impact: 20, positive: true });
  } else if (company.reputation < 40) {
    multiple *= 0.8;
    factors.push({ name: 'Réputation à risque', impact: -20, positive: false });
  }
  
  // Market share
  if (company.marketShare > 20) {
    multiple *= 1.3;
    factors.push({ name: 'Leader du marché', impact: 30, positive: true });
  } else if (company.marketShare > 10) {
    multiple *= 1.1;
    factors.push({ name: 'Position de marché solide', impact: 10, positive: true });
  }
  
  // Economic weather impact
  if (state.economicWeather === 'croissance') {
    multiple *= 1.1;
    factors.push({ name: 'Économie favorable', impact: 10, positive: true });
  } else if (state.economicWeather === 'recession' || state.economicWeather === 'crise') {
    multiple *= 0.7;
    factors.push({ name: 'Économie difficile', impact: -30, positive: false });
  }
  
  const preMoneyValuation = Math.max(baseRevenue * multiple, company.capital * 2);
  
  return {
    preMoneyValuation: Math.round(preMoneyValuation),
    postMoneyValuation: Math.round(preMoneyValuation),
    method: 'multiples',
    factors,
    date: state.day,
  };
}

// Calculate revenue growth rate (%)
function calculateRevenueGrowth(company: Company): number {
  if (company.financialHistory.length < 2) return 0;
  
  const recent = company.financialHistory.slice(-3);
  const older = company.financialHistory.slice(-6, -3);
  
  if (older.length === 0) return 0;
  
  const recentTotal = recent.reduce((sum, h) => sum + h.revenue, 0);
  const olderTotal = older.reduce((sum, h) => sum + h.revenue, 0);
  
  if (olderTotal === 0) return 100;
  return Math.round(((recentTotal - olderTotal) / olderTotal) * 100);
}

// Check if company meets investor requirements
export function checkInvestorRequirements(
  investor: Investor,
  company: Company,
  state: GameState
): { eligible: boolean; unmet: string[] } {
  const unmet: string[] = [];
  
  for (const req of investor.requirements) {
    let currentValue = 0;
    
    switch (req.type) {
      case 'revenue':
        currentValue = company.monthlyRevenue * 12;
        break;
      case 'employees':
        currentValue = company.employees.length;
        break;
      case 'growth':
        currentValue = calculateRevenueGrowth(company);
        break;
      case 'product':
        currentValue = company.products.filter(p => p.phase !== 'rd').length;
        break;
      case 'traction':
        currentValue = company.clients?.length || 0;
        break;
      case 'team':
        currentValue = company.employees.length;
        break;
    }
    
    if (currentValue < req.minValue) {
      unmet.push(req.description);
    }
  }
  
  return { eligible: unmet.length === 0, unmet };
}

// Create a new funding round
export function createFundingRound(
  type: FundingRound['type'],
  amount: number,
  equityGiven: number,
  investorIds: string[],
  day: number
): FundingRound {
  const valuation = amount / (equityGiven / 100);
  
  return {
    id: `round_${Date.now()}`,
    type,
    amount,
    equityGiven,
    valuation,
    investors: investorIds,
    date: day,
    terms: {
      boardSeat: type !== 'pre_seed' && type !== 'seed',
      vetoRights: type === 'series_a' || type === 'series_b' || type === 'series_c',
      antiDilution: type !== 'pre_seed',
      liquidationPreference: type === 'series_c' ? 2 : 1,
      reportingRequirements: type === 'pre_seed' ? 'minimal' : type === 'seed' ? 'standard' : 'strict',
    },
    closed: false,
  };
}

// Initialize shareholders for a new company
export function initializeShareholders(founderEquity: number = 100): Shareholder[] {
  return [{
    id: 'founder',
    name: 'Fondateur',
    type: 'founder',
    shares: 1000000,
    percentage: founderEquity,
    votingRights: founderEquity,
    entryDate: 1,
    entryPrice: 0,
  }];
}

// Add a new shareholder after investment
export function addShareholder(
  shareholders: Shareholder[],
  investor: Investor,
  equityPercent: number,
  investment: number,
  day: number
): Shareholder[] {
  const totalShares = shareholders.reduce((sum, s) => sum + s.shares, 0);
  const newShares = Math.round((totalShares * equityPercent) / (100 - equityPercent));
  const newTotalShares = totalShares + newShares;
  
  // Dilute existing shareholders
  const dilutedShareholders = shareholders.map(s => ({
    ...s,
    percentage: (s.shares / newTotalShares) * 100,
    votingRights: (s.shares / newTotalShares) * 100,
  }));
  
  // Add new shareholder
  dilutedShareholders.push({
    id: investor.id,
    name: investor.name,
    type: 'investor',
    shares: newShares,
    percentage: equityPercent,
    votingRights: equityPercent,
    entryDate: day,
    entryPrice: investment / newShares,
  });
  
  return dilutedShareholders;
}

// Calculate dividend distribution
export function calculateDividend(
  company: Company,
  shareholders: Shareholder[],
  totalAmount: number,
  year: number,
  day: number
): Dividend {
  const totalShares = shareholders.reduce((sum, s) => sum + s.shares, 0);
  
  return {
    id: `dividend_${Date.now()}`,
    year,
    totalAmount,
    perShareAmount: totalAmount / totalShares,
    paymentDate: day + 30,
    approved: false,
  };
}

// Get available funding round types based on company stage
export function getAvailableFundingRounds(company: Company, state: GameState): FundingRound['type'][] {
  const annualRevenue = company.monthlyRevenue * 12;
  const available: FundingRound['type'][] = [];
  
  // Pre-seed: Very early
  if (annualRevenue < 100000 && company.employees.length < 5) {
    available.push('pre_seed');
  }
  
  // Seed: Early with some traction
  if (annualRevenue < 500000 && company.employees.length < 20) {
    available.push('seed');
  }
  
  // Series A: Growth stage
  if (annualRevenue >= 100000 && annualRevenue < 5000000 && company.employees.length >= 5) {
    available.push('series_a');
  }
  
  // Series B: Scaling
  if (annualRevenue >= 1000000 && company.employees.length >= 30) {
    available.push('series_b');
  }
  
  // Series C: Late stage
  if (annualRevenue >= 10000000 && company.employees.length >= 100) {
    available.push('series_c');
  }
  
  // IPO: Very large
  if (annualRevenue >= 50000000 && company.employees.length >= 250 && company.reputation >= 80) {
    available.push('ipo');
  }
  
  return available;
}

// Unlock investors based on company progress
export function updateInvestorUnlocks(investors: Investor[], company: Company, state: GameState): Investor[] {
  return investors.map(investor => {
    if (investor.unlocked) return investor;
    
    const { eligible } = checkInvestorRequirements(investor, company, state);
    return { ...investor, unlocked: eligible };
  });
}
