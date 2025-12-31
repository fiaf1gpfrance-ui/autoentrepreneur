// ==================== TRADING SYSTEM TYPES ====================

export type AssetType = 'stock' | 'crypto' | 'etf' | 'commodity' | 'forex';
export type OrderType = 'market' | 'limit' | 'stop_loss' | 'take_profit';
export type OrderStatus = 'pending' | 'executed' | 'cancelled' | 'expired';

// Marché d'actions
export interface Stock {
  symbol: string;
  name: string;
  sector: 'tech' | 'finance' | 'healthcare' | 'energy' | 'consumer' | 'industrial' | 'real_estate';
  exchange: 'CAC40' | 'NASDAQ' | 'NYSE' | 'LSE' | 'DAX';
  currentPrice: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
  pe: number;
  dividendYield: number;
  beta: number;
  priceHistory: PricePoint[];
}

// Cryptomonnaies
export interface Crypto {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: number;
  maxSupply?: number;
  priceHistory: PricePoint[];
}

// ETF
export interface ETF {
  symbol: string;
  name: string;
  type: 'index' | 'sector' | 'bond' | 'commodity' | 'international';
  currentPrice: number;
  nav: number; // Net Asset Value
  expenseRatio: number;
  dividendYield: number;
  holdings: number;
  aum: number; // Assets Under Management
  priceHistory: PricePoint[];
}

// Matières premières
export interface Commodity {
  symbol: string;
  name: string;
  category: 'precious_metals' | 'energy' | 'agriculture' | 'industrial_metals';
  currentPrice: number;
  previousClose: number;
  unit: string;
  priceHistory: PricePoint[];
}

// Forex
export interface ForexPair {
  symbol: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  previousClose: number;
  high24h: number;
  low24h: number;
  spread: number;
  priceHistory: PricePoint[];
}

// Point de prix pour graphiques
export interface PricePoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// Position dans le portefeuille
export interface TradingPosition {
  id: string;
  assetType: AssetType;
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  realizedPnL: number;
  purchaseDate: number;
  lastUpdate: number;
}

// Ordre de trading
export interface TradingOrder {
  id: string;
  assetType: AssetType;
  symbol: string;
  orderType: OrderType;
  side: 'buy' | 'sell';
  quantity: number;
  price?: number; // Pour limit orders
  triggerPrice?: number; // Pour stop_loss/take_profit
  status: OrderStatus;
  filledQuantity: number;
  filledPrice?: number;
  commission: number;
  createdAt: number;
  executedAt?: number;
  expiresAt?: number;
}

// Transaction exécutée
export interface TradingTransaction {
  id: string;
  orderId: string;
  assetType: AssetType;
  symbol: string;
  name: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  commission: number;
  pnl?: number;
  date: number;
}

// Portefeuille de trading complet
export interface TradingPortfolio {
  id: string;
  name: string;
  cash: number;
  positions: TradingPosition[];
  pendingOrders: TradingOrder[];
  totalValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  transactions: TradingTransaction[];
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  createdAt: number;
}

// Indicateurs techniques
export interface TechnicalIndicators {
  sma20: number;
  sma50: number;
  sma200: number;
  ema12: number;
  ema26: number;
  rsi: number;
  macd: {
    line: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  volume: number;
  averageVolume: number;
}

// Performance du portefeuille
export interface PortfolioPerformance {
  day: number;
  week: number;
  month: number;
  quarter: number;
  year: number;
  allTime: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
}

// Allocation par secteur/type
export interface AllocationData {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

// Watchlist
export interface Watchlist {
  id: string;
  name: string;
  assets: WatchlistItem[];
}

export interface WatchlistItem {
  assetType: AssetType;
  symbol: string;
  name: string;
  addedAt: number;
  alertPrice?: number;
  alertType?: 'above' | 'below';
}

// Alertes de prix
export interface PriceAlert {
  id: string;
  assetType: AssetType;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  triggered: boolean;
  triggeredAt?: number;
  createdAt: number;
}
