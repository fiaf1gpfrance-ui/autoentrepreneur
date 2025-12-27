import { cn } from "@/lib/utils";

interface GaugeBarProps {
  value: number;
  max?: number;
  label: string;
  colorClass?: string;
  showValue?: boolean;
}

export function GaugeBar({ 
  value, 
  max = 100, 
  label, 
  colorClass = "bg-primary",
  showValue = true 
}: GaugeBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="data-label">{label}</span>
        {showValue && (
          <span className="text-sm font-medium text-foreground">
            {Math.round(value)}/{max}
          </span>
        )}
      </div>
      <div className="gauge-bar">
        <div 
          className={cn("gauge-fill", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
