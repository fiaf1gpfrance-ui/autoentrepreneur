import { Sun, Cloud, CloudRain, CloudLightning, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EconomicWeatherWidgetProps {
  weather: 'croissance' | 'stable' | 'recession' | 'crise';
  marketTrend: number; // -100 to 100
  interestRate: number;
  inflation: number;
}

const weatherData = {
  croissance: {
    icon: Sun,
    label: "Croissance",
    color: "text-success",
    bgColor: "bg-success/20",
    description: "Marchés favorables",
  },
  stable: {
    icon: Cloud,
    label: "Stable",
    color: "text-muted-foreground",
    bgColor: "bg-muted/20",
    description: "Conditions normales",
  },
  recession: {
    icon: CloudRain,
    label: "Récession",
    color: "text-warning",
    bgColor: "bg-warning/20",
    description: "Prudence recommandée",
  },
  crise: {
    icon: CloudLightning,
    label: "Crise",
    color: "text-destructive",
    bgColor: "bg-destructive/20",
    description: "Marchés volatils",
  },
};

export function EconomicWeatherWidget({ weather, marketTrend, interestRate, inflation }: EconomicWeatherWidgetProps) {
  const data = weatherData[weather];
  const WeatherIcon = data.icon;

  const TrendIcon = marketTrend > 0 ? TrendingUp : marketTrend < 0 ? TrendingDown : Minus;
  const trendColor = marketTrend > 0 ? "text-success" : marketTrend < 0 ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="flex flex-col gap-3">
      {/* Main Weather Display */}
      <div className="flex items-center gap-3">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", data.bgColor)}>
          <WeatherIcon className={cn("w-6 h-6", data.color)} />
        </div>
        <div>
          <p className={cn("font-semibold", data.color)}>{data.label}</p>
          <p className="text-xs text-muted-foreground">{data.description}</p>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Market Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <TrendIcon className={cn("w-3 h-3", trendColor)} />
            <span className="text-[10px] text-muted-foreground">Tendance</span>
          </div>
          <p className={cn("font-semibold text-sm", trendColor)}>
            {marketTrend > 0 ? "+" : ""}{marketTrend}%
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-2">
          <span className="text-[10px] text-muted-foreground block mb-1">Taux</span>
          <p className="font-semibold text-sm text-foreground">{interestRate.toFixed(1)}%</p>
        </div>

        <div className="bg-white/5 rounded-lg p-2 col-span-2">
          <span className="text-[10px] text-muted-foreground block mb-1">Inflation</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  inflation < 2 ? "bg-success" : inflation < 4 ? "bg-warning" : "bg-destructive"
                )}
                style={{ width: `${Math.min(inflation * 10, 100)}%` }}
              />
            </div>
            <span className="font-semibold text-xs">{inflation.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
