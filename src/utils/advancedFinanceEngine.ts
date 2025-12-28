// ============================================
// ADVANCED FINANCE ENGINE - 100+ Features
// ============================================

import { 
  StockPortfolio, StockPosition, StockType, CryptoWallet, CryptoPosition, CryptoType,
  DerivativeContract, FinancialInstrument, MergerDeal, MergerType, FundingEvent, FundingRound,
  Investor, CashFlowForecast, Budget, FinancialRatio, Hedge, TaxStrategy, TaxOptimization,
  AuditReport, AuditType, AuditFinding
} from '@/types/advancedFeatures';
import { Company } from '@/types/game';

// ==================== STOCK TRADING (20 features) ====================

const STOCK_DATABASE: Omit<StockPosition, 'id' | 'quantity' | 'buyPrice' | 'buyDate'>[] = [
  { type: 'action', symbol: 'TECH', name: 'TechCorp SA', currentPrice: 150, dividendYield: 0.02, volatility: 0.35, sector: 'tech' },
  { type: 'action', symbol: 'BNKF', name: 'BanqueFinance', currentPrice: 85, dividendYield: 0.045, volatility: 0.20, sector: 'finance' },
  { type: 'action', symbol: 'INDU', name: 'Industries Réunies', currentPrice: 45, dividendYield: 0.03, volatility: 0.25, sector: 'industrie' },
  { type: 'action', symbol: 'LUXE', name: 'Luxe & Co', currentPrice: 320, dividendYield: 0.015, volatility: 0.30, sector: 'luxe' },
  { type: 'action', symbol: 'PHAR', name: 'PharmaSanté', currentPrice: 180, dividendYield: 0.025, volatility: 0.28, sector: 'santé' },
  { type: 'action', symbol: 'ENER', name: 'ÉnergieVerte', currentPrice: 95, dividendYield: 0.035, volatility: 0.40, sector: 'énergie' },
  { type: 'action', symbol: 'TELE', name: 'TélécomPlus', currentPrice: 28, dividendYield: 0.055, volatility: 0.22, sector: 'telecom' },
  { type: 'action', symbol: 'AGRI', name: 'AgroAliment', currentPrice: 62, dividendYield: 0.04, volatility: 0.18, sector: 'agroalimentaire' },
  { type: 'action', symbol: 'AUTO', name: 'AutoMobile SA', currentPrice: 78, dividendYield: 0.02, volatility: 0.45, sector: 'automobile' },
  { type: 'action', symbol: 'IMMO', name: 'ImmoFrance', currentPrice: 110, dividendYield: 0.06, volatility: 0.15, sector: 'immobilier' },
  { type: 'obligation', symbol: 'OAT10', name: 'OAT 10 ans', currentPrice: 100, dividendYield: 0.03, volatility: 0.05, sector: 'gouvernement' },
  { type: 'obligation', symbol: 'CORP5', name: 'Corporate 5Y', currentPrice: 98, dividendYield: 0.045, volatility: 0.08, sector: 'corporate' },
  { type: 'etf', symbol: 'CAC40', name: 'ETF CAC 40', currentPrice: 75, dividendYield: 0.028, volatility: 0.22, sector: 'index' },
  { type: 'etf', symbol: 'SP500', name: 'ETF S&P 500', currentPrice: 480, dividendYield: 0.018, volatility: 0.20, sector: 'index' },
  { type: 'etf', symbol: 'EMERG', name: 'ETF Émergents', currentPrice: 42, dividendYield: 0.022, volatility: 0.35, sector: 'emerging' },
  { type: 'commodity', symbol: 'GOLD', name: 'Or Physique', currentPrice: 1950, volatility: 0.15, sector: 'precious' },
  { type: 'commodity', symbol: 'OIL', name: 'Pétrole Brent', currentPrice: 82, volatility: 0.40, sector: 'energy' },
  { type: 'commodity', symbol: 'WHEAT', name: 'Blé', currentPrice: 245, volatility: 0.30, sector: 'agriculture' },
  { type: 'option', symbol: 'TECH-C', name: 'Call TechCorp', currentPrice: 15, volatility: 0.60, sector: 'derivatives' },
  { type: 'warrant', symbol: 'BNKF-W', name: 'Warrant BanqueFinance', currentPrice: 8, volatility: 0.55, sector: 'derivatives' },
];

