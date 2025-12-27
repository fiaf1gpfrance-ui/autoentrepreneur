import { useState } from "react";
import { ForeignMarket, Subsidiary, Currency, COUNTRIES } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { 
  formatCurrencyWithSymbol, 
  convertCurrency,
} from "@/utils/internationalEngine";
import { GaugeBar } from "./GaugeBar";
import { 
  Globe, 
  TrendingUp, 
  Building2, 
  Plane,
  DollarSign,
  ArrowRightLeft,
  Flag,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InternationalPanelProps {
  foreignMarkets: ForeignMarket[];
  subsidiaries: Subsidiary[];
  exchangeRates: Record<Currency, number>;
  treasury: number;
  companyReputation: number;
  canExport: boolean;
  onEnterMarket: (countryId: string, strategy: 'export' | 'partnership' | 'subsidiary', investment: number) => void;
  onCreateSubsidiary: (marketId: string, capital: number) => void;
  onInvestInMarket: (marketId: string, amount: number) => void;
  onInvestInSubsidiary: (subsidiaryId: string, amount: number) => void;
  onEnableProductExport: (productId: string) => void;
}

const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CHF: 'CHF',
  JPY: '¥',
  CNY: '¥',
};

const countryFlags: Record<string, string> = {
  germany: '🇩🇪',
  uk: '🇬🇧',
  usa: '🇺🇸',
  switzerland: '🇨🇭',
  japan: '🇯🇵',
  china: '🇨🇳',
};

