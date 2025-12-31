import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  History,
  Plus,
  Minus,
  RefreshCw,
  Search,
  Filter,
  LineChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TradingPortfolio,
  TradingPosition,
  TradingTransaction,
  AssetType,
} from '@/types/trading';
import {
  STOCKS_DATA,
  CRYPTO_DATA,
  ETF_DATA,
  COMMODITIES_DATA,
  FOREX_DATA,
  createTradingPortfolio,
  executeMarketBuy,
  executeMarketSell,
  updatePortfolioPositions,
  generatePriceHistory,
  calculateAllocation,
  formatCurrency,
  formatPercent,
} from '@/utils/tradingEngine';
import { toast } from 'sonner';

interface TradingPanelProps {
  treasury: number;
  day: number;
  onTreasuryChange: (amount: number) => void;
}

export function TradingPanel({ treasury, day, onTreasuryChange }: TradingPanelProps) {
  const [portfolio, setPortfolio] = useState<TradingPortfolio>(() => 
    createTradingPortfolio('Portefeuille Principal', 0, 'moderate', day)
  );
  const [activeTab, setActiveTab] = useState<AssetType>('stock');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Update prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio(prev => updatePortfolioPositions(
        prev, STOCKS_DATA, CRYPTO_DATA, ETF_DATA, COMMODITIES_DATA, FOREX_DATA, day
      ));
    }, 5000);
    return () => clearInterval(interval);
  }, [day]);

  const handleBuy = (assetType: AssetType, symbol: string, name: string, price: number) => {
    const cost = quantity * price + 10; // Commission
    if (treasury < cost) {
      toast.error('Trésorerie insuffisante');
      return;
    }
    
    const result = executeMarketBuy(portfolio, assetType, symbol, name, quantity, price, day);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    
    setPortfolio(result.portfolio);
    onTreasuryChange(-cost);
    toast.success(`Achat de ${quantity} ${symbol} à ${formatCurrency(price)}`);
  };

  const handleSell = (symbol: string, price: number) => {
    const position = portfolio.positions.find(p => p.symbol === symbol);
    if (!position) return;
    
    const sellQty = Math.min(quantity, position.quantity);
    const result = executeMarketSell(portfolio, symbol, sellQty, price, day);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    
    const proceeds = sellQty * price - 10;
    setPortfolio(result.portfolio);
    onTreasuryChange(proceeds);
    toast.success(`Vente de ${sellQty} ${symbol} à ${formatCurrency(price)}`);
  };

  const getAssets = () => {
    switch (activeTab) {
      case 'stock': return STOCKS_DATA.map(s => ({ ...s, type: 'stock' as const }));
      case 'crypto': return CRYPTO_DATA.map(c => ({ symbol: c.symbol, name: c.name, currentPrice: c.currentPrice, previousClose: c.previousClose, type: 'crypto' as const }));
      case 'etf': return ETF_DATA.map(e => ({ symbol: e.symbol, name: e.name, currentPrice: e.currentPrice, previousClose: e.nav, type: 'etf' as const }));
      case 'commodity': return COMMODITIES_DATA.map(c => ({ symbol: c.symbol, name: c.name, currentPrice: c.currentPrice, previousClose: c.previousClose, type: 'commodity' as const }));
      case 'forex': return FOREX_DATA.map(f => ({ symbol: f.symbol, name: `${f.baseCurrency}/${f.quoteCurrency}`, currentPrice: f.rate, previousClose: f.previousClose, type: 'forex' as const }));
      default: return [];
    }
  };

  const filteredAssets = getAssets().filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allocation = calculateAllocation(portfolio);

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Wallet className="w-3 h-3" />
              Valeur totale
            </div>
            <p className="font-bold text-lg">{formatCurrency(portfolio.totalValue + treasury)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <PieChart className="w-3 h-3" />
              Positions
            </div>
            <p className="font-bold text-lg">{portfolio.positions.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              {portfolio.dayChange >= 0 ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
              Variation jour
            </div>
            <p className={cn('font-bold text-lg', portfolio.dayChange >= 0 ? 'text-green-500' : 'text-red-500')}>
              {formatPercent(portfolio.dayChangePercent)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              P&L Total
            </div>
            <p className={cn('font-bold text-lg', portfolio.totalPnL >= 0 ? 'text-green-500' : 'text-red-500')}>
              {formatCurrency(portfolio.totalPnL)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Asset List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
              <History className="w-4 h-4 mr-1" />
              Historique
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AssetType)}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="stock" className="text-xs">Actions</TabsTrigger>
              <TabsTrigger value="crypto" className="text-xs">Crypto</TabsTrigger>
              <TabsTrigger value="etf" className="text-xs">ETF</TabsTrigger>
              <TabsTrigger value="commodity" className="text-xs">Matières</TabsTrigger>
              <TabsTrigger value="forex" className="text-xs">Forex</TabsTrigger>
            </TabsList>
          </Tabs>

          {showHistory ? (
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Historique des transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {portfolio.transactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Aucune transaction</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {portfolio.transactions.slice().reverse().map(tx => (
                        <div key={tx.id} className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center',
                              tx.side === 'buy' ? 'bg-green-500/10' : 'bg-red-500/10'
                            )}>
                              {tx.side === 'buy' ? <Plus className="w-4 h-4 text-green-500" /> : <Minus className="w-4 h-4 text-red-500" />}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{tx.symbol}</p>
                              <p className="text-xs text-muted-foreground">
                                {tx.quantity} × {formatCurrency(tx.price)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn('font-medium text-sm', tx.side === 'buy' ? 'text-red-500' : 'text-green-500')}>
                              {tx.side === 'buy' ? '-' : '+'}{formatCurrency(tx.total)}
                            </p>
                            {tx.pnl !== undefined && (
                              <p className={cn('text-xs', tx.pnl >= 0 ? 'text-green-500' : 'text-red-500')}>
                                P&L: {formatCurrency(tx.pnl)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y divide-border">
                    {filteredAssets.map(asset => {
                      const change = ((asset.currentPrice - asset.previousClose) / asset.previousClose) * 100;
                      const position = portfolio.positions.find(p => p.symbol === asset.symbol);
                      
                      return (
                        <div
                          key={asset.symbol}
                          className={cn(
                            'p-3 cursor-pointer hover:bg-muted/50 transition-colors',
                            selectedAsset === asset.symbol && 'bg-muted/50'
                          )}
                          onClick={() => setSelectedAsset(asset.symbol)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">{asset.symbol.slice(0, 3)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{asset.symbol}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[150px]">{asset.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatCurrency(asset.currentPrice)}</p>
                              <div className={cn('flex items-center gap-1 text-xs', change >= 0 ? 'text-green-500' : 'text-red-500')}>
                                {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {formatPercent(change)}
                              </div>
                            </div>
                          </div>
                          
                          {position && (
                            <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Position: {position.quantity}</span>
                              <span className={cn(position.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500')}>
                                {formatCurrency(position.unrealizedPnL)}
                              </span>
                            </div>
                          )}
                          
                          {selectedAsset === asset.symbol && (
                            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                              <Input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-20 h-8 text-center"
                              />
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuy(asset.type, asset.symbol, asset.name, asset.currentPrice);
                                }}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Acheter
                              </Button>
                              {position && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSell(asset.symbol, asset.currentPrice);
                                  }}
                                >
                                  <Minus className="w-3 h-3 mr-1" />
                                  Vendre
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Portfolio Sidebar */}
        <div className="space-y-3">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {allocation.length === 0 ? (
                <p className="text-muted-foreground text-xs text-center py-4">Aucune position</p>
              ) : (
                <div className="space-y-2">
                  {allocation.map(a => (
                    <div key={a.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                        <span className="text-xs">{a.category}</span>
                      </div>
                      <span className="text-xs font-medium">{a.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Positions ouvertes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[200px]">
                {portfolio.positions.length === 0 ? (
                  <p className="text-muted-foreground text-xs text-center py-8">Aucune position</p>
                ) : (
                  <div className="divide-y divide-border">
                    {portfolio.positions.map(pos => (
                      <div key={pos.id} className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{pos.symbol}</span>
                          <Badge variant={pos.unrealizedPnL >= 0 ? 'default' : 'destructive'} className="text-xs">
                            {formatPercent(pos.unrealizedPnLPercent)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{pos.quantity} @ {formatCurrency(pos.averageCost)}</span>
                          <span className={cn(pos.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {formatCurrency(pos.unrealizedPnL)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
