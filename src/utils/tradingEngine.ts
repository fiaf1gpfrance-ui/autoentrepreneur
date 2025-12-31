import {
  Stock,
  Crypto,
  ETF,
  Commodity,
  ForexPair,
  TradingPortfolio,
  TradingPosition,
  TradingOrder,
  TradingTransaction,
  PricePoint,
  TechnicalIndicators,
  PortfolioPerformance,
  AllocationData,
  AssetType,
} from '@/types/trading';

// ==================== DONNÉES DU MARCHÉ ====================

export const STOCKS_DATA: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'tech', exchange: 'NASDAQ', currentPrice: 178.50, previousClose: 176.20, open: 177.00, high: 179.80, low: 175.50, volume: 52000000, marketCap: 2800000000000, pe: 28.5, dividendYield: 0.52, beta: 1.28, priceHistory: [] },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'tech', exchange: 'NASDAQ', currentPrice: 378.90, previousClose: 375.50, open: 376.00, high: 380.50, low: 374.00, volume: 25000000, marketCap: 2820000000000, pe: 35.2, dividendYield: 0.75, beta: 0.91, priceHistory: [] },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'tech', exchange: 'NASDAQ', currentPrice: 141.20, previousClose: 139.80, open: 140.00, high: 142.50, low: 138.90, volume: 28000000, marketCap: 1780000000000, pe: 25.8, dividendYield: 0, beta: 1.05, priceHistory: [] },
  { symbol: 'LVMH', name: 'LVMH Moët Hennessy', sector: 'consumer', exchange: 'CAC40', currentPrice: 785.40, previousClose: 780.00, open: 782.00, high: 790.00, low: 775.00, volume: 1200000, marketCap: 396000000000, pe: 24.5, dividendYield: 1.6, beta: 0.95, priceHistory: [] },
  { symbol: 'TTE', name: 'TotalEnergies', sector: 'energy', exchange: 'CAC40', currentPrice: 62.80, previousClose: 63.50, open: 63.20, high: 64.00, low: 62.20, volume: 8500000, marketCap: 148000000000, pe: 7.8, dividendYield: 5.2, beta: 0.78, priceHistory: [] },
  { symbol: 'BNP', name: 'BNP Paribas', sector: 'finance', exchange: 'CAC40', currentPrice: 58.90, previousClose: 58.20, open: 58.50, high: 59.80, low: 57.80, volume: 4500000, marketCap: 71000000000, pe: 6.5, dividendYield: 6.8, beta: 1.35, priceHistory: [] },
  { symbol: 'SAN', name: 'Sanofi', sector: 'healthcare', exchange: 'CAC40', currentPrice: 94.50, previousClose: 95.20, open: 95.00, high: 96.00, low: 93.80, volume: 3200000, marketCap: 119000000000, pe: 12.8, dividendYield: 3.8, beta: 0.55, priceHistory: [] },
  { symbol: 'AIR', name: 'Airbus SE', sector: 'industrial', exchange: 'CAC40', currentPrice: 142.80, previousClose: 140.50, open: 141.00, high: 144.00, low: 139.50, volume: 2800000, marketCap: 112000000000, pe: 32.5, dividendYield: 1.2, beta: 1.42, priceHistory: [] },
];

