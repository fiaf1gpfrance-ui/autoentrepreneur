import { Users, TrendingUp, TrendingDown, Minus, Smile, Frown, Meh } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeStats {
  total: number;
  byDepartment: { name: string; count: number; color: string }[];
  averageMorale: number;
  averageSalary: number;
  recentChanges: { type: 'hired' | 'fired' | 'quit'; count: number };
}

interface EmployeeChartWidgetProps {
  stats: EmployeeStats;
}

export function EmployeeChartWidget({ stats }: EmployeeChartWidgetProps) {
  const defaultStats: EmployeeStats = stats.total > 0 ? stats : {
    total: 12,
    byDepartment: [
      { name: 'Tech', count: 5, color: 'bg-blue-500' },
      { name: 'Ventes', count: 3, color: 'bg-green-500' },
      { name: 'Admin', count: 2, color: 'bg-purple-500' },
      { name: 'Marketing', count: 2, color: 'bg-orange-500' },
    ],
    averageMorale: 72,
    averageSalary: 3200,
    recentChanges: { type: 'hired', count: 2 }
  };

  const { total, byDepartment, averageMorale, recentChanges } = defaultStats;
  const maxCount = Math.max(...byDepartment.map(d => d.count), 1);

  const getMoraleIcon = () => {
    if (averageMorale >= 70) return <Smile className="w-3.5 h-3.5 text-success" />;
    if (averageMorale >= 40) return <Meh className="w-3.5 h-3.5 text-warning" />;
    return <Frown className="w-3.5 h-3.5 text-destructive" />;
  };

  const getChangeIcon = () => {
    if (recentChanges.type === 'hired') return <TrendingUp className="w-3 h-3 text-success" />;
    if (recentChanges.type === 'quit' || recentChanges.type === 'fired') return <TrendingDown className="w-3 h-3 text-destructive" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <div className="space-y-2">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-lg font-bold">{total}</div>
            <div className="text-[10px] text-muted-foreground">employés</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            {getMoraleIcon()}
            <div className="text-[10px]">{averageMorale}%</div>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            {getChangeIcon()}
            <span className={cn(
              recentChanges.type === 'hired' ? 'text-success' : 'text-destructive'
            )}>
              {recentChanges.type === 'hired' ? '+' : '-'}{recentChanges.count}
            </span>
          </div>
        </div>
      </div>

      {/* Department Chart */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-muted-foreground font-medium">Par département</div>
        {byDepartment.map(dept => (
          <div key={dept.name} className="flex items-center gap-2">
            <div className="w-12 text-[9px] text-muted-foreground truncate">{dept.name}</div>
            <div className="flex-1 h-3 bg-background/30 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", dept.color)}
                style={{ width: `${(dept.count / maxCount) * 100}%` }}
              />
            </div>
            <div className="w-4 text-[10px] text-right font-medium">{dept.count}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-1.5 pt-1">
        <button className="flex-1 text-[9px] py-1 px-2 rounded bg-primary/20 hover:bg-primary/40 transition-colors">
          Recruter
        </button>
        <button className="flex-1 text-[9px] py-1 px-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
          Formation
        </button>
      </div>
    </div>
  );
}
