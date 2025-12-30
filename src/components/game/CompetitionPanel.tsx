import { useState } from "react";
import { Company, Competitor } from "@/types/game";
import { 
  CompetitorAI, 
  MarketIntelligence,
  ESPIONAGE_ACTIONS,
  COMPETITOR_TEMPLATES,
} from "@/types/competition";
import { 
  initializeCompetitors,
  updateCompetitorActions,
  performEspionage,
  calculateMarketShare,
  getMarketIntelligence,
  launchCompetitiveAction,
} from "@/utils/competitionEngine";
import { formatCurrency, formatPercent } from "@/utils/gameEngine";
import { 
  Target, 
  Eye, 
  Swords,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Zap,
  BarChart3,
  Users,
  DollarSign,
  Star,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CompetitionPanelProps {
  company: Company;
  day: number;
  onEspionage: (action: string, targetId: string, cost: number) => void;
  onCompetitiveAction: (action: string, cost: number) => void;
}

export function CompetitionPanel({ 
  company, 
  day,
  onEspionage,
  onCompetitiveAction,
}: CompetitionPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors' | 'espionage' | 'actions'>('overview');
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null);

  // Initialize data if not present
  const competitors = company.competitorsAI || initializeCompetitors(company.sector);
  const marketShare = calculateMarketShare(company, competitors);
  const intelligence = getMarketIntelligence(company, competitors, day);

  const tabs = [
    { id: 'overview', label: 'Marché', icon: BarChart3 },
    { id: 'competitors', label: 'Concurrents', icon: Users },
    { id: 'espionage', label: 'Renseignement', icon: Eye },
    { id: 'actions', label: 'Actions', icon: Swords },
  ] as const;

  const handlePerformEspionage = (actionId: string) => {
    if (!selectedCompetitorId) {
      toast.error("Sélectionnez d'abord un concurrent");
      return;
    }
    
    const action = ESPIONAGE_ACTIONS.find(a => a.id === actionId);
    if (!action) return;
    
    if (company.treasury < action.cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }
    
    onEspionage(actionId, selectedCompetitorId, action.cost);
  };

  const handleLaunchAction = (actionType: string, cost: number) => {
    if (company.treasury < cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }
    onCompetitiveAction(actionType, cost);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Market Share Chart */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Parts de marché
        </h3>
        <div className="space-y-3">
          {/* Your company */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-primary">{company.name} (Vous)</span>
              <span className="text-sm font-bold text-primary">{formatPercent(marketShare.yourShare * 100)}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-4">
              <div 
                className="bg-primary rounded-full h-4 transition-all"
                style={{ width: `${marketShare.yourShare * 100}%` }}
              />
            </div>
          </div>
          
          {/* Competitors */}
          {competitors.slice(0, 5).map((comp, index) => {
            const colors = ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-green-500', 'bg-red-500'];
            return (
              <div key={comp.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{comp.name}</span>
                  <span className="text-sm font-medium">{formatPercent(comp.marketShare * 100)}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div 
                    className={cn("rounded-full h-3 transition-all", colors[index % colors.length])}
                    style={{ width: `${comp.marketShare * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Intelligence Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="game-panel p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Position concurrentielle</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            intelligence.positionScore > 60 ? "text-success" :
            intelligence.positionScore > 40 ? "text-warning" : "text-destructive"
          )}>
            {intelligence.positionScore}/100
          </div>
        </div>
        <div className="game-panel p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Niveau de menace</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            intelligence.threatLevel < 30 ? "text-success" :
            intelligence.threatLevel < 60 ? "text-warning" : "text-destructive"
          )}>
            {intelligence.threatLevel}/100
          </div>
        </div>
      </div>

      {/* Recent Competitor Actions */}
      {intelligence.recentActions.length > 0 && (
        <div className="game-panel p-4">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-warning" />
            Actions récentes des concurrents
          </h3>
          <div className="space-y-2">
            {intelligence.recentActions.map((action, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
              >
                <span className="text-sm">{action.description}</span>
                <span className="text-xs text-muted-foreground">Jour {action.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCompetitors = () => (
    <div className="space-y-4">
      {competitors.map(comp => {
        const isExpanded = expandedCompetitor === comp.id;
        
        return (
          <div
            key={comp.id}
            className={cn(
              "game-panel p-4 cursor-pointer transition-all",
              isExpanded && "ring-2 ring-primary"
            )}
          >
            <div 
              className="flex items-center justify-between"
              onClick={() => setExpandedCompetitor(isExpanded ? null : comp.id)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
                  comp.size === 'startup' ? "bg-green-500/20 text-green-500" :
                  comp.size === 'pme' ? "bg-blue-500/20 text-blue-500" :
                  comp.size === 'eti' ? "bg-purple-500/20 text-purple-500" :
                  "bg-red-500/20 text-red-500"
                )}>
                  {comp.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{comp.name}</h4>
                  <span className="text-xs text-muted-foreground capitalize">{comp.size}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold">{formatPercent(comp.marketShare * 100)}</div>
                  <span className="text-xs text-muted-foreground">Part de marché</span>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                {/* Competitor Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="font-semibold">{comp.aggressiveness}/100</div>
                    <span className="text-xs text-muted-foreground">Agressivité</span>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <Zap className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                    <div className="font-semibold">{comp.innovation}/100</div>
                    <span className="text-xs text-muted-foreground">Innovation</span>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <Star className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                    <div className="font-semibold">{comp.reputation}/100</div>
                    <span className="text-xs text-muted-foreground">Réputation</span>
                  </div>
                </div>

                {/* Products */}
                {comp.products.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold mb-2">Produits concurrents</h5>
                    <div className="space-y-2">
                      {comp.products.map((product, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg text-sm"
                        >
                          <span>{product.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">
                              {formatCurrency(product.price)}
                            </span>
                            <span className={cn(
                              comp.priceLevel < 1 ? "text-destructive" : 
                              comp.priceLevel > 1 ? "text-success" : "text-muted-foreground"
                            )}>
                              {comp.priceLevel < 1 ? 'Prix bas' : comp.priceLevel > 1 ? 'Prix haut' : 'Prix moyen'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedCompetitorId(comp.id)}
                    className="flex-1 btn-game-secondary text-sm py-2"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Espionner
                  </button>
                  <button 
                    onClick={() => handleLaunchAction('price_war', 5000)}
                    className="flex-1 btn-game-primary text-sm py-2"
                  >
                    <Swords className="w-4 h-4 mr-1" />
                    Attaquer
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderEspionage = () => (
    <div className="space-y-6">
      {/* Selected Target */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4">Cible sélectionnée</h3>
        {selectedCompetitorId ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {competitors.find(c => c.id === selectedCompetitorId)?.name}
              </span>
            </div>
            <button 
              onClick={() => setSelectedCompetitorId(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Changer
            </button>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Sélectionnez un concurrent dans l'onglet "Concurrents"</p>
          </div>
        )}
      </div>

      {/* Espionage Actions */}
      <div className="grid gap-3">
        {ESPIONAGE_ACTIONS.map(action => {
          const canAfford = company.treasury >= action.cost;
          const requiresTarget = action.id !== 'market_study';
          const isDisabled = !canAfford || (requiresTarget && !selectedCompetitorId);
          
          return (
            <div
              key={action.id}
              className={cn(
                "game-panel p-4 transition-all",
                isDisabled && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    action.risk === 'low' ? "bg-success/20" :
                    action.risk === 'medium' ? "bg-warning/20" :
                    "bg-destructive/20"
                  )}>
                    <Eye className={cn(
                      "w-5 h-5",
                      action.risk === 'low' ? "text-success" :
                      action.risk === 'medium' ? "text-warning" :
                      "text-destructive"
                    )} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{action.name}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Coût: <span className="text-foreground font-medium">{formatCurrency(action.cost)}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Succès: <span className="text-foreground font-medium">{(action.successRate * 100)}%</span>
                  </span>
                  <span className={cn(
                    action.risk === 'low' ? "text-success" :
                    action.risk === 'medium' ? "text-warning" :
                    "text-destructive"
                  )}>
                    Risque {action.risk === 'low' ? 'faible' : action.risk === 'medium' ? 'moyen' : 'élevé'}
                  </span>
                </div>
                <button
                  onClick={() => handlePerformEspionage(action.id)}
                  disabled={isDisabled}
                  className="btn-game-primary text-sm py-2 px-4 disabled:opacity-50"
                >
                  Lancer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderActions = () => {
    const competitiveActions = [
      { id: 'price_war', name: 'Guerre des prix', description: 'Baissez vos prix agressivement', cost: 5000, impact: 'Part de marché +5%, Marge -10%' },
      { id: 'marketing_blitz', name: 'Offensive marketing', description: 'Campagne marketing massive', cost: 15000, impact: 'Notoriété +20%, Leads +30%' },
      { id: 'talent_poaching', name: 'Débauchage', description: 'Recrutez les talents des concurrents', cost: 10000, impact: 'Compétences équipe +15%' },
      { id: 'innovation_race', name: 'Course à l\'innovation', description: 'Accélérez la R&D', cost: 20000, impact: 'R&D +50%, Innovation +20%' },
      { id: 'quality_premium', name: 'Premium qualité', description: 'Positionnement haut de gamme', cost: 8000, impact: 'Réputation +15%, Marge +5%' },
      { id: 'partnership', name: 'Alliances stratégiques', description: 'Créez des partenariats', cost: 12000, impact: 'Réseau +25%, Opportunités +20%' },
    ];

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Lancez des actions stratégiques pour gagner des parts de marché et affaiblir vos concurrents.
        </p>
        
        <div className="grid gap-3">
          {competitiveActions.map(action => {
            const canAfford = company.treasury >= action.cost;
            
            return (
              <div
                key={action.id}
                className={cn(
                  "game-panel p-4",
                  !canAfford && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{action.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-primary/20 text-primary rounded">
                        {action.impact}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold">{formatCurrency(action.cost)}</div>
                    <button
                      onClick={() => handleLaunchAction(action.id, action.cost)}
                      disabled={!canAfford}
                      className="mt-2 btn-game-primary text-sm py-1 px-3 disabled:opacity-50"
                    >
                      Lancer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Swords className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-display font-semibold">Concurrence & Marché</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
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

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'competitors' && renderCompetitors()}
      {activeTab === 'espionage' && renderEspionage()}
      {activeTab === 'actions' && renderActions()}
    </div>
  );
}
