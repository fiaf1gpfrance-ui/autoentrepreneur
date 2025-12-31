import {
  StockPosition,
  StockType,
  Portfolio,
  InvestmentTransaction,
  FinancialForecast,
  ForecastDataPoint,
  ForecastScenario,
  Budget,
  BudgetCategory,
  CashFlowStatement,
  TaxPlanning,
  TaxDeduction,
  TaxCredit,
  TaxStrategy,
} from '@/types/advancedSystems';

// Stock market simulation
export const STOCK_SECTORS = {
  tech: { volatility: 0.03, expectedReturn: 0.12, dividend: 0.005 },
  finance: { volatility: 0.02, expectedReturn: 0.08, dividend: 0.03 },
  healthcare: { volatility: 0.025, expectedReturn: 0.10, dividend: 0.02 },
  energy: { volatility: 0.035, expectedReturn: 0.07, dividend: 0.04 },
  consumer: { volatility: 0.02, expectedReturn: 0.09, dividend: 0.025 },
  industrial: { volatility: 0.025, expectedReturn: 0.08, dividend: 0.03 },
};

export const AVAILABLE_STOCKS: { symbol: string; name: string; sector: keyof typeof STOCK_SECTORS; basePrice: number }[] = [
  { symbol: 'TECH1', name: 'TechGiant Corp', sector: 'tech', basePrice: 150 },
  { symbol: 'TECH2', name: 'Cloud Solutions', sector: 'tech', basePrice: 85 },
  { symbol: 'FIN1', name: 'Global Bank', sector: 'finance', basePrice: 45 },
  { symbol: 'FIN2', name: 'Insurance Plus', sector: 'finance', basePrice: 120 },
  { symbol: 'HLTH1', name: 'PharmaCo', sector: 'healthcare', basePrice: 200 },
  { symbol: 'HLTH2', name: 'MedTech Inc', sector: 'healthcare', basePrice: 75 },
  { symbol: 'NRG1', name: 'Energy Global', sector: 'energy', basePrice: 60 },
  { symbol: 'NRG2', name: 'Green Power', sector: 'energy', basePrice: 35 },
  { symbol: 'CONS1', name: 'Consumer Brands', sector: 'consumer', basePrice: 95 },
  { symbol: 'IND1', name: 'Industrial Systems', sector: 'industrial', basePrice: 110 },
];

export function createPortfolio(name: string, initialCash: number, riskLevel: Portfolio['riskLevel'], currentDay: number): Portfolio {
  return {
    id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    positions: [],
    cash: initialCash,
    totalValue: initialCash,
    dailyChange: 0,
    totalReturn: 0,
    riskLevel,
    benchmark: 'CAC40',
    createdAt: currentDay,
  };
}

export function buyStock(
  portfolio: Portfolio,
  symbol: string,
  quantity: number,
  price: number,
  currentDay: number
): { portfolio: Portfolio; transaction: InvestmentTransaction } | { error: string } {
  const totalCost = quantity * price + 9.99; // 9.99€ commission
  
  if (totalCost > portfolio.cash) {
    return { error: 'Fonds insuffisants' };
  }
  
  const existingPosition = portfolio.positions.find(p => p.symbol === symbol);
  let newPositions: StockPosition[];
  
  if (existingPosition) {
    const newQuantity = existingPosition.quantity + quantity;
    const newAvgCost = (existingPosition.averageCost * existingPosition.quantity + price * quantity) / newQuantity;
    
    newPositions = portfolio.positions.map(p => 
      p.symbol === symbol 
        ? { ...p, quantity: newQuantity, averageCost: newAvgCost, totalValue: newQuantity * price }
        : p
    );
  } else {
    const stockInfo = AVAILABLE_STOCKS.find(s => s.symbol === symbol);
    if (!stockInfo) return { error: 'Action non trouvée' };
    
    newPositions = [
      ...portfolio.positions,
      {
        id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        symbol,
        name: stockInfo.name,
        type: 'equity' as StockType,
        quantity,
        averageCost: price,
        currentPrice: price,
        totalValue: quantity * price,
        unrealizedGain: 0,
        purchaseDate: currentDay,
      },
    ];
  }
  
  const transaction: InvestmentTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    portfolioId: portfolio.id,
    type: 'buy',
    amount: quantity * price,
    quantity,
    price,
    fees: 9.99,
    date: currentDay,
  };
  
  return {
    portfolio: {
      ...portfolio,
      positions: newPositions,
      cash: portfolio.cash - totalCost,
      totalValue: portfolio.cash - totalCost + newPositions.reduce((sum, p) => sum + p.totalValue, 0),
    },
    transaction,
  };
}