export function getAvailableStocks(): Omit<StockPosition, 'id' | 'quantity' | 'buyPrice' | 'buyDate'>[] {
  return STOCK_DATABASE;
}

export function createStockPortfolio(): StockPortfolio {
  return {
    id: `portfolio_${Date.now()}`,
    stocks: [],
    totalValue: 0,
    totalGain: 0,
    lastUpdate: Date.now(),
  };
}

export function buyStock(
  portfolio: StockPortfolio,
  symbol: string,
  quantity: number,
  day: number
): { portfolio: StockPortfolio; cost: number } | null {
  const stockData = STOCK_DATABASE.find(s => s.symbol === symbol);
  if (!stockData) return null;

  const cost = stockData.currentPrice * quantity;
  const newPosition: StockPosition = {
    id: `stock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...stockData,
    quantity,
    buyPrice: stockData.currentPrice,
    buyDate: day,
  };

  const existingIndex = portfolio.stocks.findIndex(s => s.symbol === symbol);
  let updatedStocks: StockPosition[];

  if (existingIndex >= 0) {
    const existing = portfolio.stocks[existingIndex];
    const totalQuantity = existing.quantity + quantity;
    const avgPrice = (existing.buyPrice * existing.quantity + cost) / totalQuantity;
    updatedStocks = portfolio.stocks.map((s, i) =>
      i === existingIndex ? { ...s, quantity: totalQuantity, buyPrice: avgPrice } : s
    );
  } else {
    updatedStocks = [...portfolio.stocks, newPosition];
  }

  return {
    portfolio: {
      ...portfolio,
      stocks: updatedStocks,
      totalValue: updatedStocks.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0),
      totalGain: updatedStocks.reduce((sum, s) => sum + (s.currentPrice - s.buyPrice) * s.quantity, 0),
      lastUpdate: day,
    },
    cost,
  };
}

export function sellStock(
  portfolio: StockPortfolio,
  symbol: string,
  quantity: number,
  day: number
): { portfolio: StockPortfolio; proceeds: number; gain: number } | null {
  const positionIndex = portfolio.stocks.findIndex(s => s.symbol === symbol);
  if (positionIndex < 0) return null;

  const position = portfolio.stocks[positionIndex];
  if (position.quantity < quantity) return null;

  const proceeds = position.currentPrice * quantity;
  const gain = (position.currentPrice - position.buyPrice) * quantity;

  let updatedStocks: StockPosition[];
  if (position.quantity === quantity) {
    updatedStocks = portfolio.stocks.filter((_, i) => i !== positionIndex);
  } else {
    updatedStocks = portfolio.stocks.map((s, i) =>
      i === positionIndex ? { ...s, quantity: s.quantity - quantity } : s
    );
  }

  return {
    portfolio: {
      ...portfolio,
      stocks: updatedStocks,
      totalValue: updatedStocks.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0),
      totalGain: updatedStocks.reduce((sum, s) => sum + (s.currentPrice - s.buyPrice) * s.quantity, 0),
      lastUpdate: day,
    },
    proceeds,
    gain,
  };
}

export function updateStockPrices(portfolio: StockPortfolio, economicWeather: string): StockPortfolio {
  const weatherMultiplier = {
    croissance: 1.002,
    stable: 1.0,
    recession: 0.998,
    crise: 0.995,
  }[economicWeather] || 1.0;

  const updatedStocks = portfolio.stocks.map(stock => {
    const randomChange = (Math.random() - 0.5) * 2 * stock.volatility * 0.02;
    const newPrice = Math.max(1, stock.currentPrice * (1 + randomChange) * weatherMultiplier);
    return { ...stock, currentPrice: Math.round(newPrice * 100) / 100 };
  });

  return {
    ...portfolio,
    stocks: updatedStocks,
    totalValue: updatedStocks.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0),
    totalGain: updatedStocks.reduce((sum, s) => sum + (s.currentPrice - s.buyPrice) * s.quantity, 0),
    lastUpdate: Date.now(),
  };
}

export function calculateDividends(portfolio: StockPortfolio): number {
  return portfolio.stocks
    .filter(s => s.dividendYield)
    .reduce((sum, s) => sum + s.currentPrice * s.quantity * (s.dividendYield || 0) / 12, 0);
}

// ==================== CRYPTO TRADING (15 features) ====================

const CRYPTO_DATABASE: Omit<CryptoPosition, 'id' | 'quantity' | 'buyPrice' | 'buyDate'>[] = [
  { type: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', currentPrice: 42000, stakingReward: 0 },
  { type: 'ethereum', symbol: 'ETH', name: 'Ethereum', currentPrice: 2200, stakingReward: 0.04 },
  { type: 'stablecoin', symbol: 'USDC', name: 'USD Coin', currentPrice: 1, stakingReward: 0.05 },
  { type: 'stablecoin', symbol: 'EURT', name: 'Euro Tether', currentPrice: 1, stakingReward: 0.04 },
  { type: 'altcoin', symbol: 'SOL', name: 'Solana', currentPrice: 95, stakingReward: 0.06 },
  { type: 'altcoin', symbol: 'ADA', name: 'Cardano', currentPrice: 0.45, stakingReward: 0.05 },
  { type: 'altcoin', symbol: 'DOT', name: 'Polkadot', currentPrice: 7, stakingReward: 0.12 },
  { type: 'altcoin', symbol: 'AVAX', name: 'Avalanche', currentPrice: 35, stakingReward: 0.08 },
  { type: 'altcoin', symbol: 'MATIC', name: 'Polygon', currentPrice: 0.85, stakingReward: 0.05 },
  { type: 'token', symbol: 'LINK', name: 'Chainlink', currentPrice: 14, stakingReward: 0 },
  { type: 'token', symbol: 'UNI', name: 'Uniswap', currentPrice: 6, stakingReward: 0 },
  { type: 'altcoin', symbol: 'XRP', name: 'Ripple', currentPrice: 0.55, stakingReward: 0 },
  { type: 'altcoin', symbol: 'ATOM', name: 'Cosmos', currentPrice: 9, stakingReward: 0.15 },
];

export function getAvailableCryptos(): Omit<CryptoPosition, 'id' | 'quantity' | 'buyPrice' | 'buyDate'>[] {
  return CRYPTO_DATABASE;
}

export function createCryptoWallet(securityLevel: 'hot' | 'cold' | 'hardware' = 'hot'): CryptoWallet {
  return {
    id: `wallet_${Date.now()}`,
    cryptos: [],
    totalValue: 0,
    securityLevel,
  };
}

export function buyCrypto(
  wallet: CryptoWallet,
  symbol: string,
  amount: number,
  day: number
): { wallet: CryptoWallet; cost: number } | null {
  const cryptoData = CRYPTO_DATABASE.find(c => c.symbol === symbol);
  if (!cryptoData) return null;

  const quantity = amount / cryptoData.currentPrice;
  const newPosition: CryptoPosition = {
    id: `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...cryptoData,
    quantity,
    buyPrice: cryptoData.currentPrice,
    buyDate: day,
  };

  const existingIndex = wallet.cryptos.findIndex(c => c.symbol === symbol);
  let updatedCryptos: CryptoPosition[];

  if (existingIndex >= 0) {
    const existing = wallet.cryptos[existingIndex];
    const totalQuantity = existing.quantity + quantity;
    const avgPrice = (existing.buyPrice * existing.quantity + amount) / totalQuantity;
    updatedCryptos = wallet.cryptos.map((c, i) =>
      i === existingIndex ? { ...c, quantity: totalQuantity, buyPrice: avgPrice } : c
    );
  } else {
    updatedCryptos = [...wallet.cryptos, newPosition];
  }

  return {
    wallet: {
      ...wallet,
      cryptos: updatedCryptos,
      totalValue: updatedCryptos.reduce((sum, c) => sum + c.currentPrice * c.quantity, 0),
    },
    cost: amount,
  };
}