export const CRYPTO_DATA: Crypto[] = [
  { symbol: 'BTC', name: 'Bitcoin', currentPrice: 42500, previousClose: 41800, high24h: 43200, low24h: 41200, volume24h: 28000000000, marketCap: 832000000000, circulatingSupply: 19580000, maxSupply: 21000000, priceHistory: [] },
  { symbol: 'ETH', name: 'Ethereum', currentPrice: 2280, previousClose: 2250, high24h: 2350, low24h: 2200, volume24h: 15000000000, marketCap: 274000000000, circulatingSupply: 120250000, priceHistory: [] },
  { symbol: 'BNB', name: 'Binance Coin', currentPrice: 312, previousClose: 308, high24h: 318, low24h: 305, volume24h: 1200000000, marketCap: 47800000000, circulatingSupply: 153400000, maxSupply: 200000000, priceHistory: [] },
  { symbol: 'SOL', name: 'Solana', currentPrice: 98.50, previousClose: 95.80, high24h: 102.00, low24h: 94.00, volume24h: 3500000000, marketCap: 43000000000, circulatingSupply: 437000000, priceHistory: [] },
  { symbol: 'ADA', name: 'Cardano', currentPrice: 0.52, previousClose: 0.50, high24h: 0.55, low24h: 0.49, volume24h: 650000000, marketCap: 18500000000, circulatingSupply: 35600000000, maxSupply: 45000000000, priceHistory: [] },
  { symbol: 'XRP', name: 'Ripple', currentPrice: 0.62, previousClose: 0.60, high24h: 0.65, low24h: 0.58, volume24h: 1800000000, marketCap: 33500000000, circulatingSupply: 54000000000, maxSupply: 100000000000, priceHistory: [] },
];

export const ETF_DATA: ETF[] = [
  { symbol: 'CAC40', name: 'Lyxor CAC 40 ETF', type: 'index', currentPrice: 72.50, nav: 72.45, expenseRatio: 0.25, dividendYield: 2.8, holdings: 40, aum: 8500000000, priceHistory: [] },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'index', currentPrice: 475.80, nav: 475.65, expenseRatio: 0.09, dividendYield: 1.4, holdings: 500, aum: 420000000000, priceHistory: [] },
  { symbol: 'ACWI', name: 'iShares MSCI ACWI', type: 'international', currentPrice: 105.20, nav: 105.15, expenseRatio: 0.32, dividendYield: 1.8, holdings: 2400, aum: 18500000000, priceHistory: [] },
  { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'commodity', currentPrice: 185.40, nav: 185.35, expenseRatio: 0.40, dividendYield: 0, holdings: 1, aum: 58000000000, priceHistory: [] },
  { symbol: 'BND', name: 'Vanguard Total Bond', type: 'bond', currentPrice: 72.80, nav: 72.75, expenseRatio: 0.03, dividendYield: 4.2, holdings: 10200, aum: 98000000000, priceHistory: [] },
];

export const COMMODITIES_DATA: Commodity[] = [
  { symbol: 'GOLD', name: 'Or', category: 'precious_metals', currentPrice: 2035.50, previousClose: 2028.00, unit: '$/oz', priceHistory: [] },
  { symbol: 'SILVER', name: 'Argent', category: 'precious_metals', currentPrice: 23.45, previousClose: 23.20, unit: '$/oz', priceHistory: [] },
  { symbol: 'CRUDE', name: 'Pétrole Brent', category: 'energy', currentPrice: 78.50, previousClose: 79.20, unit: '$/bbl', priceHistory: [] },
  { symbol: 'NATGAS', name: 'Gaz Naturel', category: 'energy', currentPrice: 2.85, previousClose: 2.92, unit: '$/MMBtu', priceHistory: [] },
  { symbol: 'COPPER', name: 'Cuivre', category: 'industrial_metals', currentPrice: 3.82, previousClose: 3.78, unit: '$/lb', priceHistory: [] },
  { symbol: 'WHEAT', name: 'Blé', category: 'agriculture', currentPrice: 612.50, previousClose: 618.00, unit: '¢/bu', priceHistory: [] },
];

export const FOREX_DATA: ForexPair[] = [
  { symbol: 'EUR/USD', baseCurrency: 'EUR', quoteCurrency: 'USD', rate: 1.0892, previousClose: 1.0878, high24h: 1.0915, low24h: 1.0865, spread: 0.0002, priceHistory: [] },
  { symbol: 'GBP/USD', baseCurrency: 'GBP', quoteCurrency: 'USD', rate: 1.2685, previousClose: 1.2672, high24h: 1.2720, low24h: 1.2650, spread: 0.0003, priceHistory: [] },
  { symbol: 'USD/JPY', baseCurrency: 'USD', quoteCurrency: 'JPY', rate: 148.25, previousClose: 147.85, high24h: 148.80, low24h: 147.50, spread: 0.03, priceHistory: [] },
  { symbol: 'EUR/GBP', baseCurrency: 'EUR', quoteCurrency: 'GBP', rate: 0.8587, previousClose: 0.8575, high24h: 0.8605, low24h: 0.8560, spread: 0.0002, priceHistory: [] },
  { symbol: 'USD/CHF', baseCurrency: 'USD', quoteCurrency: 'CHF', rate: 0.8762, previousClose: 0.8748, high24h: 0.8790, low24h: 0.8735, spread: 0.0002, priceHistory: [] },
];

