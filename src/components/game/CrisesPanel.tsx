import { formatCurrency } from "@/utils/gameEngine";
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown, 
  Users, 
  Globe, 
  Scale, 
  Heart, 
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flame,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CrisisResponse {
  id: string;
  name: string;
  description: string;
  cost: number;
  effectiveness: number;
  duration: number;
}

interface Crisis {
  id: string;
  name: string;
  type: string;
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  effects: {
    revenue?: number;
    reputation?: number;
    employees?: number;
    costs?: number;
  };
  responses: CrisisResponse[];
  active: boolean;
  duration: number;
  startedAt?: number;
}

interface CrisesPanelProps {
  activeCrises: Crisis[];
  resolvedCrises?: Crisis[];
  treasury: number;
  onRespondToCrisis: (crisisId: string, responseId: string) => void;
}

const typeConfig: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  economic: { icon: TrendingDown, color: "text-red-500", bgColor: "bg-red-500/10", label: "Économique" },
  health: { icon: Heart, color: "text-pink-500", bgColor: "bg-pink-500/10", label: "Santé" },
  cyber: { icon: Shield, color: "text-purple-500", bgColor: "bg-purple-500/10", label: "Cyber" },
  legal: { icon: Scale, color: "text-orange-500", bgColor: "bg-orange-500/10", label: "Juridique" },
  reputation: { icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10", label: "Réputation" },
  supply: { icon: Globe, color: "text-cyan-500", bgColor: "bg-cyan-500/10", label: "Supply Chain" },
  hr: { icon: Users, color: "text-green-500", bgColor: "bg-green-500/10", label: "RH" },
  environmental: { icon: Zap, color: "text-yellow-500", bgColor: "bg-yellow-500/10", label: "Environnement" },
};

const severityConfig: Record<number, { label: string; color: string; bgColor: string }> = {
  1: { label: "Mineur", color: "text-green-500", bgColor: "bg-green-500" },
  2: { label: "Modéré", color: "text-yellow-500", bgColor: "bg-yellow-500" },
  3: { label: "Sérieux", color: "text-orange-500", bgColor: "bg-orange-500" },
  4: { label: "Grave", color: "text-red-500", bgColor: "bg-red-500" },
  5: { label: "Critique", color: "text-destructive", bgColor: "bg-destructive" },
};

