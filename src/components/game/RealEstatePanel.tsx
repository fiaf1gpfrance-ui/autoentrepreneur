import { useState } from "react";
import { Property, PropertyType, LeaseType } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { GaugeBar } from "./GaugeBar";
import { Building, Home, Factory, Store, Building2, Plus, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface RealEstatePanelProps {
  properties: Property[];
  treasury: number;
  employeeCount: number;
  onBuyProperty: (property: Partial<Property>) => void;
  onRentProperty: (property: Partial<Property>) => void;
  onSellProperty: (id: string) => void;
  onMaintenance: (id: string) => void;
}

const propertyTypeConfig: Record<PropertyType, { label: string; icon: typeof Building; baseRent: number; baseCost: number }> = {
  bureau: { label: "Bureau", icon: Building, baseRent: 2000, baseCost: 200000 },
  entrepot: { label: "Entrepôt", icon: Home, baseRent: 1500, baseCost: 150000 },
  usine: { label: "Usine", icon: Factory, baseRent: 5000, baseCost: 500000 },
  boutique: { label: "Boutique", icon: Store, baseRent: 3000, baseCost: 300000 },
  siege_social: { label: "Siège Social", icon: Building2, baseRent: 10000, baseCost: 1000000 },
};

const availableProperties: Partial<Property>[] = [
  { name: "Bureau Standard", type: 'bureau', size: 100, maxEmployees: 10, moralBonus: 5, productivityBonus: 0, prestige: 3, location: "Banlieue" },
  { name: "Bureau Premium", type: 'bureau', size: 200, maxEmployees: 25, moralBonus: 10, productivityBonus: 5, prestige: 6, location: "Centre-ville" },
  { name: "Open Space Moderne", type: 'bureau', size: 300, maxEmployees: 40, moralBonus: 15, productivityBonus: 10, prestige: 8, location: "Quartier d'affaires" },
  { name: "Petit Entrepôt", type: 'entrepot', size: 500, maxEmployees: 5, moralBonus: 0, productivityBonus: 10, prestige: 2, location: "Zone industrielle" },
  { name: "Grand Entrepôt", type: 'entrepot', size: 2000, maxEmployees: 15, moralBonus: 0, productivityBonus: 20, prestige: 3, location: "Zone industrielle" },
  { name: "Atelier de Production", type: 'usine', size: 1000, maxEmployees: 30, moralBonus: -5, productivityBonus: 25, prestige: 4, location: "Zone industrielle" },
  { name: "Usine Moderne", type: 'usine', size: 5000, maxEmployees: 100, moralBonus: 5, productivityBonus: 35, prestige: 7, location: "Parc industriel" },
  { name: "Boutique de Quartier", type: 'boutique', size: 50, maxEmployees: 5, moralBonus: 10, productivityBonus: 0, prestige: 4, location: "Centre-ville" },
  { name: "Flagship Store", type: 'boutique', size: 200, maxEmployees: 20, moralBonus: 15, productivityBonus: 5, prestige: 9, location: "Avenue prestigieuse" },
  { name: "Siège Corporate", type: 'siege_social', size: 1000, maxEmployees: 150, moralBonus: 20, productivityBonus: 15, prestige: 10, location: "Tour de La Défense" },
];

export function RealEstatePanel({
  properties,
  treasury,
  employeeCount,
  onBuyProperty,
  onRentProperty,
  onSellProperty,
  onMaintenance,
}: RealEstatePanelProps) {
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');
  const [showMarket, setShowMarket] = useState(true);

  const totalCapacity = properties.reduce((sum, p) => sum + p.maxEmployees, 0);
  const totalRent = properties.filter(p => p.leaseType === 'location').reduce((sum, p) => sum + (p.monthlyRent || 0), 0);
  const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0);

  const filteredMarket = selectedType === 'all' 
    ? availableProperties 
    : availableProperties.filter(p => p.type === selectedType);

  const calculatePrice = (prop: Partial<Property>, lease: LeaseType): number => {
    const config = propertyTypeConfig[prop.type!];
    const sizeMultiplier = (prop.size || 100) / 100;
    const prestigeMultiplier = 1 + ((prop.prestige || 5) * 0.1);
    
    if (lease === 'achat') {
      return Math.round(config.baseCost * sizeMultiplier * prestigeMultiplier);
    }
    return Math.round(config.baseRent * sizeMultiplier * prestigeMultiplier);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="game-panel">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Locaux</p>
            <p className="text-2xl font-display font-bold text-primary">{properties.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Capacité totale</p>
            <p className={cn(
              "text-xl font-bold",
              employeeCount > totalCapacity ? "text-destructive" : "text-success"
            )}>
              {employeeCount}/{totalCapacity}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Loyers mensuels</p>
            <p className="text-xl font-bold text-warning">{formatCurrency(totalRent)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Valeur immobilière</p>
            <p className="text-xl font-bold text-success">{formatCurrency(totalValue)}</p>
          </div>
        </div>

        {employeeCount > totalCapacity && (
          <div className="mt-3 bg-destructive/10 border border-destructive/20 rounded-lg p-2 text-sm text-destructive">
            ⚠️ Capacité dépassée ! Le moral et la productivité sont impactés.
          </div>
        )}
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowMarket(true)}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
            showMarket ? "bg-primary text-primary-foreground" : "bg-secondary"
          )}
        >
          Marché immobilier
        </button>
        <button
          onClick={() => setShowMarket(false)}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
            !showMarket ? "bg-primary text-primary-foreground" : "bg-secondary"
          )}
        >
          Mes locaux ({properties.length})
        </button>
      </div>

      {showMarket ? (
        <>
          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedType('all')}
              className={cn(
                "px-3 py-1 rounded-lg text-sm transition-colors",
                selectedType === 'all' ? "bg-primary text-primary-foreground" : "bg-secondary"
              )}
            >
              Tous
            </button>
            {Object.entries(propertyTypeConfig).map(([type, config]) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as PropertyType)}
                className={cn(
                  "px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors",
                  selectedType === type ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}
              >
                <config.icon className="w-3 h-3" />
                {config.label}
              </button>
            ))}
          </div>

          {/* Market Listings */}
          <div className="grid grid-cols-2 gap-4">
            {filteredMarket.map((prop, idx) => {
              const config = propertyTypeConfig[prop.type!];
              const Icon = config.icon;
              const buyPrice = calculatePrice(prop, 'achat');
              const rentPrice = calculatePrice(prop, 'location');

              return (
                <div key={idx} className="game-panel">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-semibold text-sm">{prop.name}</h4>
                      <p className="text-xs text-muted-foreground">{prop.location}</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: prop.prestige || 0 }).map((_, i) => (
                        <span key={i} className="text-warning text-xs">★</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-muted-foreground">Surface</span>
                      <p className="font-medium">{prop.size} m²</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capacité</span>
                      <p className="font-medium">{prop.maxEmployees} pers.</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Moral</span>
                      <p className={cn("font-medium", (prop.moralBonus || 0) >= 0 ? "text-success" : "text-destructive")}>
                        {(prop.moralBonus || 0) >= 0 ? "+" : ""}{prop.moralBonus}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onRentProperty({ ...prop, monthlyRent: rentPrice, leaseType: 'location' })}
                      className="flex-1 btn-game-secondary text-xs py-2"
                    >
                      Louer {formatCurrency(rentPrice)}/mois
                    </button>
                    <button
                      onClick={() => onBuyProperty({ ...prop, purchasePrice: buyPrice, leaseType: 'achat' })}
                      disabled={treasury < buyPrice}
                      className="flex-1 btn-game-primary text-xs py-2 disabled:opacity-50"
                    >
                      Acheter {formatCurrency(buyPrice)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* My Properties */
        <div className="grid grid-cols-2 gap-4">
          {properties.length === 0 ? (
            <div className="col-span-2 game-panel text-center py-8">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun local. Louez ou achetez des locaux pour vos employés.</p>
            </div>
          ) : (
            properties.map(prop => {
              const config = propertyTypeConfig[prop.type];
              const Icon = config.icon;

              return (
                <div key={prop.id} className="game-panel">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-semibold text-sm">{prop.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {prop.location} • {prop.leaseType === 'location' ? 'Location' : 'Propriété'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <GaugeBar value={prop.condition} label="État" colorClass={prop.condition >= 70 ? "bg-success" : prop.condition >= 40 ? "bg-warning" : "bg-destructive"} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-muted-foreground">Capacité</span>
                      <p className="font-medium">{prop.maxEmployees} pers.</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {prop.leaseType === 'location' ? 'Loyer' : 'Valeur'}
                      </span>
                      <p className="font-medium">
                        {prop.leaseType === 'location' 
                          ? `${formatCurrency(prop.monthlyRent || 0)}/mois`
                          : formatCurrency(prop.currentValue)
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onMaintenance(prop.id)}
                      disabled={prop.condition >= 95 || treasury < prop.maintenanceCost}
                      className="flex-1 btn-game-secondary text-xs py-1 flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <Wrench className="w-3 h-3" /> Entretien ({formatCurrency(prop.maintenanceCost)})
                    </button>
                    {prop.leaseType === 'achat' && (
                      <button
                        onClick={() => onSellProperty(prop.id)}
                        className="flex-1 btn-game-destructive text-xs py-1"
                      >
                        Vendre
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