export function sellCrypto(
  wallet: CryptoWallet,
  symbol: string,
  quantity: number,
  day: number
): { wallet: CryptoWallet; proceeds: number; gain: number } | null {
  const positionIndex = wallet.cryptos.findIndex(c => c.symbol === symbol);
  if (positionIndex < 0) return null;

  const position = wallet.cryptos[positionIndex];
  if (position.quantity < quantity) return null;

  const proceeds = position.currentPrice * quantity;
  const gain = (position.currentPrice - position.buyPrice) * quantity;

  let updatedCryptos: CryptoPosition[];
  if (Math.abs(position.quantity - quantity) < 0.0001) {
    updatedCryptos = wallet.cryptos.filter((_, i) => i !== positionIndex);
  } else {
    updatedCryptos = wallet.cryptos.map((c, i) =>
      i === positionIndex ? { ...c, quantity: c.quantity - quantity } : c
    );
  }

  return {
    wallet: {
      ...wallet,
      cryptos: updatedCryptos,
      totalValue: updatedCryptos.reduce((sum, c) => sum + c.currentPrice * c.quantity, 0),
    },
    proceeds,
    gain,
  };
}

export function updateCryptoPrices(wallet: CryptoWallet): CryptoWallet {
  const updatedCryptos = wallet.cryptos.map(crypto => {
    const volatility = crypto.type === 'stablecoin' ? 0.001 : 
      crypto.type === 'bitcoin' ? 0.03 : 
      crypto.type === 'ethereum' ? 0.035 : 0.05;
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const newPrice = crypto.type === 'stablecoin' 
      ? 1 + (Math.random() - 0.5) * 0.002
      : Math.max(0.01, crypto.currentPrice * (1 + randomChange));
    return { ...crypto, currentPrice: Math.round(newPrice * 10000) / 10000 };
  });

  return {
    ...wallet,
    cryptos: updatedCryptos,
    totalValue: updatedCryptos.reduce((sum, c) => sum + c.currentPrice * c.quantity, 0),
  };
}