export function sellStock(
  portfolio: Portfolio,
  symbol: string,
  quantity: number,
  price: number,
  currentDay: number
): { portfolio: Portfolio; transaction: InvestmentTransaction } | { error: string } {
  const position = portfolio.positions.find(p => p.symbol === symbol);
  
  if (!position || position.quantity < quantity) {
    return { error: 'Position insuffisante' };
  }
  
  const proceeds = quantity * price - 9.99; // commission
  let newPositions: StockPosition[];
  
  if (position.quantity === quantity) {
    newPositions = portfolio.positions.filter(p => p.symbol !== symbol);
  } else {
    newPositions = portfolio.positions.map(p =>
      p.symbol === symbol
        ? { ...p, quantity: p.quantity - quantity, totalValue: (p.quantity - quantity) * price }
        : p
    );
  }
  
  const transaction: InvestmentTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    portfolioId: portfolio.id,
    positionId: position.id,
    type: 'sell',
    amount: quantity * price,
    quantity,
    price,
    fees: 9.99,
    date: currentDay,
  };
  
  return {
    portfolio: {
      ...portfolio,
      positions: newPositions,
      cash: portfolio.cash + proceeds,
      totalValue: portfolio.cash + proceeds + newPositions.reduce((sum, p) => sum + p.totalValue, 0),
    },
    transaction,
  };
}

export function updateStockPrices(portfolio: Portfolio, currentDay: number): Portfolio {
  const updatedPositions = portfolio.positions.map(position => {
    const stockInfo = AVAILABLE_STOCKS.find(s => s.symbol === position.symbol);
    const sectorConfig = stockInfo ? STOCK_SECTORS[stockInfo.sector] : STOCK_SECTORS.tech;
    
    // Random walk with mean reversion
    const randomChange = (Math.random() - 0.5) * 2 * sectorConfig.volatility;
    const trendChange = sectorConfig.expectedReturn / 365;
    const newPrice = position.currentPrice * (1 + randomChange + trendChange);
    
    return {
      ...position,
      currentPrice: Math.max(0.01, newPrice),
      totalValue: position.quantity * newPrice,
      unrealizedGain: (newPrice - position.averageCost) * position.quantity,
    };
  });
  
  const positionsValue = updatedPositions.reduce((sum, p) => sum + p.totalValue, 0);
  const previousValue = portfolio.totalValue;
  const newTotalValue = portfolio.cash + positionsValue;
  
  return {
    ...portfolio,
    positions: updatedPositions,
    totalValue: newTotalValue,
    dailyChange: newTotalValue - previousValue,
    totalReturn: ((newTotalValue - portfolio.cash) / (portfolio.totalValue - portfolio.cash + 0.001) - 1) * 100,
  };
}

export function createFinancialForecast(
  type: FinancialForecast['type'],
  period: FinancialForecast['period'],
  baseValue: number,
  growthRate: number,
  periods: number,
  currentDay: number
): FinancialForecast {
  const projections: ForecastDataPoint[] = [];
  const periodDays = period === 'monthly' ? 30 : period === 'quarterly' ? 90 : 365;
  
  for (let i = 0; i < periods; i++) {
    const variance = (Math.random() - 0.5) * 0.2;
    const value = baseValue * Math.pow(1 + growthRate + variance, i);
    const confidence = 95 - i * 5;
    
    projections.push({
      date: currentDay + (i * periodDays),
      value,
      confidence: Math.max(50, confidence),
    });
  }
  
  const scenarios: ForecastScenario[] = [
    { name: 'optimistic', multiplier: 1.2, assumptions: ['Croissance forte', 'Nouveaux clients'] },
    { name: 'realistic', multiplier: 1.0, assumptions: ['Croissance stable', 'Marché normal'] },
    { name: 'pessimistic', multiplier: 0.8, assumptions: ['Récession', 'Perte de clients'] },
  ];
  
  return {
    id: `forecast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    period,
    projections,
    assumptions: ['Basé sur les tendances historiques', 'Économie stable'],
    scenarios,
    createdAt: currentDay,
  };
}

export function createBudget(
  name: string,
  month: number,
  year: number,
  categories: BudgetCategory[]
): Budget {
  const totalBudget = categories.reduce((sum, c) => sum + c.budgeted, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  
  return {
    id: `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    period: { month, year },
    categories: categories.map(c => ({
      ...c,
      variance: c.budgeted - c.spent,
    })),
    totalBudget,
    totalSpent,
    status: 'draft',
  };
}

export function createBudgetCategory(name: string, budgeted: number): BudgetCategory {
  return {
    id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    budgeted,
    spent: 0,
    variance: budgeted,
  };
}