// ==================== SIMULATION DES PRIX ====================

export function simulatePriceChange(
  currentPrice: number,
  volatility: number = 0.02,
  trend: number = 0
): number {
  const randomChange = (Math.random() - 0.5) * 2 * volatility;
  const trendChange = trend / 365;
  return Math.max(0.01, currentPrice * (1 + randomChange + trendChange));
}

export function generatePriceHistory(
  basePrice: number,
  days: number,
  volatility: number = 0.02
): PricePoint[] {
  const history: PricePoint[] = [];
  let price = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = Date.now() - i * 24 * 60 * 60 * 1000;
    const dayVolatility = volatility * (0.5 + Math.random());
    
    const open = price;
    const change = (Math.random() - 0.5) * 2 * dayVolatility;
    const close = Math.max(0.01, price * (1 + change));
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(1000000 * (0.5 + Math.random()));
    
    history.push({ timestamp, open, high, low, close, volume });
    price = close;
  }
  
  return history;
}

export function updateMarketPrices(day: number): {
  stocks: Stock[];
  cryptos: Crypto[];
  etfs: ETF[];
  commodities: Commodity[];
  forex: ForexPair[];
} {
  const stocks = STOCKS_DATA.map(stock => ({
    ...stock,
    previousClose: stock.currentPrice,
    currentPrice: simulatePriceChange(stock.currentPrice, 0.02 * stock.beta),
    high: Math.max(stock.high, stock.currentPrice * 1.01),
    low: Math.min(stock.low, stock.currentPrice * 0.99),
    volume: Math.floor(stock.volume * (0.8 + Math.random() * 0.4)),
  }));
  
  const cryptos = CRYPTO_DATA.map(crypto => ({
    ...crypto,
    previousClose: crypto.currentPrice,
    currentPrice: simulatePriceChange(crypto.currentPrice, 0.05), // Plus volatile
    high24h: Math.max(crypto.high24h, crypto.currentPrice * 1.02),
    low24h: Math.min(crypto.low24h, crypto.currentPrice * 0.98),
    volume24h: crypto.volume24h * (0.7 + Math.random() * 0.6),
  }));
  
  const etfs = ETF_DATA.map(etf => ({
    ...etf,
    currentPrice: simulatePriceChange(etf.currentPrice, 0.015),
    nav: simulatePriceChange(etf.nav, 0.015),
  }));
  
  const commodities = COMMODITIES_DATA.map(commodity => ({
    ...commodity,
    previousClose: commodity.currentPrice,
    currentPrice: simulatePriceChange(commodity.currentPrice, 0.025),
  }));
  
  const forex = FOREX_DATA.map(pair => ({
    ...pair,
    previousClose: pair.rate,
    rate: simulatePriceChange(pair.rate, 0.005), // Moins volatile
    high24h: Math.max(pair.high24h, pair.rate * 1.002),
    low24h: Math.min(pair.low24h, pair.rate * 0.998),
  }));
  
  return { stocks, cryptos, etfs, commodities, forex };
}

// ==================== GESTION DU PORTEFEUILLE ====================

export function createTradingPortfolio(
  name: string,
  initialCash: number,
  riskLevel: TradingPortfolio['riskLevel'],
  currentDay: number
): TradingPortfolio {
  return {
    id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    cash: initialCash,
    positions: [],
    pendingOrders: [],
    totalValue: initialCash,
    totalInvested: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    dayChange: 0,
    dayChangePercent: 0,
    transactions: [],
    riskLevel,
    createdAt: currentDay,
  };
}

