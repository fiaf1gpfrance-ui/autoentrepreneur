import { useState } from "react";
import { Company, GameState } from "@/types/game";
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
  gameState: GameState;
  onFundingRound: (amount: number, equity: number, investorIds: string[]) => void;
}

export function InvestorsPanel({ 
  company, 
  gameState,
  onFundingRound,
}: InvestorsPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'investors' | 'funding'>('overview');
  const [selectedInvestorId, setSelectedInvestorId] = useState<string | null>(null);

  // Initialize data
  const investors = initializeInvestors(company);
  const valuation = calculateValuation(company, gameState);
  const updatedInvestors = updateInvestorUnlocks(investors, company, gameState);
  const availableRounds = getAvailableFundingRounds(company, gameState);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: PieChart },
    { id: 'investors', label: 'Investisseurs', icon: Users },
    { id: 'funding', label: 'Levées de fonds', icon: TrendingUp },
  ] as const;

  const handleStartFundingRound = (roundType: FundingRound['type']) => {
    const config = FUNDING_ROUND_CONFIGS[roundType];
    const amount = (config.typicalAmount.min + config.typicalAmount.max) / 2;
    const equity = (config.typicalEquity.min + config.typicalEquity.max) / 2;
    
    onFundingRound(amount, equity, []);
    toast.success(`Levée de fonds ${config.name} lancée ! Montant: ${formatCurrency(amount)}`);
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
          <span className="text-xs text-muted-foreground">Méthode: {valuation.method}</span>
        </div>
        <div className="text-3xl font-display font-bold text-primary mb-4">
          {formatCurrency(valuation.preMoneyValuation)}
        </div>
        
        {/* Factors */}
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Facteurs d'évaluation:</span>
          <div className="flex flex-wrap gap-2">
            {valuation.factors.map((factor, idx) => (
              <span 
                key={idx}
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  factor.positive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                )}
              >
                {factor.positive ? '+' : ''}{factor.impact}% {factor.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="game-panel p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Investisseurs disponibles</span>
          </div>
          <div className="text-2xl font-bold">
            {updatedInvestors.filter(i => i.unlocked).length} / {updatedInvestors.length}
          </div>
        </div>
        <div className="game-panel p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">Levées disponibles</span>
          </div>
          <div className="text-2xl font-bold">
            {availableRounds.length}
          </div>
        </div>
      </div>

      {/* Available Funding Rounds */}
      {availableRounds.length > 0 && (
        <div className="game-panel p-4">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Coins className="w-4 h-4" />
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
                      {formatCurrency(config.typicalAmount.min)} - {formatCurrency(config.typicalAmount.max)}
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
          const checkResult = checkInvestorRequirements(investor, company, gameState);
          
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
                  <span className="text-2xl">{investor.avatar}</span>
                  <div>
                    <h4 className="font-semibold">{investor.name}</h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      investor.type === 'angel' ? "bg-amber-500/20 text-amber-500" :
                      investor.type.startsWith('vc') ? "bg-blue-500/20 text-blue-500" :
                      investor.type === 'corporate' ? "bg-purple-500/20 text-purple-500" :
                      "bg-green-500/20 text-green-500"
                    )}>
                      {investor.type === 'angel' ? 'Business Angel' :
                       investor.type.startsWith('vc') ? 'Capital-Risque' :
                       investor.type === 'corporate' ? 'Corporate VC' : 'Crowdfunding'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {investor.unlocked ? (
                    <Unlock className="w-4 h-4 text-success" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-secondary/50 rounded p-2">
                  <span className="text-muted-foreground">Ticket</span>
                  <div className="font-semibold">
                    {formatCurrency(investor.investmentRange.min)} - {formatCurrency(investor.investmentRange.max)}
                  </div>
                </div>
                <div className="bg-secondary/50 rounded p-2">
                  <span className="text-muted-foreground">Equity attendu</span>
                  <div className="font-semibold">
                    {investor.equityExpected.min}% - {investor.equityExpected.max}%
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {investor.focus.map((sector, idx) => (
                  <span key={idx} className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                    {sector}
                  </span>
                ))}
              </div>

              {!investor.unlocked && (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-1 text-warning mb-1">
                    <Info className="w-3 h-3" />
                    <span className="font-semibold">Conditions de déblocage:</span>
                  </div>
                  <ul className="text-muted-foreground space-y-0.5">
                    {investor.requirements.map((req, idx) => (
                      <li key={idx}>• {req.description}</li>
                    ))}
                  </ul>
                </div>
              )}

              {investor.unlocked && checkResult.eligible && (
                <button className="w-full btn-game-primary text-sm py-2 mt-2">
                  Contacter l'investisseur
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFunding = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Les levées de fonds vous permettent d'obtenir du capital en échange d'une partie de votre entreprise.
      </p>

      <div className="space-y-3">
        {Object.entries(FUNDING_ROUND_CONFIGS).map(([key, config]) => {
          const isAvailable = availableRounds.includes(key as FundingRound['type']);
          
          return (
            <div
              key={key}
              className={cn(
                "game-panel p-4",
                !isAvailable && "opacity-50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{config.name}</h4>
                {isAvailable ? (
                  <span className="text-xs px-2 py-0.5 bg-success/20 text-success rounded-full">
                    Disponible
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                    Non disponible
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Montant typique:</span>
                  <div className="font-medium">
                    {formatCurrency(config.typicalAmount.min)} - {formatCurrency(config.typicalAmount.max)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Equity:</span>
                  <div className="font-medium">
                    {config.typicalEquity.min}% - {config.typicalEquity.max}%
                  </div>
                </div>
              </div>
              {isAvailable && (
                <button
                  onClick={() => handleStartFundingRound(key as FundingRound['type'])}
                  className="w-full btn-game-primary text-sm py-2 mt-3"
                >
                  Lancer la levée
                </button>
              )}
            </div>
          );
        })}
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
    </div>
  );
}
