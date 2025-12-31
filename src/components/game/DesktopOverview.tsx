import { Company, GameState, SECTOR_MODIFIERS, Employee } from "@/types/game";
import { formatCurrency, formatPercent, getCredibilityColor, getMoralColor, calculateBFR, calculateTVADue, calculateTotalSalaryCosts } from "@/utils/gameEngine";
import { StatCard } from "./StatCard";
import { GaugeBar } from "./GaugeBar";
import { EventCard } from "./EventCard";
import { EmployeeCard } from "./EmployeeCard";
import { ProductCard } from "./ProductCard";
import { Wallet, TrendingUp, Shield, Heart, Users, Package, User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface DesktopOverviewProps {
  company: Company;
  gameState: GameState;
  onDismissEvent: (eventId: string) => void;
}

// Mini employee card for overview
function MiniEmployeeCard({ employee }: { employee: Employee }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-secondary/30 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
        <User className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{employee.name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          {employee.role}
        </p>
      </div>
      <div className="text-right">
        <span className={cn(
          "text-xs font-medium",
          employee.moral >= 70 ? "text-success" : employee.moral >= 40 ? "text-warning" : "text-destructive"
        )}>
          {Math.round(employee.moral)}%
        </span>
      </div>
    </div>
  );
}

// Mini product card for overview
function MiniProductCard({ product }: { product: { id: string; name: string; phase: string; currentPrice: number; rdProgress?: number } }) {
  const phaseLabels: Record<string, string> = {
    rd: "R&D",
    lancement: "Lancement",
    maturite: "Maturité",
    declin: "Déclin",
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-secondary/30 rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
        <Package className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">{phaseLabels[product.phase] || product.phase}</p>
      </div>
      <div className="text-right">
        <span className="text-xs font-medium text-success">
          {formatCurrency(product.currentPrice)}
        </span>
      </div>
    </div>
  );
}

export function DesktopOverview({ company, gameState, onDismissEvent }: DesktopOverviewProps) {
  const avgMoral = company.employees.length > 0
    ? company.employees.reduce((sum, e) => sum + e.moral, 0) / company.employees.length
    : 100;

  const bfr = calculateBFR(company);
  const tvaDue = calculateTVADue(company);
  const totalSalaryCost = calculateTotalSalaryCosts(company.employees);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Trésorerie"
          value={formatCurrency(company.treasury)}
          icon={Wallet}
          colorClass={company.treasury >= 0 ? "text-success" : "text-destructive"}
          subValue={`BFR: ${formatCurrency(bfr)}`}
        />
        <StatCard
          label="CA Mensuel"
          value={formatCurrency(company.monthlyRevenue)}
          icon={TrendingUp}
          colorClass="text-success"
          subValue={`Dépenses: ${formatCurrency(company.monthlyExpenses)}`}
        />
        <StatCard
          label="Crédibilité"
          value={`${Math.round(company.credibility)}/100`}
          icon={Shield}
          colorClass={getCredibilityColor(company.credibility)}
          subValue="Réputation"
        />
        <StatCard
          label="Moral Équipe"
          value={formatPercent(avgMoral)}
          icon={Heart}
          colorClass={getMoralColor(avgMoral)}
          subValue={`${company.employees.length} employé(s)`}
        />
      </div>

      {/* Gauges */}
      <div className="game-panel space-y-4">
        <h2 className="font-display font-semibold">Indicateurs Clés</h2>
        <div className="grid grid-cols-2 gap-6">
          <GaugeBar
            value={company.credibility}
            label="Crédibilité"
            colorClass={company.credibility >= 80 ? "bg-success" : company.credibility >= 50 ? "bg-warning" : "bg-destructive"}
          />
          <GaugeBar
            value={avgMoral}
            label="Moral Global"
            colorClass={avgMoral >= 70 ? "bg-success" : avgMoral >= 40 ? "bg-warning" : "bg-destructive"}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-border">
          <div>
            <p className="data-label">Coût Salarial</p>
            <p className="text-lg font-bold text-destructive">{formatCurrency(totalSalaryCost)}/mois</p>
          </div>
          <div>
            <p className="data-label">TVA Due</p>
            <p className="text-lg font-bold text-warning">{formatCurrency(tvaDue)}</p>
          </div>
          <div>
            <p className="data-label">Marge Secteur</p>
            <p className="text-lg font-bold text-primary">x{SECTOR_MODIFIERS[company.sector].marginMultiplier.toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* Events */}
      {gameState.activeEvents.length > 0 && (
        <div className="game-panel space-y-3">
          <h2 className="font-display font-semibold">Événements Actifs</h2>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {gameState.activeEvents.map(event => (
              <EventCard key={event.id} event={event} onDismiss={onDismissEvent} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employees Preview */}
        <div className="game-panel space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Équipe ({company.employees.length})
            </h2>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {company.employees.slice(0, 3).map(employee => (
              <MiniEmployeeCard key={employee.id} employee={employee} />
            ))}
            {company.employees.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun employé</p>
            )}
          </div>
        </div>

        {/* Products Preview */}
        <div className="game-panel space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Produits ({company.products.length})
            </h2>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {company.products.slice(0, 3).map(product => (
              <MiniProductCard key={product.id} product={product} />
            ))}
            {company.products.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun produit</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
