import { Users, Package, Shield, Heart, Building, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatsWidgetProps {
  employees: number;
  products: number;
  credibility: number;
  moral: number;
  properties: number;
  marketShare: number;
}

export function QuickStatsWidget({
  employees,
  products,
  credibility,
  moral,
  properties,
  marketShare,
}: QuickStatsWidgetProps) {
  const stats = [
    { icon: Users, label: "Employés", value: employees, color: "text-blue-400" },
    { icon: Package, label: "Produits", value: products, color: "text-violet-400" },
    { icon: Shield, label: "Crédibilité", value: `${credibility}%`, color: credibility >= 70 ? "text-success" : credibility >= 40 ? "text-warning" : "text-destructive" },
    { icon: Heart, label: "Moral", value: `${moral}%`, color: moral >= 70 ? "text-success" : moral >= 40 ? "text-warning" : "text-destructive" },
    { icon: Building, label: "Locaux", value: properties, color: "text-cyan-400" },
    { icon: TrendingUp, label: "Part marché", value: `${marketShare.toFixed(1)}%`, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <stat.icon className={cn("w-4 h-4", stat.color)} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground truncate">{stat.label}</p>
            <p className={cn("font-semibold text-sm", stat.color)}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