export function InternationalPanel({
  foreignMarkets,
  subsidiaries,
  exchangeRates,
  treasury,
  companyReputation,
  canExport,
  onEnterMarket,
  onCreateSubsidiary,
  onInvestInMarket,
  onInvestInSubsidiary,
}: InternationalPanelProps) {
  const [activeTab, setActiveTab] = useState<'markets' | 'currencies' | 'subsidiaries'>('markets');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<'export' | 'partnership' | 'subsidiary'>('export');
  const [investment, setInvestment] = useState(20000);

  const activeMarkets = foreignMarkets.filter(m => m.penetration > 0);
  const totalInternationalRevenue = activeMarkets.reduce((sum, m) => sum + m.revenue, 0);
  const subsidiaryRevenue = subsidiaries.reduce((sum, s) => sum + s.revenue, 0);

  const availableCountries = Object.entries(COUNTRIES).filter(
    ([id]) => !foreignMarkets.some(m => m.id === id && m.penetration > 0)
  );

  if (!canExport) {
    return (
      <div className="game-panel text-center py-12">
        <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-display font-semibold mb-2">Export non disponible</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Votre statut juridique (Auto-entrepreneur) ne permet pas l'export international.
          Passez en SARL ou SAS pour accéder aux marchés étrangers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="game-panel text-center">
          <Globe className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Marchés actifs</p>
          <p className="text-2xl font-bold text-primary">{activeMarkets.length}</p>
        </div>
        <div className="game-panel text-center">
          <TrendingUp className="w-6 h-6 text-success mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">CA International</p>
          <p className="text-xl font-bold text-success">{formatCurrency(totalInternationalRevenue)}</p>
        </div>
        <div className="game-panel text-center">
          <Building2 className="w-6 h-6 text-info mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Filiales</p>
          <p className="text-2xl font-bold">{subsidiaries.length}</p>
        </div>
        <div className="game-panel text-center">
          <DollarSign className="w-6 h-6 text-warning mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">CA Filiales</p>
          <p className="text-xl font-bold text-warning">{formatCurrency(subsidiaryRevenue)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'markets', label: 'Marchés', icon: Globe },
          { id: 'currencies', label: 'Devises', icon: ArrowRightLeft },
          { id: 'subsidiaries', label: 'Filiales', icon: Building2 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Markets Tab */}
      {activeTab === 'markets' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Available Markets */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Plane className="w-4 h-4" /> Nouveaux marchés
            </h4>
            
            {availableCountries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Vous êtes présent sur tous les marchés disponibles !
              </p>
            ) : (
              <div className="space-y-3">
                {availableCountries.map(([id, country]) => (
                  <div 
                    key={id}
                    className={cn(
                      "rounded-lg p-3 cursor-pointer transition-all border-2",
                      selectedCountry === id 
                        ? "bg-primary/10 border-primary" 
                        : "bg-secondary/50 border-transparent hover:border-primary/30"
                    )}
                    onClick={() => setSelectedCountry(id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{countryFlags[id] || '🌍'}</span>
                      <div className="flex-1">
                        <p className="font-medium">{country.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {currencySymbols[country.currency]} • Taille: {country.marketSize}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Barrière</span>
                        <p className={cn(
                          "font-medium",
                          country.entryBarrier < 40 ? "text-success" : country.entryBarrier < 60 ? "text-warning" : "text-destructive"
                        )}>
                          {country.entryBarrier}%
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Douanes</span>
                        <p className="font-medium">{(country.customsDuty * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impôt</span>
                        <p className="font-medium">{(country.taxRate * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCountry && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <h5 className="font-medium text-sm">Stratégie d'entrée</h5>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'export', label: 'Export', cost: '10k€', desc: 'Risque faible' },
                    { id: 'partnership', label: 'Partenariat', cost: '30k€', desc: 'Accès facilité' },
                    { id: 'subsidiary', label: 'Filiale', cost: '100k€', desc: 'Contrôle total' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setStrategy(opt.id as typeof strategy)}
                      className={cn(
                        "p-2 rounded-lg text-center text-xs transition-colors",
                        strategy === opt.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      <p className="font-medium">{opt.label}</p>
                      <p className="opacity-70">{opt.cost}</p>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">
                    Investissement additionnel: {formatCurrency(investment)}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={5000}
                    value={investment}
                    onChange={(e) => setInvestment(Number(e.target.value))}
                    className="w-full accent-primary mt-1"
                  />
                </div>

                <button
                  onClick={() => {
                    onEnterMarket(selectedCountry, strategy, investment);
                    setSelectedCountry(null);
                  }}
                  disabled={treasury < (strategy === 'export' ? 10000 : strategy === 'partnership' ? 30000 : 100000) + investment}
                  className="w-full btn-game-primary disabled:opacity-50"
                >
                  Entrer sur le marché
                </button>
              </div>
            )}
          </div>

          {/* Active Markets */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-success" /> Marchés actifs ({activeMarkets.length})
            </h4>
            
            {activeMarkets.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Aucun marché actif. Sélectionnez un pays pour commencer l'expansion.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeMarkets.map(market => (
                  <div key={market.id} className="bg-secondary/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{countryFlags[market.id] || '🌍'}</span>
                        <div>
                          <p className="font-medium text-sm">{market.country}</p>
                          <p className="text-xs text-muted-foreground">
                            {market.hasSubsidiary ? '🏢 Filiale' : market.localPartner ? '🤝 Partenariat' : '📦 Export'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-success">{formatCurrency(market.revenue)}/mois</p>
                        <p className="text-xs text-muted-foreground">
                          Douane: {(market.customsDuty * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                    
                    <GaugeBar 
                      value={market.penetration * 10} 
                      label={`Pénétration: ${market.penetration.toFixed(1)}%`} 
                      colorClass="bg-primary" 
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onInvestInMarket(market.id, 10000)}
                        disabled={treasury < 10000}
                        className="flex-1 btn-game-secondary text-xs py-1 disabled:opacity-50"
                      >
                        Investir 10k€
                      </button>
                      {!market.hasSubsidiary && (
                        <button
                          onClick={() => onCreateSubsidiary(market.id, 50000)}
                          disabled={treasury < 100000}
                          className="flex-1 btn-game-primary text-xs py-1 disabled:opacity-50"
                        >
                          Ouvrir filiale
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Currencies Tab */}
      {activeTab === 'currencies' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" /> Taux de change (base EUR)
          </h4>
          
          <div className="grid grid-cols-3 gap-4">
            {(Object.entries(exchangeRates) as [Currency, number][]).map(([currency, rate]) => {
              if (currency === 'EUR') return null;
              const countryInfo = Object.values(COUNTRIES).find(c => c.currency === currency);
              
              return (
                <div key={currency} className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold text-primary">{currencySymbols[currency]}</span>
                    <div>
                      <p className="font-medium">{currency}</p>
                      <p className="text-xs text-muted-foreground">{countryInfo?.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">1 EUR =</span>
                      <span className="font-bold">{rate.toFixed(4)} {currency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">1 {currency} =</span>
                      <span className="font-medium">{(1/rate).toFixed(4)} EUR</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Conversion exemple:</p>
                    <p className="text-sm font-medium">
                      10 000€ = {formatCurrencyWithSymbol(Math.round(10000 * rate), currency)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 bg-info/10 border border-info/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-info shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Risque de change</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Les taux de change fluctuent quotidiennement selon la météo économique.
                  En période de crise, la volatilité est plus importante.
                  Vos revenus internationaux sont automatiquement convertis en EUR.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subsidiaries Tab */}
      {activeTab === 'subsidiaries' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Filiales étrangères ({subsidiaries.length})
          </h4>
          
          {subsidiaries.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">Aucune filiale étrangère.</p>
              <p className="text-sm text-muted-foreground">
                Ouvrez une filiale dans un marché actif pour maximiser votre présence locale.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {subsidiaries.map(subsidiary => (
                <div key={subsidiary.id} className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-display font-semibold">{subsidiary.name}</p>
                        <p className="text-xs text-muted-foreground">{subsidiary.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-background/50 rounded-lg p-2 text-center">
                      <Users className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Employés</p>
                      <p className="font-bold">{subsidiary.employees}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 text-center">
                      <DollarSign className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Trésorerie</p>
                      <p className={cn("font-bold", subsidiary.treasury >= 0 ? "text-success" : "text-destructive")}>
                        {formatCurrency(subsidiary.treasury)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">CA mensuel</span>
                      <p className="font-medium text-success">{formatCurrency(subsidiary.revenue)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground">Charges</span>
                      <p className="font-medium text-destructive">{formatCurrency(subsidiary.expenses)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onInvestInSubsidiary(subsidiary.id, 20000)}
                    disabled={treasury < 20000}
                    className="w-full btn-game-secondary text-xs py-2 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3" /> Investir 20k€
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
