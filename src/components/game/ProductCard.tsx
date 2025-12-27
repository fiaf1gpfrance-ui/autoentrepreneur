import { Product } from "@/types/game";
import { formatCurrency, formatPercent } from "@/utils/gameEngine";
import { GaugeBar } from "./GaugeBar";
import { Package, TrendingUp, Megaphone, FlaskConical, Rocket, Crown, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onUpdatePrice?: (id: string, price: number) => void;
  onUpdateMarketing?: (id: string, budget: number) => void;
}

const phaseConfig = {
  rd: { label: "R&D", icon: FlaskConical, color: "text-purple-400" },
  lancement: { label: "Lancement", icon: Rocket, color: "text-warning" },
  maturite: { label: "Maturité", icon: Crown, color: "text-success" },
  declin: { label: "Déclin", icon: TrendingDown, color: "text-destructive" },
};

export function ProductCard({ product, onUpdatePrice, onUpdateMarketing }: ProductCardProps) {
  const phase = phaseConfig[product.phase];
  const PhaseIcon = phase.icon;

  return (
    <div className="game-panel space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm">{product.name}</h4>
            <p className={cn("text-xs flex items-center gap-1", phase.color)}>
              <PhaseIcon className="w-3 h-3" />
              {phase.label}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-success">{formatCurrency(product.currentPrice)}</p>
          <p className="text-xs text-muted-foreground">par unité</p>
        </div>
      </div>

      {product.phase === 'rd' ? (
        <div className="space-y-2">
          <GaugeBar 
            value={product.rdProgress} 
            label="Progression R&D" 
            colorClass="bg-purple-500"
          />
          <p className="text-xs text-muted-foreground">
            Investissement: {formatCurrency(product.rdCost)}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Ventes/mois</span>
              <p className="font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-success" />
                {product.salesVolume} unités
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">CA mensuel</span>
              <p className="font-medium text-success">
                {formatCurrency(product.salesVolume * product.currentPrice)}
              </p>
            </div>
          </div>

          <GaugeBar 
            value={product.quality} 
            label="Qualité" 
            colorClass="bg-primary"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Megaphone className="w-3 h-3" />
                Budget Marketing
              </span>
              <span className="font-medium">{formatCurrency(product.marketingBudget)}/mois</span>
            </div>
            {onUpdateMarketing && (
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={product.marketingBudget}
                onChange={(e) => onUpdateMarketing(product.id, Number(e.target.value))}
                className="w-full accent-primary"
              />
            )}
          </div>

          {onUpdatePrice && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdatePrice(product.id, Math.max(1, product.currentPrice - 10))}
                className="btn-game-secondary text-xs px-2 py-1"
              >
                -10€
              </button>
              <span className="flex-1 text-center text-sm font-medium">
                {formatCurrency(product.currentPrice)}
              </span>
              <button
                onClick={() => onUpdatePrice(product.id, product.currentPrice + 10)}
                className="btn-game-secondary text-xs px-2 py-1"
              >
                +10€
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