export function executeMarketBuy(
  portfolio: TradingPortfolio,
  assetType: AssetType,
  symbol: string,
  name: string,
  quantity: number,
  price: number,
  currentDay: number
): { portfolio: TradingPortfolio; transaction: TradingTransaction } | { error: string } {
  const commission = calculateCommission(assetType, quantity * price);
  const totalCost = quantity * price + commission;
  
  if (totalCost > portfolio.cash) {
    return { error: 'Fonds insuffisants' };
  }
  
  const existingPosition = portfolio.positions.find(p => p.symbol === symbol);
  let newPositions: TradingPosition[];
  
  if (existingPosition) {
    const newQuantity = existingPosition.quantity + quantity;
    const newAvgCost = (existingPosition.averageCost * existingPosition.quantity + price * quantity) / newQuantity;
    
    newPositions = portfolio.positions.map(p =>
      p.symbol === symbol
        ? {
            ...p,
            quantity: newQuantity,
            averageCost: newAvgCost,
            currentPrice: price,
            totalValue: newQuantity * price,
            unrealizedPnL: (price - newAvgCost) * newQuantity,
            unrealizedPnLPercent: ((price - newAvgCost) / newAvgCost) * 100,
            lastUpdate: currentDay,
          }
        : p
    );
  } else {
    const newPosition: TradingPosition = {
      id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assetType,
      symbol,
      name,
      quantity,
      averageCost: price,
      currentPrice: price,
      totalValue: quantity * price,
      unrealizedPnL: 0,
      unrealizedPnLPercent: 0,
      realizedPnL: 0,
      purchaseDate: currentDay,
      lastUpdate: currentDay,
    };
    newPositions = [...portfolio.positions, newPosition];
  }
  
  const transaction: TradingTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderId: '',
    assetType,
    symbol,
    name,
    side: 'buy',
    quantity,
    price,
    total: quantity * price,
    commission,
    date: currentDay,
  };
  
  const totalInvested = newPositions.reduce((sum, p) => sum + p.quantity * p.averageCost, 0);
  const totalValue = portfolio.cash - totalCost + newPositions.reduce((sum, p) => sum + p.totalValue, 0);
  
  return {
    portfolio: {
      ...portfolio,
      positions: newPositions,
      cash: portfolio.cash - totalCost,
      totalValue,
      totalInvested,
      transactions: [...portfolio.transactions, transaction],
    },
    transaction,
  };
}

export function executeMarketSell(
  portfolio: TradingPortfolio,
  symbol: string,
  quantity: number,
  price: number,
  currentDay: number
): { portfolio: TradingPortfolio; transaction: TradingTransaction } | { error: string } {
  const position = portfolio.positions.find(p => p.symbol === symbol);
  
  if (!position || position.quantity < quantity) {
    return { error: 'Position insuffisante' };
  }
  
  const commission = calculateCommission(position.assetType, quantity * price);
  const proceeds = quantity * price - commission;
  const realizedPnL = (price - position.averageCost) * quantity;
  
  let newPositions: TradingPosition[];
  
  if (position.quantity === quantity) {
    newPositions = portfolio.positions.filter(p => p.symbol !== symbol);
  } else {
    newPositions = portfolio.positions.map(p =>
      p.symbol === symbol
        ? {
            ...p,
            quantity: p.quantity - quantity,
            totalValue: (p.quantity - quantity) * price,
            unrealizedPnL: (price - p.averageCost) * (p.quantity - quantity),
            unrealizedPnLPercent: ((price - p.averageCost) / p.averageCost) * 100,
            realizedPnL: p.realizedPnL + realizedPnL,
            lastUpdate: currentDay,
          }
        : p
    );
  }
  
  const transaction: TradingTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderId: '',
    assetType: position.assetType,
    symbol,
    name: position.name,
    side: 'sell',
    quantity,
    price,
    total: quantity * price,
    commission,
    pnl: realizedPnL,
    date: currentDay,
  };
  
  const totalInvested = newPositions.reduce((sum, p) => sum + p.quantity * p.averageCost, 0);
  const totalValue = portfolio.cash + proceeds + newPositions.reduce((sum, p) => sum + p.totalValue, 0);
  const totalPnL = portfolio.totalPnL + realizedPnL;
  
  return {
    portfolio: {
      ...portfolio,
      positions: newPositions,
      cash: portfolio.cash + proceeds,
      totalValue,
      totalInvested,
      totalPnL,
      totalPnLPercent: totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0,
      transactions: [...portfolio.transactions, transaction],
    },
    transaction,
  };
}