export function generateCashFlowStatement(
  startDay: number,
  endDay: number,
  financialData: {
    netIncome: number;
    depreciation: number;
    receivablesChange: number;
    payablesChange: number;
    inventoryChange: number;
    capex: number;
    acquisitions: number;
    investmentsChange: number;
    debtIssuance: number;
    debtRepayment: number;
    dividends: number;
    equityIssuance: number;
    beginningCash: number;
  }
): CashFlowStatement {
  const operating = {
    netIncome: financialData.netIncome,
    depreciation: financialData.depreciation,
    accountsReceivable: -financialData.receivablesChange,
    accountsPayable: financialData.payablesChange,
    inventory: -financialData.inventoryChange,
    total: 0,
  };
  operating.total = operating.netIncome + operating.depreciation + 
    operating.accountsReceivable + operating.accountsPayable + operating.inventory;
  
  const investing = {
    capitalExpenditures: -financialData.capex,
    acquisitions: -financialData.acquisitions,
    investments: financialData.investmentsChange,
    total: 0,
  };
  investing.total = investing.capitalExpenditures + investing.acquisitions + investing.investments;
  
  const financing = {
    debtIssuance: financialData.debtIssuance,
    debtRepayment: -financialData.debtRepayment,
    dividends: -financialData.dividends,
    equityIssuance: financialData.equityIssuance,
    total: 0,
  };
  financing.total = financing.debtIssuance + financing.debtRepayment + financing.dividends + financing.equityIssuance;
  
  const netCashFlow = operating.total + investing.total + financing.total;
  
  return {
    period: { start: startDay, end: endDay },
    operating,
    investing,
    financing,
    netCashFlow,
    beginningCash: financialData.beginningCash,
    endingCash: financialData.beginningCash + netCashFlow,
  };
}

export function createTaxPlanning(year: number, estimatedIncome: number): TaxPlanning {
  const estimatedTax = calculateEstimatedTax(estimatedIncome);
  
  const deductions: TaxDeduction[] = [
    { id: 'ded_1', category: 'Charges sociales', description: 'Cotisations patronales', amount: estimatedIncome * 0.45, documentation: true },
    { id: 'ded_2', category: 'Amortissements', description: 'Amortissement matériel', amount: 0, documentation: false },
    { id: 'ded_3', category: 'Provisions', description: 'Provisions pour risques', amount: 0, documentation: false },
  ];
  
  const credits: TaxCredit[] = [
    { id: 'cred_1', name: 'Crédit Impôt Recherche (CIR)', type: 'research', amount: 0, eligible: false, applied: false },
    { id: 'cred_2', name: 'Crédit Impôt Innovation (CII)', type: 'research', amount: 0, eligible: false, applied: false },
    { id: 'cred_3', name: 'Crédit Impôt Formation', type: 'employment', amount: 0, eligible: true, applied: false },
  ];
  
  const strategies: TaxStrategy[] = [
    { id: 'strat_1', name: 'Investissement R&D', description: 'Augmenter les dépenses R&D pour bénéficier du CIR', potentialSavings: estimatedIncome * 0.03, complexity: 'medium', implemented: false },
    { id: 'strat_2', name: 'Provisions réglementées', description: 'Constituer des provisions déductibles', potentialSavings: estimatedIncome * 0.02, complexity: 'low', implemented: false },
    { id: 'strat_3', name: 'Amortissement accéléré', description: 'Utiliser l\'amortissement dégressif', potentialSavings: estimatedIncome * 0.015, complexity: 'low', implemented: false },
  ];
  
  return {
    id: `tax_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    year,
    estimatedIncome,
    estimatedTax,
    deductions,
    credits,
    strategies,
    quarterlyPayments: [
      { quarter: 1, amount: estimatedTax * 0.25, paid: false },
      { quarter: 2, amount: estimatedTax * 0.25, paid: false },
      { quarter: 3, amount: estimatedTax * 0.25, paid: false },
      { quarter: 4, amount: estimatedTax * 0.25, paid: false },
    ],
  };
}

function calculateEstimatedTax(income: number): number {
  // French corporate tax rates (IS)
  if (income <= 42500) {
    return income * 0.15;
  } else {
    return 42500 * 0.15 + (income - 42500) * 0.25;
  }
}

export function calculatePortfolioMetrics(portfolio: Portfolio): {
  sharpeRatio: number;
  diversification: number;
  sectorAllocation: Record<string, number>;
  riskScore: number;
} {
  const sectorAllocation: Record<string, number> = {};
  
  portfolio.positions.forEach(position => {
    const stockInfo = AVAILABLE_STOCKS.find(s => s.symbol === position.symbol);
    if (stockInfo) {
      const allocation = position.totalValue / portfolio.totalValue * 100;
      sectorAllocation[stockInfo.sector] = (sectorAllocation[stockInfo.sector] || 0) + allocation;
    }
  });
  
  const numSectors = Object.keys(sectorAllocation).length;
  const diversification = Math.min(100, numSectors * 20);
  
  const avgVolatility = portfolio.positions.reduce((sum, p) => {
    const stockInfo = AVAILABLE_STOCKS.find(s => s.symbol === p.symbol);
    const sector = stockInfo ? STOCK_SECTORS[stockInfo.sector] : STOCK_SECTORS.tech;
    return sum + sector.volatility * (p.totalValue / portfolio.totalValue);
  }, 0);
  
  const riskScore = Math.min(100, avgVolatility * 1000);
  const sharpeRatio = portfolio.totalReturn > 0 ? (portfolio.totalReturn / 100) / (avgVolatility + 0.01) : 0;
  
  return { sharpeRatio, diversification, sectorAllocation, riskScore };
}
