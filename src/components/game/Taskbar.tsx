import { cn } from "@/lib/utils";
import { LucideIcon, Calendar, Coins, Gem, Gift, Play, Pause, FastForward, Save, RotateCcw, Cloud, Sun, CloudRain, CloudLightning } from "lucide-react";
import { formatCurrency } from "@/utils/gameEngine";

interface TaskbarApp {
  id: string;
  label: string;
  icon: LucideIcon;
  color?: string;
}

interface TaskbarProps {
  companyName: string;
  coins: number;
  gems: number;
  day: number;
  month: number;
  year: number;
  treasury: number;
  isPaused: boolean;
  gameSpeed: number;
  economicWeather: 'croissance' | 'stable' | 'recession' | 'crise';
  canClaimReward: boolean;
  openApps: TaskbarApp[];
  activeAppId: string | null;
  onAppClick: (id: string) => void;
  onTogglePause: () => void;
  onSetSpeed: (speed: number) => void;
  onSave: () => void;
  onReset: () => void;
  onClaimReward: () => void;
}

const weatherConfig = {
  croissance: { icon: Sun, label: "📈 Croissance", color: "text-success" },
  stable: { icon: Cloud, label: "📊 Stable", color: "text-muted-foreground" },
  recession: { icon: CloudRain, label: "📉 Récession", color: "text-warning" },
  crise: { icon: CloudLightning, label: "⚠️ Crise", color: "text-destructive" },
};

export function Taskbar({
  companyName,
  coins,
  gems,
  day,
  month,
  year,
  treasury,
  isPaused,
  gameSpeed,
  economicWeather,
  canClaimReward,
  openApps,
  activeAppId,
  onAppClick,
  onTogglePause,
  onSetSpeed,
  onSave,
  onReset,
  onClaimReward,
}: TaskbarProps) {
  const weather = weatherConfig[economicWeather];

  return (
    <div className="h-14 bg-card/90 backdrop-blur-xl border-t border-border/50 flex items-center px-4 gap-4">
      {/* Start Button / Company */}
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors">
        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs">{companyName.charAt(0)}</span>
        </div>
        <span className="font-display font-bold text-sm hidden sm:block">{companyName}</span>
      </button>

      {/* Divider */}
      <div className="w-px h-8 bg-border/50" />

      {/* Open Apps */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto">
        {openApps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppClick(app.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all min-w-max",
              activeAppId === app.id
                ? "bg-primary/20 border-b-2 border-primary"
                : "hover:bg-secondary/50"
            )}
          >
            <app.icon className={cn("w-4 h-4", app.color || "text-primary")} />
            <span className="text-xs font-medium hidden md:block">{app.label}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-3">
        {/* Weather */}
        <div className={cn("flex items-center gap-1 text-xs", weather.color)}>
          <span>{weather.label}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border/30" />

        {/* Currency */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-full">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-400 text-xs">{coins?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center gap-1 bg-purple-500/20 px-2 py-1 rounded-full">
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-bold text-purple-400 text-xs">{gems || 0}</span>
          </div>
          {canClaimReward && (
            <button
              onClick={onClaimReward}
              className="flex items-center gap-1 bg-success/20 hover:bg-success/30 px-2 py-1 rounded-full transition-colors animate-pulse"
            >
              <Gift className="w-3.5 h-3.5 text-success" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border/30" />

        {/* Game Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSetSpeed(1)}
            className={cn(
              "p-1.5 rounded transition-colors",
              gameSpeed === 1 ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSetSpeed(2)}
            className={cn(
              "p-1.5 rounded transition-colors",
              gameSpeed === 2 ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSetSpeed(3)}
            className={cn(
              "p-1.5 rounded transition-colors",
              gameSpeed === 3 ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            <span className="text-[10px] font-bold">3x</span>
          </button>
          <button
            onClick={onTogglePause}
            className={cn(
              "p-1.5 rounded transition-colors",
              isPaused ? "bg-warning text-warning-foreground" : "hover:bg-secondary"
            )}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border/30" />

        {/* Save/Reset */}
        <div className="flex items-center gap-1">
          <button onClick={onSave} className="p-1.5 rounded hover:bg-secondary transition-colors">
            <Save className="w-3.5 h-3.5" />
          </button>
          <button onClick={onReset} className="p-1.5 rounded hover:bg-secondary transition-colors text-destructive">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border/30" />

        {/* Date & Treasury */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>J{day} M{month} A{year}</span>
          </div>
          <span className={cn(
            "text-xs font-bold",
            treasury >= 0 ? "text-success" : "text-destructive"
          )}>
            {formatCurrency(treasury)}
          </span>
        </div>
      </div>
    </div>
  );
}