export function updatePortfolioPositions(
  portfolio: TradingPortfolio,
  stocks: Stock[],
  cryptos: Crypto[],
  etfs: ETF[],
  commodities: Commodity[],
  forex: ForexPair[],
  currentDay: number
): TradingPortfolio {
  const previousTotalValue = portfolio.totalValue;
  
  const updatedPositions = portfolio.positions.map(position => {
    let currentPrice = position.currentPrice;
    
    switch (position.assetType) {
      case 'stock':
        const stock = stocks.find(s => s.symbol === position.symbol);
        if (stock) currentPrice = stock.currentPrice;
        break;
      case 'crypto':
        const crypto = cryptos.find(c => c.symbol === position.symbol);
        if (crypto) currentPrice = crypto.currentPrice;
        break;
      case 'etf':
        const etf = etfs.find(e => e.symbol === position.symbol);
        if (etf) currentPrice = etf.currentPrice;
        break;
      case 'commodity':
        const commodity = commodities.find(c => c.symbol === position.symbol);
        if (commodity) currentPrice = commodity.currentPrice;
        break;
      case 'forex':
        const pair = forex.find(f => f.symbol === position.symbol);
        if (pair) currentPrice = pair.rate;
        break;
    }
    
    const totalValue = position.quantity * currentPrice;
    const unrealizedPnL = (currentPrice - position.averageCost) * position.quantity;
    const unrealizedPnLPercent = ((currentPrice - position.averageCost) / position.averageCost) * 100;
    
    return {
      ...position,
      currentPrice,
      totalValue,
      unrealizedPnL,
      unrealizedPnLPercent,
      lastUpdate: currentDay,
    };
  });
  
  const positionsValue = updatedPositions.reduce((sum, p) => sum + p.totalValue, 0);
  const totalValue = portfolio.cash + positionsValue;
  const dayChange = totalValue - previousTotalValue;
  const dayChangePercent = previousTotalValue > 0 ? (dayChange / previousTotalValue) * 100 : 0;
  
  const totalUnrealizedPnL = updatedPositions.reduce((sum, p) => sum + p.unrealizedPnL, 0);
  const totalInvested = updatedPositions.reduce((sum, p) => sum + p.quantity * p.averageCost, 0);
  
  return {
    ...portfolio,
    positions: updatedPositions,
    totalValue,
    totalInvested,
    totalPnL: portfolio.totalPnL + totalUnrealizedPnL,
    totalPnLPercent: totalInvested > 0 ? ((portfolio.totalPnL + totalUnrealizedPnL) / totalInvested) * 100 : 0,
    dayChange,
    dayChangePercent,
  };
}

// ==================== INDICATEURS TECHNIQUES ====================

