import { cn } from "@/lib/utils";
import { Bitcoin, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface Crypto {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
}

interface CryptoWidgetProps {
  treasury: number;
  onBuyCrypto?: (symbol: string, amount: number) => void;
}

const initialCryptos: Crypto[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 42567.89, change24h: 2.34, icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', price: 2345.67, change24h: -1.56, icon: 'Ξ' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.0823, change24h: 5.67, icon: 'Ð' },
  { symbol: 'SOL', name: 'Solana', price: 98.45, change24h: 3.21, icon: '◎' },
];

export function CryptoWidget({ treasury, onBuyCrypto }: CryptoWidgetProps) {
  const [cryptos, setCryptos] = useState<Crypto[]>(initialCryptos);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  // Simulate crypto price changes (more volatile than stocks)
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptos(prev => prev.map(crypto => {
        const volatility = 0.05; // 5% volatility
        const changePercent = (Math.random() - 0.5) * 2 * volatility * 100;
        const change = crypto.price * (changePercent / 100);
        const newPrice = Math.max(0.0001, crypto.price + change);
        return {
          ...crypto,
          price: Number(newPrice.toFixed(crypto.price < 1 ? 4 : 2)),
          change24h: Number((crypto.change24h + changePercent * 0.1).toFixed(2))
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) return `${(price / 1000).toFixed(1)}K`;
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(4);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium">Crypto</span>
        </div>
        <span className="text-[10px] text-muted-foreground animate-pulse">● Live</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {cryptos.map(crypto => (
          <button
            key={crypto.symbol}
            onClick={() => setSelectedCrypto(selectedCrypto === crypto.symbol ? null : crypto.symbol)}
            className={cn(
              "flex flex-col p-2 rounded-lg transition-all",
              selectedCrypto === crypto.symbol 
                ? "bg-primary/20 border border-primary/30" 
                : "bg-white/5 hover:bg-white/10"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{crypto.icon}</span>
              <span className="font-mono text-[10px] font-bold">{crypto.symbol}</span>
            </div>
            <span className="font-mono text-xs font-medium text-left">{formatPrice(crypto.price)}€</span>
            <div className={cn(
              "flex items-center gap-0.5 text-[10px]",
              crypto.change24h > 0 ? "text-success" : "text-destructive"
            )}>
              {crypto.change24h > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              <span>{crypto.change24h > 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%</span>
            </div>
          </button>
        ))}
      </div>

      {selectedCrypto && (
        <button 
          onClick={() => onBuyCrypto?.(selectedCrypto, 100)}
          className="w-full py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-400 rounded-lg transition-all"
        >
          Investir 100€ en {selectedCrypto}
        </button>
      )}
    </div>
  );
}
