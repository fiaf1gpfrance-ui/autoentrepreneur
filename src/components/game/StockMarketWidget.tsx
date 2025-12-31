import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface StockMarketWidgetProps {
  treasury: number;
  onBuyStock?: (symbol: string, amount: number) => void;
  onSellStock?: (symbol: string, amount: number) => void;
}

const initialStocks: Stock[] = [
  { symbol: 'TECH', name: 'TechCorp', price: 156.42, change: 2.34, changePercent: 1.52 },
  { symbol: 'BANK', name: 'FinanceGroup', price: 89.21, change: -1.12, changePercent: -1.24 },
  { symbol: 'ENER', name: 'EnergySolutions', price: 234.56, change: 5.67, changePercent: 2.48 },
  { symbol: 'HEAL', name: 'HealthTech', price: 178.90, change: -0.45, changePercent: -0.25 },
  { symbol: 'CONS', name: 'ConsumerGoods', price: 67.89, change: 0.89, changePercent: 1.33 },
  { symbol: 'INDU', name: 'IndustrialCo', price: 123.45, change: -2.10, changePercent: -1.67 },
];

export function StockMarketWidget({ treasury, onBuyStock, onSellStock }: StockMarketWidgetProps) {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  // Simulate stock price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const volatility = 0.02;
        const changePercent = (Math.random() - 0.5) * 2 * volatility * 100;
        const change = stock.price * (changePercent / 100);
        const newPrice = Math.max(1, stock.price + change);
        return {
          ...stock,
          price: Number(newPrice.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2))
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-success" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-destructive" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Marché en direct</span>
        <RefreshCw className="w-3 h-3 text-muted-foreground animate-spin-slow" />
      </div>
      
      <div className="space-y-1">
        {stocks.map(stock => (
          <button
            key={stock.symbol}
            onClick={() => setSelectedStock(selectedStock === stock.symbol ? null : stock.symbol)}
            className={cn(
              "w-full flex items-center justify-between p-1.5 rounded-lg transition-all text-left",
              selectedStock === stock.symbol 
                ? "bg-primary/20 border border-primary/30" 
                : "hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary">{stock.symbol}</span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">{stock.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium">{stock.price.toFixed(2)}€</span>
              <div className={cn(
                "flex items-center gap-0.5 text-[10px] font-medium",
                stock.change > 0 ? "text-success" : stock.change < 0 ? "text-destructive" : "text-muted-foreground"
              )}>
                {getTrendIcon(stock.change)}
                <span>{stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedStock && (
        <div className="flex gap-1 pt-2 border-t border-white/10">
          <button 
            onClick={() => onBuyStock?.(selectedStock, 1)}
            className="flex-1 py-1 text-[10px] font-medium bg-success/20 hover:bg-success/30 text-success rounded transition-colors"
          >
            Acheter
          </button>
          <button 
            onClick={() => onSellStock?.(selectedStock, 1)}
            className="flex-1 py-1 text-[10px] font-medium bg-destructive/20 hover:bg-destructive/30 text-destructive rounded transition-colors"
          >
            Vendre
          </button>
        </div>
      )}
    </div>
  );
}
