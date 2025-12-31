import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, DollarSign, Users, Building2, AlertTriangle,
  Check, X, ArrowRight, Sparkles, BarChart3
} from "lucide-react";
import { formatCurrency } from "@/utils/gameEngine";

interface IPOPanelProps {
  companyValue: number;
  revenue: number;
  employees: number;
  credibility: number;
  treasury: number;
  isIPO: boolean;
  onStartIPO?: (valuation: number, sharesPercent: number) => void;
}

interface IPORequirement {
  id: string;
  label: string;
  current: number;
  required: number;
  met: boolean;
}

export function IPOPanel({ 
  companyValue, 
  revenue, 
  employees, 
  credibility,
  treasury,
  isIPO,
  onStartIPO 
}: IPOPanelProps) {
  const [selectedValuation, setSelectedValuation] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [sharesPercent, setSharesPercent] = useState(25);

  const requirements: IPORequirement[] = [
    { id: 'value', label: 'Valorisation', current: companyValue, required: 10000000, met: companyValue >= 10000000 },
    { id: 'revenue', label: 'CA annuel', current: revenue * 12, required: 2000000, met: revenue * 12 >= 2000000 },
    { id: 'employees', label: 'Employés', current: employees, required: 50, met: employees >= 50 },
    { id: 'credibility', label: 'Crédibilité', current: credibility, required: 80, met: credibility >= 80 },
  ];

  const allRequirementsMet = requirements.every(r => r.met);

  const valuationMultipliers = {
    conservative: 0.8,
    moderate: 1,
    aggressive: 1.3,
  };

  const estimatedValuation = companyValue * valuationMultipliers[selectedValuation];
  const fundsRaised = estimatedValuation * (sharesPercent / 100);

  if (isIPO) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8 rounded-xl bg-gradient-to-br from-success/20 to-emerald-500/20 border border-success/30">
          <Sparkles className="w-12 h-12 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Entreprise cotée en bourse!</h2>
          <p className="text-muted-foreground">Votre entreprise est maintenant publique.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs text-muted-foreground">Capitalisation boursière</span>
            <p className="text-lg font-bold text-success">{formatCurrency(estimatedValuation)}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs text-muted-foreground">Volume quotidien</span>
            <p className="text-lg font-bold">12.5K actions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Introduction en Bourse (IPO)</h2>
          <p className="text-sm text-muted-foreground">Ouvrez votre capital au public</p>
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Conditions requises
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {requirements.map(req => (
            <div 
              key={req.id}
              className={cn(
                "p-3 rounded-lg border transition-all",
                req.met 
                  ? "bg-success/10 border-success/30" 
                  : "bg-destructive/10 border-destructive/30"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{req.label}</span>
                {req.met ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <X className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold">
                  {req.id === 'value' || req.id === 'revenue' 
                    ? formatCurrency(req.current)
                    : req.id === 'credibility' 
                      ? `${req.current}%`
                      : req.current
                  }
                </span>
                <span className="text-xs text-muted-foreground">
                  / {req.id === 'value' || req.id === 'revenue' 
                      ? formatCurrency(req.required)
                      : req.id === 'credibility'
                        ? `${req.required}%`
                        : req.required
                    }
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Valuation Strategy */}
      {allRequirementsMet && (
        <>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Stratégie de valorisation</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'conservative', label: 'Prudente', mult: 'x0.8', color: 'text-blue-400' },
                { id: 'moderate', label: 'Modérée', mult: 'x1.0', color: 'text-primary' },
                { id: 'aggressive', label: 'Aggressive', mult: 'x1.3', color: 'text-orange-400' },
              ].map(({ id, label, mult, color }) => (
                <button
                  key={id}
                  onClick={() => setSelectedValuation(id as any)}
                  className={cn(
                    "p-3 rounded-lg border transition-all text-center",
                    selectedValuation === id
                      ? "bg-primary/20 border-primary"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                >
                  <span className="text-xs block">{label}</span>
                  <span className={cn("font-bold", color)}>{mult}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shares to sell */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Parts à vendre</h3>
              <span className="font-bold text-primary">{sharesPercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="49"
              value={sharesPercent}
              onChange={(e) => setSharesPercent(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10% (Conservateur)</span>
              <span>49% (Maximum)</span>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs text-muted-foreground">Valorisation estimée</span>
                <p className="text-lg font-bold text-primary">{formatCurrency(estimatedValuation)}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Fonds levés</span>
                <p className="text-lg font-bold text-success">{formatCurrency(fundsRaised)}</p>
              </div>
            </div>
            
            <button
              onClick={() => onStartIPO?.(estimatedValuation, sharesPercent)}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
            >
              Lancer l'IPO
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {!allRequirementsMet && (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Conditions non remplies</p>
              <p className="text-xs text-muted-foreground mt-1">
                Développez votre entreprise pour atteindre les seuils requis avant de pouvoir lancer une IPO.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
