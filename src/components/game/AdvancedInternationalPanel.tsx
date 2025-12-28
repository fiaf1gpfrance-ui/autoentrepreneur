import { useState } from "react";
import { 
  Globe, MapPin, TrendingUp, Building, Users, Shield, 
  AlertTriangle, DollarSign, Plane, FileCheck, BarChart3,
  ChevronRight, Check, Clock
} from "lucide-react";
import { 
  analyzeCountry, 
  getAllCountryAnalyses,
  calculateCountryScore,
  rankCountriesByPotential,
  createMarketEntry,
  calculateEntryProgress,
  estimateEntryROI,
  findLocalPartners,
  evaluatePartner,
  getRequiredApprovals,
  calculateCustomsDuty,
  calculateCurrencyExposure,
  recommendHedgingStrategy,
} from "@/utils/advancedInternationalEngine";
import { CountryAnalysis, MarketEntry, LocalPartner, MarketEntryMode } from "@/types/advancedFeatures";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AdvancedInternationalPanelProps {
  treasury: number;
  onInvest: (amount: number, country: string, mode: MarketEntryMode) => void;
}

const countryFlags: Record<string, string> = {
  USA: "🇺🇸", CHN: "🇨🇳", DEU: "🇩🇪", JPN: "🇯🇵", GBR: "🇬🇧",
  IND: "🇮🇳", BRA: "🇧🇷", FRA: "🇫🇷", CAN: "🇨🇦", AUS: "🇦🇺",
  KOR: "🇰🇷", MEX: "🇲🇽", ESP: "🇪🇸", ITA: "🇮🇹", NLD: "🇳🇱",
  CHE: "🇨🇭", SGP: "🇸🇬", UAE: "🇦🇪", RUS: "🇷🇺", SAU: "🇸🇦",
};

const countryNames: Record<string, string> = {
  USA: "États-Unis", CHN: "Chine", DEU: "Allemagne", JPN: "Japon", GBR: "Royaume-Uni",
  IND: "Inde", BRA: "Brésil", FRA: "France", CAN: "Canada", AUS: "Australie",
  KOR: "Corée du Sud", MEX: "Mexique", ESP: "Espagne", ITA: "Italie", NLD: "Pays-Bas",
  CHE: "Suisse", SGP: "Singapour", UAE: "Émirats", RUS: "Russie", SAU: "Arabie Saoudite",
};

const modeLabels: Record<MarketEntryMode, string> = {
  export: "Export Direct",
  license: "Licence",
  franchise: "Franchise",
  joint_venture: "Joint Venture",
  acquisition: "Acquisition",
  greenfield: "Greenfield",
};

const modeDescriptions: Record<MarketEntryMode, string> = {
  export: "Vente directe depuis la France, faible investissement",
  license: "Accord de licence avec un partenaire local",
  franchise: "Développement de franchise dans le pays",
  joint_venture: "Création d'une co-entreprise",
  acquisition: "Rachat d'une entreprise locale existante",
  greenfield: "Création complète d'une filiale depuis zéro",
};

const modeCosts: Record<MarketEntryMode, number> = {
  export: 10000, license: 50000, franchise: 100000, 
  joint_venture: 250000, acquisition: 500000, greenfield: 1000000,
};

