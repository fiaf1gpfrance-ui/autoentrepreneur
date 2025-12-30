import { useState } from "react";
import { Company } from "@/types/game";
import { 
  Investor, 
  FundingRound, 
  Shareholder,
  INVESTOR_TEMPLATES,
  FUNDING_ROUND_CONFIGS,
} from "@/types/investors";
import { 
  initializeInvestors,
  calculateValuation,
  checkInvestorRequirements,
  createFundingRound,
  initializeShareholders,
  addShareholder,
  calculateDividend,
  getAvailableFundingRounds,
  updateInvestorUnlocks,
} from "@/utils/investorEngine";
import { formatCurrency } from "@/utils/gameEngine";
import { 
  TrendingUp, 
  Users, 
  PieChart, 
  DollarSign,
  Target,
  Star,
  Lock,
  Unlock,
  Info,
  ChevronRight,
  Building2,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface InvestorsPanelProps {
  company: Company;
  day: number;
  onFundingRound: (round: FundingRound) => void;
  onPayDividends: (amount: number) => void;
}

export function InvestorsPanel({ 
  company, 
  day,
  onFundingRound,
  onPayDividends,
}: InvestorsPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'investors' | 'funding' | 'shareholders'>('overview');
  const [selectedInvestorId, setSelectedInvestorId] = useState<string | null>(null);

  // Initialize data if not present
  const investors = company.investors || initializeInvestors();
  const shareholders = company.shareholders || initializeShareholders(company.name);
  const fundingRounds = company.fundingRounds || [];
  const valuation = calculateValuation(company, day);
  const updatedInvestors = updateInvestorUnlocks(investors, company, day);
  const availableRounds = getAvailableFundingRounds(fundingRounds, company);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: PieChart },
    { id: 'investors', label: 'Investisseurs', icon: Users },
    { id: 'funding', label: 'Levées de fonds', icon: TrendingUp },
    { id: 'shareholders', label: 'Actionnariat', icon: Building2 },
  ] as const;

  const handleStartFundingRound = (roundType: FundingRound['type']) => {
    const config = FUNDING_ROUND_CONFIGS[roundType];
    const round = createFundingRound(roundType, company, valuation, day);
    
    if (!round) {
      toast.error("Impossible de lancer cette levée de fonds");
      return;
    }
    
    onFundingRound(round);
    toast.success(`Levée de fonds ${config.name} lancée ! Objectif: ${formatCurrency(round.targetAmount)}`);
  };

  const handlePayDividends = () => {
    const totalDividend = calculateDividend(company, shareholders);
    if (company.treasury < totalDividend) {
      toast.error("Trésorerie insuffisante pour verser les dividendes");
      return;
    }
    onPayDividends(totalDividend);
    toast.success(`Dividendes versés: ${formatCurrency(totalDividend)}`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Valuation Card */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-6 border border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Valorisation estimée
          </h3>
          <span className="text-xs text-muted-foreground">Mise à jour quotidienne</span>
        </div>
        <div className="text-3xl font-display font-bold text-primary mb-2">
          {formatCurrency(valuation.current)}
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Multiple revenus</span>
            <div className="font-semibold">{valuation.revenueMultiple.toFixed(1)}x</div>
          </div>
          <div>
            <span className="text-muted-foreground">Score croissance</span>
            <div className="font-semibold">{valuation.growthScore}/100</div>
          </div>
          <div>
            <span className="text-muted-foreground">Prime marché</span>
            <div className={cn(
              "font-semibold",
              valuation.marketPremium > 0 ? "text-success" : "text-destructive"
            )}>
              {valuation.marketPremium > 0 ? '+' : ''}{(valuation.marketPremium * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="game-panel p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Investisseurs débloqués</span>
          </div>
          <div className="text-2xl font-bold">
            {updatedInvestors.filter(i => i.unlocked).length} / {updatedInvestors.length}
          </div>
        </div>
        <div className="game-panel p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Coins className="w-4 h-4" />
            <span className="text-sm">Total levé</span>
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(fundingRounds.filter(r => r.closed).reduce((sum, r) => sum + r.raisedAmount, 0))}
          </div>
        </div>
      </div>

      {/* Available Funding Rounds */}
      {availableRounds.length > 0 && (
        <div className="game-panel p-4">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Levées disponibles
          </h3>
          <div className="space-y-2">
            {availableRounds.map(roundType => {
              const config = FUNDING_ROUND_CONFIGS[roundType];
              return (
                <button
                  key={roundType}
                  onClick={() => handleStartFundingRound(roundType)}
                  className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                >
                  <div>
                    <span className="font-semibold">{config.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      Dilution: {(config.typicalDilution * 100).toFixed(0)}%
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderInvestors = () => (
    <div className="space-y-4">
      <div className="grid gap-3">
        {updatedInvestors.map(investor => {
          const canInvest = checkInvestorRequirements(investor, company, day);
          
          return (
            <div
              key={investor.id}
              className={cn(
                "game-panel p-4 transition-all",
                !investor.unlocked && "opacity-60",
                selectedInvestorId === investor.id && "ring-2 ring-primary"
              )}
              onClick={() => investor.unlocked && setSelectedInvestorId(
                selectedInvestorId === investor.id ? null : investor.id
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {investor.unlocked ? (
                    <Unlock className="w-5 h-5 text-success" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <h4 className="font-semibold">{investor.name}</h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      investor.type === 'angel' ? "bg-amber-500/20 text-amber-500" :
                      investor.type === 'vc' ? "bg-blue-500/20 text-blue-500" :
                      investor.type === 'corporate' ? "bg-purple-500/20 text-purple-500" :
                      "bg-green-500/20 text-green-500"
                    )}>
                      {investor.type === 'angel' ? 'Business Angel' :
                       investor.type === 'vc' ? 'Capital-Risque' :
                       investor.type === 'corporate' ? 'Corporate VC' : 'Fonds PE'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < investor.reputation ? "text-amber-400 fill-amber-400" : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{investor.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-secondary/50 rounded p-2">
                  <span className="text-muted-foreground">Ticket min</span>
                  <div className="font-semibold">{formatCurrency(investor.minInvestment)}</div>
                </div>
                <div className="bg-secondary/50 rounded p-2">
                  <span className="text-muted-foreground">Ticket max</span>
                  <div className="font-semibold">{formatCurrency(investor.maxInvestment)}</div>
                </div>
              </div>

              {!investor.unlocked && (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-1 text-warning mb-1">
                    <Info className="w-3 h-3" />
                    <span className="font-semibold">Conditions de déblocage:</span>
                  </div>
                  <ul className="text-muted-foreground space-y-0.5">
                    {investor.requirements.minRevenue && (
                      <li>• CA min: {formatCurrency(investor.requirements.minRevenue)}/mois</li>
                    )}
                    {investor.requirements.minEmployees && (
                      <li>• Employés min: {investor.requirements.minEmployees}</li>
                    )}
                    {investor.requirements.minValuation && (
                      <li>• Valorisation min: {formatCurrency(investor.requirements.minValuation)}</li>
                    )}
                    {investor.requirements.sectors && (
                      <li>• Secteurs: {investor.requirements.sectors.join(', ')}</li>
                    )}
                  </ul>
                </div>
              )}

              {investor.unlocked && canInvest && (
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 btn-game-primary text-sm py-2">
                    Contacter
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFunding = () => (
    <div className="space-y-6">
      {/* Active Rounds */}
      {fundingRounds.filter(r => !r.closed).length > 0 && (
        <div className="game-panel p-4">
          <h3 className="font-display font-semibold mb-4">Levées en cours</h3>
          <div className="space-y-3">
            {fundingRounds.filter(r => !r.closed).map(round => (
              <div key={round.id} className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{FUNDING_ROUND_CONFIGS[round.type].name}</span>
                  <span className="text-sm text-primary">
                    {((round.raisedAmount / round.targetAmount) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 mb-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${Math.min(100, (round.raisedAmount / round.targetAmount) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(round.raisedAmount)} levés</span>
                  <span>Objectif: {formatCurrency(round.targetAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Rounds */}
      {fundingRounds.filter(r => r.closed).length > 0 && (
        <div className="game-panel p-4">
          <h3 className="font-display font-semibold mb-4">Historique</h3>
          <div className="space-y-2">
            {fundingRounds.filter(r => r.closed).map(round => (
              <div key={round.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div>
                  <span className="font-semibold">{FUNDING_ROUND_CONFIGS[round.type].name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    Jour {round.closedDate}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-success">{formatCurrency(round.raisedAmount)}</div>
                  <div className="text-xs text-muted-foreground">
                    Valo: {formatCurrency(round.postMoneyValuation)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Rounds Yet */}
      {fundingRounds.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune levée de fonds effectuée</p>
          <p className="text-sm mt-2">Utilisez l'onglet Vue d'ensemble pour lancer votre première levée</p>
        </div>
      )}
    </div>
  );

  const renderShareholders = () => (
    <div className="space-y-6">
      {/* Ownership Chart */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4">Répartition du capital</h3>
        <div className="space-y-3">
          {shareholders.map((holder, index) => {
            const colors = ['bg-primary', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-green-500'];
            return (
              <div key={holder.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{holder.name}</span>
                  <span className="text-sm font-bold">{(holder.percentage * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div 
                    className={cn("rounded-full h-3 transition-all", colors[index % colors.length])}
                    style={{ width: `${holder.percentage * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{holder.shares.toLocaleString()} actions</span>
                  <span>Entrée: Jour {holder.entryDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dividends */}
      <div className="game-panel p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Dividendes</h3>
          <button
            onClick={handlePayDividends}
            disabled={company.treasury < calculateDividend(company, shareholders)}
            className="btn-game-primary text-sm py-2 px-4 disabled:opacity-50"
          >
            Verser les dividendes
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Montant estimé: {formatCurrency(calculateDividend(company, shareholders))}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-display font-semibold">Investisseurs & Levées de fonds</h2>
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
      {activeTab === 'investors' && renderInvestors()}
      {activeTab === 'funding' && renderFunding()}
      {activeTab === 'shareholders' && renderShareholders()}
    </div>
  );
}