export function CrisesPanel({ activeCrises, resolvedCrises = [], treasury, onRespondToCrisis }: CrisesPanelProps) {
  const totalActiveCrises = activeCrises.length;
  const criticalCrises = activeCrises.filter(c => c.severity >= 4).length;
  const resolvedCount = resolvedCrises.length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="game-panel text-center">
          <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalActiveCrises}</p>
          <p className="text-xs text-muted-foreground">Crises Actives</p>
        </div>
        <div className="game-panel text-center">
          <Flame className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-2xl font-bold">{criticalCrises}</p>
          <p className="text-xs text-muted-foreground">Crises Critiques</p>
        </div>
        <div className="game-panel text-center">
          <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
          <p className="text-2xl font-bold">{resolvedCount}</p>
          <p className="text-xs text-muted-foreground">Crises Résolues</p>
        </div>
        <div className="game-panel text-center">
          <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {totalActiveCrises === 0 ? "Stable" : totalActiveCrises <= 2 ? "Tendu" : "Critique"}
          </p>
          <p className="text-xs text-muted-foreground">État Général</p>
        </div>
      </div>

      {/* Active Crises */}
      {totalActiveCrises === 0 ? (
        <div className="game-panel text-center py-12">
          <Shield className="w-16 h-16 text-success mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl mb-2">Aucune crise en cours</h3>
          <p className="text-muted-foreground">Votre entreprise navigue en eaux calmes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeCrises.map(crisis => {
            const typeConf = typeConfig[crisis.type] || typeConfig.economic;
            const sevConf = severityConfig[crisis.severity];
            const TypeIcon = typeConf.icon;
            
            return (
              <div 
                key={crisis.id} 
                className={cn(
                  "game-panel border-l-4",
                  crisis.severity >= 4 ? "border-l-destructive animate-pulse" : "border-l-warning"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg", typeConf.bgColor)}>
                      <TypeIcon className={cn("w-6 h-6", typeConf.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold">{crisis.name}</h3>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full", typeConf.bgColor, typeConf.color)}>
                          {typeConf.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{crisis.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i}
                          className={cn(
                            "w-2 h-4 rounded-sm",
                            i < crisis.severity ? sevConf.bgColor : "bg-secondary"
                          )}
                        />
                      ))}
                    </div>
                    <span className={cn("text-xs font-medium", sevConf.color)}>
                      {sevConf.label}
                    </span>
                  </div>
                </div>

                {/* Effects */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-secondary/30 rounded-lg">
                  {crisis.effects.revenue && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Revenus</p>
                      <p className={cn("font-bold", crisis.effects.revenue < 0 ? "text-destructive" : "text-success")}>
                        {crisis.effects.revenue > 0 ? "+" : ""}{crisis.effects.revenue}%
                      </p>
                    </div>
                  )}
                  {crisis.effects.reputation && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Réputation</p>
                      <p className={cn("font-bold", crisis.effects.reputation < 0 ? "text-destructive" : "text-success")}>
                        {crisis.effects.reputation > 0 ? "+" : ""}{crisis.effects.reputation}%
                      </p>
                    </div>
                  )}
                  {crisis.effects.employees && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Employés</p>
                      <p className={cn("font-bold", crisis.effects.employees < 0 ? "text-destructive" : "text-success")}>
                        {crisis.effects.employees > 0 ? "+" : ""}{crisis.effects.employees}%
                      </p>
                    </div>
                  )}
                  {crisis.effects.costs && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Coûts</p>
                      <p className={cn("font-bold", crisis.effects.costs > 0 ? "text-destructive" : "text-success")}>
                        {crisis.effects.costs > 0 ? "+" : ""}{crisis.effects.costs}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Durée estimée:</span>
                  <span className="font-medium">{crisis.duration} mois</span>
                </div>

                {/* Response Options */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Options de Réponse
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {crisis.responses.map(response => (
                      <div 
                        key={response.id}
                        className="p-3 bg-card border border-border rounded-lg"
                      >
                        <h5 className="font-medium text-sm mb-1">{response.name}</h5>
                        <p className="text-xs text-muted-foreground mb-3">{response.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>
                            <span className="text-muted-foreground">Coût:</span>
                            <span className={cn("ml-1 font-medium", treasury < response.cost && "text-destructive")}>
                              {formatCurrency(response.cost)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Efficacité:</span>
                            <span className="ml-1 font-medium">{response.effectiveness}%</span>
                          </div>
                        </div>
                        
                        <div className="h-1.5 bg-secondary rounded-full mb-3">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              response.effectiveness >= 70 ? "bg-success" : 
                              response.effectiveness >= 50 ? "bg-warning" : "bg-destructive"
                            )}
                            style={{ width: `${response.effectiveness}%` }}
                          />
                        </div>
                        
                        <button
                          onClick={() => onRespondToCrisis(crisis.id, response.id)}
                          disabled={treasury < response.cost}
                          className={cn(
                            "w-full py-2 rounded-lg text-xs font-medium transition-colors",
                            treasury >= response.cost
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "bg-secondary text-muted-foreground cursor-not-allowed"
                          )}
                        >
                          {treasury < response.cost ? "Budget insuffisant" : "Appliquer"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Crisis Prevention Tips */}
      <div className="game-panel bg-gradient-to-br from-primary/10 to-primary/5">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Prévention des Crises
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Cybersécurité</h4>
              <p className="text-xs text-muted-foreground">Investissez dans les technologies de sécurité pour réduire les risques cyber.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Satisfaction RH</h4>
              <p className="text-xs text-muted-foreground">Maintenez un bon moral pour éviter les conflits sociaux.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Diversification</h4>
              <p className="text-xs text-muted-foreground">Diversifiez vos fournisseurs et marchés pour plus de résilience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