export function AdvancedInternationalPanel({ treasury, onInvest }: AdvancedInternationalPanelProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'entries' | 'partners' | 'currency'>('analysis');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [marketEntries, setMarketEntries] = useState<MarketEntry[]>([]);
  const [partners, setPartners] = useState<LocalPartner[]>([]);
  
  const allCountries = getAllCountryAnalyses();
  const rankedCountries = rankCountriesByPotential(allCountries);
  
  const selectedAnalysis = selectedCountry ? analyzeCountry(selectedCountry) : null;

  const handleStartEntry = (country: string, mode: MarketEntryMode) => {
    const cost = modeCosts[mode];
    if (treasury < cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }
    
    const entry = createMarketEntry(country, mode, cost);
    setMarketEntries(prev => [...prev, entry]);
    onInvest(cost, country, mode);
    toast.success(`Expansion ${modeLabels[mode]} lancée en ${countryNames[country]} !`);
  };

  const handleFindPartners = (country: string) => {
    const newPartners = findLocalPartners(country, 'distributor');
    setPartners(prev => [...prev, ...newPartners]);
    toast.success(`${newPartners.length} partenaires trouvés en ${countryNames[country]}`);
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 2) return "text-success";
    if (risk <= 4) return "text-warning";
    if (risk <= 6) return "text-orange-400";
    return "text-destructive";
  };

  const getRecommendationBadge = (rec: string) => {
    const colors: Record<string, string> = {
      high: "bg-success/20 text-success",
      medium: "bg-warning/20 text-warning",
      low: "bg-orange-500/20 text-orange-400",
      avoid: "bg-destructive/20 text-destructive",
    };
    const labels: Record<string, string> = {
      high: "Recommandé", medium: "Potentiel", low: "Risqué", avoid: "À éviter",
    };
    return (
      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", colors[rec])}>
        {labels[rec]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="game-panel flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-primary" />
          <h2 className="font-display font-bold text-xl">Expansion Internationale Avancée</h2>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{marketEntries.length} marchés en développement</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-success" />
            <span>{partners.length} partenaires</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {[
          { id: 'analysis', label: 'Analyse Pays', icon: BarChart3 },
          { id: 'entries', label: 'Entrées Marché', icon: TrendingUp },
          { id: 'partners', label: 'Partenaires', icon: Users },
          { id: 'currency', label: 'Devises & Risques', icon: DollarSign },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Country Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Country List */}
          <div className="col-span-12 lg:col-span-4 space-y-2 max-h-[600px] overflow-y-auto">
            {rankedCountries.map((country, i) => {
              const score = calculateCountryScore(country);
              return (
                <button
                  key={country.id}
                  onClick={() => setSelectedCountry(country.country)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
                    selectedCountry === country.country ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  <span className="text-2xl">{countryFlags[country.country] || "🌍"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{countryNames[country.country] || country.country}</p>
                      {i < 3 && <span className="text-xs">🏆 Top {i + 1}</span>}
                    </div>
                    <p className="text-xs opacity-80">Score: {Math.round(score)}/100</p>
                  </div>
                  {getRecommendationBadge(country.recommendation)}
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Country Details */}
          <div className="col-span-12 lg:col-span-8">
            {selectedAnalysis ? (
              <div className="game-panel space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{countryFlags[selectedAnalysis.country] || "🌍"}</span>
                  <div>
                    <h3 className="font-display font-bold text-2xl">{countryNames[selectedAnalysis.country]}</h3>
                    {getRecommendationBadge(selectedAnalysis.recommendation)}
                  </div>
                </div>

                {/* Economic Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">PIB</p>
                    <p className="text-lg font-bold">${selectedAnalysis.gdp}B</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Croissance PIB</p>
                    <p className={cn("text-lg font-bold", selectedAnalysis.gdpGrowth >= 0 ? "text-success" : "text-destructive")}>
                      {selectedAnalysis.gdpGrowth}%
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Inflation</p>
                    <p className="text-lg font-bold">{selectedAnalysis.inflation}%</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Population</p>
                    <p className="text-lg font-bold">{selectedAnalysis.population}M</p>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div>
                  <h4 className="font-semibold mb-3">Analyse des Risques</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Risque Politique</span>
                        <span className={getRiskColor(selectedAnalysis.politicalRisk)}>{selectedAnalysis.politicalRisk}/10</span>
                      </div>
                      <div className="bg-secondary rounded-full h-2">
                        <div className={cn("h-full rounded-full", getRiskColor(selectedAnalysis.politicalRisk).replace('text', 'bg'))} 
                          style={{ width: `${selectedAnalysis.politicalRisk * 10}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Risque Économique</span>
                        <span className={getRiskColor(selectedAnalysis.economicRisk)}>{selectedAnalysis.economicRisk}/10</span>
                      </div>
                      <div className="bg-secondary rounded-full h-2">
                        <div className={cn("h-full rounded-full", getRiskColor(selectedAnalysis.economicRisk).replace('text', 'bg'))} 
                          style={{ width: `${selectedAnalysis.economicRisk * 10}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Risque Légal</span>
                        <span className={getRiskColor(selectedAnalysis.legalRisk)}>{selectedAnalysis.legalRisk}/10</span>
                      </div>
                      <div className="bg-secondary rounded-full h-2">
                        <div className={cn("h-full rounded-full", getRiskColor(selectedAnalysis.legalRisk).replace('text', 'bg'))} 
                          style={{ width: `${selectedAnalysis.legalRisk * 10}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Distance Culturelle</span>
                        <span className={getRiskColor(selectedAnalysis.culturalDistance)}>{selectedAnalysis.culturalDistance}/10</span>
                      </div>
                      <div className="bg-secondary rounded-full h-2">
                        <div className={cn("h-full rounded-full", getRiskColor(selectedAnalysis.culturalDistance).replace('text', 'bg'))} 
                          style={{ width: `${selectedAnalysis.culturalDistance * 10}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entry Modes */}
                <div>
                  <h4 className="font-semibold mb-3">Modes d'Entrée</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(Object.keys(modeLabels) as MarketEntryMode[]).map(mode => {
                      const cost = modeCosts[mode];
                      const canAfford = treasury >= cost;
                      const roi = estimateEntryROI(createMarketEntry(selectedAnalysis.country, mode, cost), selectedAnalysis.marketSize);
                      
                      return (
                        <div key={mode} className="bg-secondary rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-sm">{modeLabels[mode]}</h5>
                            <span className="text-xs text-primary font-bold">{(cost / 1000).toFixed(0)}K€</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{modeDescriptions[mode]}</p>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span>ROI estimé: <span className="text-success">{roi.roi.toFixed(0)}%</span></span>
                            <span>Break-even: {roi.years} ans</span>
                          </div>
                          <button
                            onClick={() => handleStartEntry(selectedAnalysis.country, mode)}
                            disabled={!canAfford}
                            className={cn(
                              "w-full py-1.5 rounded text-xs font-bold transition-colors",
                              canAfford ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}
                          >
                            Lancer l'expansion
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Find Partners Button */}
                <button
                  onClick={() => handleFindPartners(selectedAnalysis.country)}
                  className="w-full py-3 bg-secondary hover:bg-secondary/80 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  Rechercher des partenaires locaux
                </button>
              </div>
            ) : (
              <div className="game-panel text-center py-16">
                <Globe className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Sélectionnez un pays pour voir l'analyse détaillée</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Market Entries Tab */}
      {activeTab === 'entries' && (
        <div className="space-y-4">
          {marketEntries.length === 0 ? (
            <div className="game-panel text-center py-16">
              <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Aucune expansion en cours</p>
              <p className="text-sm text-muted-foreground">Analysez les pays et lancez votre première expansion</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketEntries.map(entry => {
                const progress = calculateEntryProgress(entry);
                const completedMilestones = entry.milestones.filter(m => m.completed).length;
                
                return (
                  <div key={entry.id} className="game-panel border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{countryFlags[entry.countryId]}</span>
                      <div>
                        <h4 className="font-semibold">{countryNames[entry.countryId]}</h4>
                        <p className="text-xs text-muted-foreground">{modeLabels[entry.mode]}</p>
                      </div>
                      <span className={cn(
                        "ml-auto text-xs px-2 py-0.5 rounded-full",
                        entry.status === 'operational' ? "bg-success/20 text-success" :
                        entry.status === 'execution' ? "bg-primary/20 text-primary" :
                        "bg-secondary text-muted-foreground"
                      )}>
                        {entry.status === 'planning' ? 'Planification' : 
                         entry.status === 'execution' ? 'Exécution' : 'Opérationnel'}
                      </span>
                    </div>
                    
                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progression</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="bg-secondary rounded-full h-2">
                        <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    
                    {/* Milestones */}
                    <div className="space-y-1">
                      {entry.milestones.slice(0, 3).map(m => (
                        <div key={m.id} className="flex items-center gap-2 text-xs">
                          {m.completed ? (
                            <Check className="w-3 h-3 text-success" />
                          ) : (
                            <Clock className="w-3 h-3 text-muted-foreground" />
                          )}
                          <span className={m.completed ? "text-success" : "text-muted-foreground"}>{m.name}</span>
                        </div>
                      ))}
                      {entry.milestones.length > 3 && (
                        <p className="text-xs text-muted-foreground">+{entry.milestones.length - 3} autres étapes</p>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                      Investissement: {(entry.investment / 1000).toFixed(0)}K€
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Partners Tab */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          {partners.length === 0 ? (
            <div className="game-panel text-center py-16">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun partenaire local</p>
              <p className="text-sm text-muted-foreground mt-2">Recherchez des partenaires dans l'onglet Analyse Pays</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map(partner => {
                const evaluation = evaluatePartner(partner);
                return (
                  <div key={partner.id} className="game-panel border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <Building className="w-8 h-8 text-primary" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{partner.name}</h4>
                        <p className="text-xs text-muted-foreground">{countryFlags[partner.country]} {partner.type}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Performance</p>
                        <p className="font-semibold">{Math.round(partner.performance)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Relation</p>
                        <p className="font-semibold">{Math.round(partner.relationshipScore)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CA annuel</p>
                        <p className="font-semibold text-success">{(partner.revenue / 1000).toFixed(0)}K€</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Score</p>
                        <p className="font-semibold text-primary">{Math.round(evaluation.score)}/100</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground italic">{evaluation.recommendation}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Currency Tab */}
      {activeTab === 'currency' && (
        <div className="game-panel">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Gestion des Devises & Risques de Change
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CHF'].map(currency => {
              const exposure = calculateCurrencyExposure(currency, 100000, 50000, 200000, 150000);
              return (
                <div key={currency} className="bg-secondary rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{currency}</span>
                    <span className={cn("text-sm font-semibold", exposure.netExposure >= 0 ? "text-success" : "text-destructive")}>
                      {exposure.netExposure >= 0 ? '+' : ''}{(exposure.netExposure / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Actifs</span>
                      <span>{(exposure.assets / 1000).toFixed(0)}K€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passifs</span>
                      <span>{(exposure.liabilities / 1000).toFixed(0)}K€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Couverture</span>
                      <span className="text-primary">{(exposure.hedgedAmount / 1000).toFixed(0)}K€</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Recommandations de Couverture
            </h4>
            <div className="space-y-2">
              {recommendHedgingStrategy([
                calculateCurrencyExposure('USD', 100000, 20000, 300000, 100000),
                calculateCurrencyExposure('GBP', 50000, 80000, 100000, 150000),
              ]).map((rec, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{rec.currency}: {rec.action}</span>
                  <span className="font-semibold">{(rec.amount / 1000).toFixed(0)}K€</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
