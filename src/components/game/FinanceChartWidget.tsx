import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinanceChartWidgetProps {
  treasury: number;
  revenue: number;
  previousTreasury?: number;
  previousRevenue?: number;
  history: number[];
}

export function FinanceChartWidget({ 
  treasury, 
  revenue, 
  previousTreasury = 0, 
  previousRevenue = 0,
  history 
}: FinanceChartWidgetProps) {
  const treasuryChange = previousTreasury ? ((treasury - previousTreasury) / Math.abs(previousTreasury)) * 100 : 0;
  const revenueChange = previousRevenue ? ((revenue - previousRevenue) / Math.abs(previousRevenue)) * 100 : 0;

  // Normalize history for mini chart
  const maxVal = Math.max(...history.filter(h => h > 0), 1);
  const minVal = Math.min(...history, 0);
  const range = maxVal - minVal || 1;

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M€`;
    }
    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(0)}K€`;
    }
    return `${value.toFixed(0)}€`;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Treasury */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            treasury >= 0 ? "bg-success/20" : "bg-destructive/20"
          )}>
            <DollarSign className={cn(
              "w-4 h-4",
              treasury >= 0 ? "text-success" : "text-destructive"
            )} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Trésorerie</p>
            <p className={cn(
              "font-bold text-lg",
              treasury >= 0 ? "text-success" : "text-destructive"
            )}>
              {formatCurrency(treasury)}
            </p>
          </div>
        </div>
        {treasuryChange !== 0 && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs px-2 py-1 rounded-full",
            treasuryChange >= 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
          )}>
            {treasuryChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(treasuryChange).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Mini Chart */}
      <div className="h-12 flex items-end gap-0.5">
        {history.slice(-20).map((value, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-t transition-all",
              value >= 0 ? "bg-success/60" : "bg-destructive/60"
            )}
            style={{
              height: `${Math.max(((value - minVal) / range) * 100, 2)}%`,
            }}
          />
        ))}
      </div>

      <div className="h-px bg-white/10" />

      {/* Revenue */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground">Revenu mensuel</p>
          <p className="font-semibold text-sm text-primary">{formatCurrency(revenue)}</p>
        </div>
        {revenueChange !== 0 && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs",
            revenueChange >= 0 ? "text-success" : "text-destructive"
          )}>
            {revenueChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(revenueChange).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}