export function calculateStakingRewards(wallet: CryptoWallet): number {
  return wallet.cryptos
    .filter(c => c.stakingReward && c.stakingReward > 0)
    .reduce((sum, c) => sum + c.currentPrice * c.quantity * (c.stakingReward || 0) / 365, 0);
}

// ==================== DERIVATIVES (10 features) ====================

export function createDerivative(
  instrument: FinancialInstrument,
  underlyingAsset: string,
  strikePrice: number,
  expirationDays: number,
  notional: number,
  isLong: boolean,
  currentDay: number
): DerivativeContract {
  const premiumRates: Record<FinancialInstrument, number> = {
    option_call: 0.05,
    option_put: 0.04,
    future: 0.02,
    forward: 0.015,
    swap: 0.01,
    cfd: 0.03,
  };

  return {
    id: `deriv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    instrument,
    underlyingAsset,
    strikePrice,
    expirationDate: currentDay + expirationDays,
    premium: notional * premiumRates[instrument],
    notional,
    isLong,
    margin: notional * 0.1,
  };
}

export function valuateDerivative(contract: DerivativeContract, currentPrice: number, currentDay: number): number {
  const timeValue = Math.max(0, (contract.expirationDate - currentDay) / 365);
  const intrinsicValue = contract.isLong
    ? Math.max(0, currentPrice - contract.strikePrice)
    : Math.max(0, contract.strikePrice - currentPrice);
  
  if (contract.instrument === 'option_call' || contract.instrument === 'option_put') {
    return intrinsicValue * contract.notional / contract.strikePrice + timeValue * contract.premium * 0.5;
  }
  return (currentPrice - contract.strikePrice) * (contract.isLong ? 1 : -1) * contract.notional / contract.strikePrice;
}

export function exerciseOption(contract: DerivativeContract, currentPrice: number): { profit: number; exercised: boolean } {
  if (!['option_call', 'option_put'].includes(contract.instrument)) {
    return { profit: 0, exercised: false };
  }

  const isCall = contract.instrument === 'option_call';
  const profit = isCall
    ? Math.max(0, currentPrice - contract.strikePrice) * contract.notional / contract.strikePrice - contract.premium
    : Math.max(0, contract.strikePrice - currentPrice) * contract.notional / contract.strikePrice - contract.premium;

  return { profit, exercised: profit > 0 };
}

// ==================== M&A (15 features) ====================

const TARGET_COMPANIES = [
  { name: 'StartupTech', employees: 25, revenue: 500000, sector: 'tech', valuation: 2000000 },
  { name: 'ArtisanPro', employees: 15, revenue: 300000, sector: 'artisanat', valuation: 600000 },
  { name: 'ServiceExpert', employees: 40, revenue: 800000, sector: 'services', valuation: 1600000 },
  { name: 'IndustriePlus', employees: 100, revenue: 2000000, sector: 'industrie', valuation: 4000000 },
  { name: 'MiniMarket', employees: 30, revenue: 1000000, sector: 'commerce', valuation: 1500000 },
  { name: 'ConsultingPro', employees: 20, revenue: 600000, sector: 'conseil', valuation: 1200000 },
  { name: 'DataAnalytics', employees: 35, revenue: 900000, sector: 'tech', valuation: 3600000 },
  { name: 'GreenEnergy', employees: 50, revenue: 1500000, sector: 'énergie', valuation: 5000000 },
  { name: 'FoodDelivery', employees: 80, revenue: 2500000, sector: 'tech', valuation: 7500000 },
  { name: 'HealthTech', employees: 45, revenue: 1200000, sector: 'santé', valuation: 4800000 },
];

export function getAvailableTargets(minBudget: number): typeof TARGET_COMPANIES {
  return TARGET_COMPANIES.filter(t => t.valuation * 0.6 <= minBudget);
}

export function createMergerDeal(
  type: MergerType,
  targetName: string,
  offerPremium: number,
  currentDay: number
): MergerDeal | null {
  const target = TARGET_COMPANIES.find(t => t.name === targetName);
  if (!target) return null;

  const dealValue = target.valuation * (1 + offerPremium);
  const synergies = target.revenue * 0.15;
  const integrationCost = dealValue * 0.1;

  return {
    id: `merger_${Date.now()}`,
    type,
    targetCompany: targetName,
    dealValue,
    synergies,
    integrationCost,
    status: 'negotiation',
    startDate: currentDay,
    employees: target.employees,
    revenue: target.revenue,
  };
}

export function progressMerger(deal: MergerDeal, success: boolean): MergerDeal {
  const statusProgression: Record<string, string> = {
    negotiation: success ? 'due_diligence' : 'failed',
    due_diligence: success ? 'approval' : 'failed',
    approval: success ? 'integration' : 'failed',
    integration: 'completed',
  };

  return {
    ...deal,
    status: (statusProgression[deal.status] || deal.status) as MergerDeal['status'],
  };
}

export function calculateMergerSynergies(deal: MergerDeal, monthsIntegrated: number): number {
  if (deal.status !== 'completed') return 0;
  const maxSynergies = deal.synergies;
  const realizationRate = Math.min(1, monthsIntegrated / 24);
  return maxSynergies * realizationRate;
}

// ==================== FUNDING (15 features) ====================

const INVESTOR_DATABASE: Omit<Investor, 'id' | 'investment' | 'equity'>[] = [
  { name: 'TechVentures', type: 'vc', boardSeat: true, influence: 60 },
  { name: 'AngelNetwork', type: 'angel', boardSeat: false, influence: 20 },
  { name: 'GrowthCapital', type: 'pe', boardSeat: true, influence: 80 },
  { name: 'BanqueInvest', type: 'bank', boardSeat: false, influence: 40 },
  { name: 'CorpStratégique', type: 'corporate', boardSeat: true, influence: 70 },
  { name: 'FouleFunding', type: 'crowdfunding', boardSeat: false, influence: 10 },
  { name: 'SeedFund', type: 'vc', boardSeat: true, influence: 50 },
  { name: 'EuropeanGrowth', type: 'pe', boardSeat: true, influence: 75 },
];

export function getAvailableInvestors(round: FundingRound): typeof INVESTOR_DATABASE {
  const roundPreferences: Record<FundingRound, string[]> = {
    pre_seed: ['angel', 'crowdfunding'],
    seed: ['angel', 'vc', 'crowdfunding'],
    serie_a: ['vc', 'corporate'],
    serie_b: ['vc', 'pe', 'corporate'],
    serie_c: ['pe', 'corporate', 'bank'],
    ipo: ['bank'],
    spe: ['pe', 'bank'],
  };
  return INVESTOR_DATABASE.filter(i => roundPreferences[round]?.includes(i.type));
}

export function createFundingRound(
  round: FundingRound,
  amount: number,
  valuation: number,
  investorNames: string[],
  currentDay: number
): FundingEvent {
  const dilution = amount / valuation;
  const investors: Investor[] = investorNames.map((name, index) => {
    const investorData = INVESTOR_DATABASE.find(i => i.name === name);
    const share = 1 / investorNames.length;
    return {
      id: `investor_${Date.now()}_${index}`,
      name,
      type: investorData?.type || 'angel',
      investment: amount * share,
      equity: dilution * share * 100,
      boardSeat: investorData?.boardSeat || false,
      influence: investorData?.influence || 30,
    };
  });

  return {
    id: `funding_${Date.now()}`,
    round,
    amount,
    valuation,
    dilution: dilution * 100,
    investors,
    date: currentDay,
    terms: `${round.toUpperCase()} - ${amount.toLocaleString()}€ @ ${valuation.toLocaleString()}€ valuation`,
  };
}

export function calculatePreMoneyValuation(
  revenue: number,
  growthRate: number,
  sector: string,
  stage: FundingRound
): number {
  const sectorMultipliers: Record<string, number> = {
    tech: 8, services: 4, industrie: 3, artisanat: 2, commerce: 3,
  };
  const stageMultipliers: Record<FundingRound, number> = {
    pre_seed: 0.5, seed: 1, serie_a: 2, serie_b: 3, serie_c: 4, ipo: 5, spe: 2,
  };
  
  const baseMultiple = sectorMultipliers[sector] || 4;
  const stageMultiple = stageMultipliers[stage];
  const growthPremium = 1 + growthRate;
  
  return revenue * baseMultiple * stageMultiple * growthPremium;
}

// ==================== CASH FLOW & BUDGETS (10 features) ====================

export function createCashFlowForecast(
  company: Company,
  periods: number,
  currentDay: number
): CashFlowForecast {
  const projectedIncome: number[] = [];
  const projectedExpenses: number[] = [];
  const projectedBalance: number[] = [];
  
  let balance = company.treasury;
  
  for (let i = 0; i < periods; i++) {
    const income = company.monthlyRevenue * (1 + (Math.random() - 0.5) * 0.2);
    const expenses = company.monthlyExpenses * (1 + (Math.random() - 0.5) * 0.1);
    balance += income - expenses;
    
    projectedIncome.push(Math.round(income));
    projectedExpenses.push(Math.round(expenses));
    projectedBalance.push(Math.round(balance));
  }

  return {
    id: `forecast_${Date.now()}`,
    period: periods,
    projectedIncome,
    projectedExpenses,
    projectedBalance,
    accuracy: 0.75,
    lastUpdate: currentDay,
  };
}

export function createBudget(
  department: string,
  amount: number,
  period: 'monthly' | 'quarterly' | 'annual'
): Budget {
  return {
    id: `budget_${Date.now()}_${department}`,
    department,
    allocated: amount,
    spent: 0,
    remaining: amount,
    variance: 0,
    period,
  };
}

export function updateBudgetSpending(budget: Budget, amount: number): Budget {
  const newSpent = budget.spent + amount;
  return {
    ...budget,
    spent: newSpent,
    remaining: budget.allocated - newSpent,
    variance: ((newSpent - budget.allocated) / budget.allocated) * 100,
  };
}

// ==================== FINANCIAL RATIOS (10 features) ====================

export function calculateFinancialRatios(company: Company): FinancialRatio {
  const totalAssets = company.totalAssets || 1;
  const totalLiabilities = company.totalLiabilities || 0;
  const equity = totalAssets - totalLiabilities || 1;
  const revenue = company.monthlyRevenue * 12 || 1;
  const expenses = company.monthlyExpenses * 12;
  const netIncome = revenue - expenses;
  const inventory = company.inventory?.reduce((sum, i) => sum + i.quantity * i.unitCost, 0) || 0;
  const receivables = company.invoices?.filter(i => !i.paid).reduce((sum, i) => sum + i.amount, 0) || 0;

  return {
    currentRatio: (company.treasury + receivables + inventory) / (totalLiabilities || 1),
    quickRatio: (company.treasury + receivables) / (totalLiabilities || 1),
    debtToEquity: totalLiabilities / equity,
    returnOnAssets: netIncome / totalAssets,
    returnOnEquity: netIncome / equity,
    grossMargin: 0.35,
    netMargin: netIncome / revenue,
    assetTurnover: revenue / totalAssets,
    inventoryTurnover: (expenses * 0.6) / (inventory || 1),
    receivablesTurnover: revenue / (receivables || 1),
  };
}

// ==================== HEDGING (10 features) ====================

export function createHedge(
  type: 'currency' | 'interest' | 'commodity' | 'inflation',
  underlyingRisk: string,
  amount: number,
  durationDays: number,
  currentDay: number
): Hedge {
  const costRates: Record<string, number> = {
    currency: 0.02,
    interest: 0.015,
    commodity: 0.03,
    inflation: 0.01,
  };

  return {
    id: `hedge_${Date.now()}`,
    type,
    underlyingRisk,
    amount,
    cost: amount * costRates[type],
    expirationDate: currentDay + durationDays,
    effectiveness: 0.85 + Math.random() * 0.1,
  };
}

// ==================== TAX OPTIMIZATION (10 features) ====================

const TAX_STRATEGIES: Omit<TaxStrategy, 'id' | 'active'>[] = [
  { type: 'holding', name: 'Holding Société', annualSaving: 15000, setupCost: 5000, risk: 0.1, legalCompliance: 1.0 },
  { type: 'defiscalisation', name: 'Défiscalisation PME', annualSaving: 10000, setupCost: 2000, risk: 0.05, legalCompliance: 1.0 },
  { type: 'credit_impot', name: 'Crédit Impôt R&D', annualSaving: 25000, setupCost: 3000, risk: 0.15, legalCompliance: 0.95 },
  { type: 'credit_impot', name: 'CIR Innovation', annualSaving: 20000, setupCost: 2500, risk: 0.12, legalCompliance: 0.98 },
  { type: 'prix_transfert', name: 'Prix de Transfert Optimisé', annualSaving: 50000, setupCost: 15000, risk: 0.30, legalCompliance: 0.85 },
];

export function getAvailableTaxStrategies(): typeof TAX_STRATEGIES {
  return TAX_STRATEGIES;
}

export function activateTaxStrategy(strategyType: TaxOptimization): TaxStrategy | null {
  const strategy = TAX_STRATEGIES.find(s => s.type === strategyType);
  if (!strategy) return null;

  return {
    id: `tax_${Date.now()}`,
    ...strategy,
    active: true,
  };
}

export function calculateTaxSavings(strategies: TaxStrategy[]): number {
  return strategies.filter(s => s.active).reduce((sum, s) => sum + s.annualSaving, 0);
}

// ==================== AUDITS (5 features) ====================

export function createAudit(
  type: AuditType,
  currentDay: number
): AuditReport {
  const auditorNames = ['ErnstYoung', 'Deloitte', 'KPMG', 'PwC', 'Mazars'];
  const costs: Record<AuditType, number> = {
    interne: 5000,
    externe: 15000,
    fiscal: 10000,
    social: 8000,
    environnemental: 12000,
  };

  const findings: AuditFinding[] = [];
  const findingCount = Math.floor(Math.random() * 5);
  
  for (let i = 0; i < findingCount; i++) {
    findings.push({
      id: `finding_${i}`,
      severity: (['info', 'minor', 'major', 'critical'] as const)[Math.floor(Math.random() * 4)],
      description: `Observation ${i + 1} concernant les processus`,
      recommendation: `Améliorer le contrôle du processus ${i + 1}`,
      remediated: false,
    });
  }

  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const majorCount = findings.filter(f => f.severity === 'major').length;
  
  let rating: AuditReport['overallRating'] = 'excellent';
  if (criticalCount > 0) rating = 'critical';
  else if (majorCount > 1) rating = 'needs_improvement';
  else if (majorCount > 0 || findings.length > 3) rating = 'satisfactory';

  return {
    id: `audit_${Date.now()}`,
    type,
    date: currentDay,
    auditor: auditorNames[Math.floor(Math.random() * auditorNames.length)],
    findings,
    overallRating: rating,
    cost: costs[type],
  };
}
