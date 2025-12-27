import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  colorClass?: string;
  subValue?: string;
}

export function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  colorClass,
  subValue 
}: StatCardProps) {
  return (
    <div className="stat-card space-y-2">
      <div className="flex items-center justify-between">
        <span className="data-label">{label}</span>
        {Icon && (
          <Icon className={cn("w-4 h-4", colorClass || "text-muted-foreground")} />
        )}
      </div>
      <div className={cn("data-value", colorClass)}>
        {value}
        {trend && (
          <span className={cn(
            "ml-2 text-sm",
            trend === 'up' && "text-success",
            trend === 'down' && "text-destructive",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      {subValue && (
        <p className="text-xs text-muted-foreground">{subValue}</p>
      )}
    </div>
  );
}