export function calculateTechnicalIndicators(priceHistory: PricePoint[]): TechnicalIndicators {
  if (priceHistory.length < 200) {
    return {
      sma20: 0,
      sma50: 0,
      sma200: 0,
      ema12: 0,
      ema26: 0,
      rsi: 50,
      macd: { line: 0, signal: 0, histogram: 0 },
      bollingerBands: { upper: 0, middle: 0, lower: 0 },
      volume: 0,
      averageVolume: 0,
    };
  }
  
  const closes = priceHistory.map(p => p.close);
  const volumes = priceHistory.map(p => p.volume || 0);
  
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const sma200 = calculateSMA(closes, 200);
  
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  
  const rsi = calculateRSI(closes, 14);
  
  const macdLine = ema12 - ema26;
  const macdSignal = calculateEMA([...Array(9).fill(macdLine)], 9);
  const macdHistogram = macdLine - macdSignal;
  
  const stdDev = calculateStdDev(closes.slice(-20));
  const bollingerMiddle = sma20;
  const bollingerUpper = bollingerMiddle + 2 * stdDev;
  const bollingerLower = bollingerMiddle - 2 * stdDev;
  
  const volume = volumes[volumes.length - 1];
  const averageVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  
  return {
    sma20,
    sma50,
    sma200,
    ema12,
    ema26,
    rsi,
    macd: { line: macdLine, signal: macdSignal, histogram: macdHistogram },
    bollingerBands: { upper: bollingerUpper, middle: bollingerMiddle, lower: bollingerLower },
    volume,
    averageVolume,
  };
}

function calculateSMA(data: number[], period: number): number {
  if (data.length < period) return 0;
  const slice = data.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function calculateEMA(data: number[], period: number): number {
  if (data.length < period) return 0;
  const multiplier = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = period; i < data.length; i++) {
    ema = (data[i] - ema) * multiplier + ema;
  }
  
  return ema;
}

function calculateRSI(data: number[], period: number): number {
  if (data.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = data.length - period; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calculateStdDev(data: number[]): number {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / data.length);
}

// ==================== PERFORMANCE ====================

export function calculatePortfolioPerformance(
  portfolio: TradingPortfolio,
  historicalValues: { day: number; value: number }[]
): PortfolioPerformance {
  const currentValue = portfolio.totalValue;
  const now = historicalValues.length > 0 ? historicalValues[historicalValues.length - 1].day : 0;
  
  const getValue = (daysAgo: number) => {
    const target = now - daysAgo;
    const entry = historicalValues.find(h => h.day <= target);
    return entry?.value || portfolio.totalValue;
  };
  
  const dayValue = getValue(1);
  const weekValue = getValue(7);
  const monthValue = getValue(30);
  const quarterValue = getValue(90);
  const yearValue = getValue(365);
  const allTimeValue = historicalValues[0]?.value || portfolio.totalValue;
  
  const calcReturn = (oldValue: number) => oldValue > 0 ? ((currentValue - oldValue) / oldValue) * 100 : 0;
  
  return {
    day: calcReturn(dayValue),
    week: calcReturn(weekValue),
    month: calcReturn(monthValue),
    quarter: calcReturn(quarterValue),
    year: calcReturn(yearValue),
    allTime: calcReturn(allTimeValue),
    sharpeRatio: 1.5, // Simplifié
    maxDrawdown: -5,
    volatility: 12,
    beta: 1.0,
  };
}

export function calculateAllocation(portfolio: TradingPortfolio): AllocationData[] {
  const colors: Record<AssetType, string> = {
    stock: '#3b82f6',
    crypto: '#f59e0b',
    etf: '#10b981',
    commodity: '#8b5cf6',
    forex: '#ec4899',
  };
  
  const allocations: Record<AssetType, number> = {
    stock: 0,
    crypto: 0,
    etf: 0,
    commodity: 0,
    forex: 0,
  };
  
  portfolio.positions.forEach(position => {
    allocations[position.assetType] += position.totalValue;
  });
  
  const total = Object.values(allocations).reduce((a, b) => a + b, 0);
  
  return Object.entries(allocations)
    .filter(([, value]) => value > 0)
    .map(([category, value]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      color: colors[category as AssetType],
    }));
}

// ==================== UTILITAIRES ====================

function calculateCommission(assetType: AssetType, amount: number): number {
  const rates: Record<AssetType, number> = {
    stock: 0.001, // 0.1%
    crypto: 0.002, // 0.2%
    etf: 0.0005, // 0.05%
    commodity: 0.0015, // 0.15%
    forex: 0.0001, // 0.01%
  };
  
  return Math.max(1, amount * rates[assetType]);
}

export function formatCurrency(amount: number, currency: string = '€'): string {
  return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
