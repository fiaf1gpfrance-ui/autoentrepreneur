import { cn } from "@/lib/utils";
import { Heart, Zap, Shield, Target, Users, Sparkles, TrendingUp, Coffee } from "lucide-react";

interface CultureValue {
  id: string;
  name: string;
  icon: any;
  level: number; // 0-100
  description: string;
  color: string;
}

interface CompanyCultureWidgetProps {
  employees: number;
  moral: number;
  credibility: number;
  productivity?: number;
}

export function CompanyCultureWidget({ employees, moral, credibility, productivity = 75 }: CompanyCultureWidgetProps) {
  const cultureValues: CultureValue[] = [
    { 
      id: 'innovation', 
      name: 'Innovation', 
      icon: Sparkles, 
      level: Math.min(100, credibility * 0.8 + 20),
      description: 'Capacité à innover',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'teamwork', 
      name: 'Cohésion', 
      icon: Users, 
      level: Math.min(100, moral * 0.9 + 10),
      description: 'Esprit d\'équipe',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'performance', 
      name: 'Performance', 
      icon: Target, 
      level: productivity,
      description: 'Efficacité collective',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'wellbeing', 
      name: 'Bien-être', 
      icon: Heart, 
      level: moral,
      description: 'Satisfaction au travail',
      color: 'from-rose-500 to-red-500'
    },
  ];

  const overallScore = Math.round(
    cultureValues.reduce((sum, v) => sum + v.level, 0) / cultureValues.length
  );

  const getCultureGrade = (score: number): { grade: string; color: string } => {
    if (score >= 90) return { grade: 'A+', color: 'text-success' };
    if (score >= 80) return { grade: 'A', color: 'text-success' };
    if (score >= 70) return { grade: 'B', color: 'text-primary' };
    if (score >= 60) return { grade: 'C', color: 'text-warning' };
    if (score >= 50) return { grade: 'D', color: 'text-orange-500' };
    return { grade: 'F', color: 'text-destructive' };
  };

  const { grade, color } = getCultureGrade(overallScore);

  return (
    <div className="space-y-3">
      {/* Overall Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium">Culture d'entreprise</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn("text-lg font-bold", color)}>{grade}</span>
          <span className="text-xs text-muted-foreground">({overallScore}%)</span>
        </div>
      </div>

      {/* Culture Values */}
      <div className="grid grid-cols-2 gap-2">
        {cultureValues.map(value => (
          <div 
            key={value.id}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <value.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium">{value.name}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full bg-gradient-to-r", value.color)}
                style={{ width: `${value.level}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">{value.level}%</span>
          </div>
        ))}
      </div>

      {/* Tips */}
      {overallScore < 70 && (
        <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
          <span className="text-[10px] text-warning">
            💡 Améliorez le moral de vos employés pour renforcer la culture !
          </span>
        </div>
      )}
    </div>
  );
}
