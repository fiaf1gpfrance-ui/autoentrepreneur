import { FinancialHistory, Achievement, Competitor } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Trophy, Target, TrendingUp, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameplayPanelProps {
  financialHistory: FinancialHistory[];
  achievements: Achievement[];
  competitors: Competitor[];
  marketShare: number;
}

export function GameplayPanel({
  financialHistory,
  achievements,
  competitors,
  marketShare,
}: GameplayPanelProps) {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const chartData = financialHistory.slice(-30).map((h, idx) => ({
    day: h.day,
    treasury: h.treasury,
    revenue: h.revenue,
    expenses: h.expenses,
    net: h.netResult,
  }));

  return (
    <div className="space-y-4">
      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Évolution Trésorerie
          </h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="treasury" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">CA vs Dépenses</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="game-panel">
        <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" /> Succès ({unlockedAchievements.length}/{achievements.length})
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {achievements.slice(0, 8).map(achievement => (
            <div 
              key={achievement.id}
              className={cn(
                "rounded-lg p-3 text-center transition-all",
                achievement.unlocked 
                  ? "bg-warning/10 border border-warning" 
                  : "bg-secondary/50 opacity-50"
              )}
            >
              <span className="text-2xl">{achievement.icon}</span>
              <p className="text-xs font-medium mt-1">{achievement.name}</p>
              {achievement.unlocked && (
                <Award className="w-3 h-3 text-warning mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Competition */}
      <div className="game-panel">
        <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-info" /> Concurrence
        </h4>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Votre part de marché</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${marketShare}%` }}
              />
            </div>
            <span className="font-bold text-primary">{marketShare.toFixed(1)}%</span>
          </div>
        </div>
        
        {competitors.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun concurrent identifié.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {competitors.slice(0, 6).map(comp => (
              <div key={comp.id} className="bg-secondary/50 rounded-lg p-3">
                <p className="font-medium text-sm">{comp.name}</p>
                <p className="text-xs text-muted-foreground">{comp.size}</p>
                <div className="flex justify-between text-xs mt-2">
                  <span>Part: {comp.marketShare.toFixed(1)}%</span>
                  <span className={comp.priceLevel < 1 ? "text-destructive" : "text-success"}>
                    Prix: x{comp.priceLevel.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
