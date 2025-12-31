import { cn } from "@/lib/utils";
import { LucideIcon, Calendar, Coins, Gem, Gift, Play, Pause, FastForward, Save, RotateCcw, Cloud, Sun, CloudRain, CloudLightning, Search, Grid3X3 } from "lucide-react";
import { formatCurrency } from "@/utils/gameEngine";
import { useState } from "react";

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
  croissance: { icon: Sun, label: "Croissance", color: "text-success", bg: "bg-success/20" },
  stable: { icon: Cloud, label: "Stable", color: "text-muted-foreground", bg: "bg-muted/20" },
  recession: { icon: CloudRain, label: "Récession", color: "text-warning", bg: "bg-warning/20" },
  crise: { icon: CloudLightning, label: "Crise", color: "text-destructive", bg: "bg-destructive/20" },
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
  const WeatherIcon = weather.icon;
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  return (
    <div className="h-12 glass-effect border-t border-white/10 flex items-center px-2 gap-1">
      {/* Start Button */}
      <button className="h-10 px-3 flex items-center gap-2 rounded-md hover:bg-white/10 transition-all duration-200 group">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
          <Grid3X3 className="w-4 h-4 text-primary-foreground" />
        </div>
      </button>

      {/* Search (decorative) */}
      <div className="h-8 px-3 flex items-center gap-2 bg-white/5 rounded-full border border-white/10 text-muted-foreground text-xs">
        <Search className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">{companyName}</span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Open Apps */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto px-1">
        {openApps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppClick(app.id)}
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => setHoveredApp(null)}
            className={cn(
              "relative h-10 min-w-[44px] px-3 flex items-center gap-2 rounded-md transition-all duration-200",
              activeAppId === app.id
                ? "bg-white/15 shadow-inner"
                : "hover:bg-white/10",
              hoveredApp === app.id && "animate-taskbar-bounce"
            )}
          >
            <app.icon className={cn("w-5 h-5", app.color || "text-primary")} />
            <span className="text-xs font-medium hidden md:block max-w-[100px] truncate">{app.label}</span>
            
            {/* Active indicator */}
            {activeAppId === app.id && (
              <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary shadow-[0_0_8px] shadow-primary" />
            )}
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-1">
        {/* Weather */}
        <div className={cn(
          "h-8 px-2 flex items-center gap-1.5 rounded-md text-xs",
          weather.bg, weather.color
        )}>
          <WeatherIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">{weather.label}</span>
        </div>

        {/* Currency */}
        <div className="flex items-center gap-1">
          <div className="h-8 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 rounded-md transition-colors cursor-pointer">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-400 text-xs">{coins?.toLocaleString() || 0}</span>
          </div>
          <div className="h-8 flex items-center gap-1 bg-purple-500/10 hover:bg-purple-500/20 px-2 rounded-md transition-colors cursor-pointer">
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-bold text-purple-400 text-xs">{gems || 0}</span>
          </div>
          {canClaimReward && (
            <button
              onClick={onClaimReward}
              className="h-8 flex items-center gap-1 bg-success/20 hover:bg-success/30 px-2 rounded-md transition-colors animate-pulse"
            >
              <Gift className="w-3.5 h-3.5 text-success" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Game Controls */}
        <div className="flex items-center bg-white/5 rounded-md p-0.5">
          <button
            onClick={() => onSetSpeed(1)}
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded transition-all",
              gameSpeed === 1 ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "hover:bg-white/10"
            )}
          >
            <Play className="w-3 h-3" />
          </button>
          <button
            onClick={() => onSetSpeed(2)}
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded transition-all",
              gameSpeed === 2 ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "hover:bg-white/10"
            )}
          >
            <FastForward className="w-3 h-3" />
          </button>
          <button
            onClick={() => onSetSpeed(3)}
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded transition-all text-[10px] font-bold",
              gameSpeed === 3 ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "hover:bg-white/10"
            )}
          >
            3x
          </button>
          <button
            onClick={onTogglePause}
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded transition-all",
              isPaused ? "bg-warning text-warning-foreground" : "hover:bg-white/10"
            )}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>

        {/* Save/Reset */}
        <div className="flex items-center gap-0.5">
          <button onClick={onSave} className="h-7 w-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors">
            <Save className="w-3.5 h-3.5" />
          </button>
          <button onClick={onReset} className="h-7 w-7 flex items-center justify-center rounded hover:bg-destructive/20 transition-colors text-destructive">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Date & Treasury */}
        <div className="flex flex-col items-end px-2 py-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
          <span className={cn(
            "text-xs font-bold tabular-nums",
            treasury >= 0 ? "text-success" : "text-destructive"
          )}>
            {formatCurrency(treasury)}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="w-2.5 h-2.5" />
            <span className="tabular-nums">J{day} M{month} A{year}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
