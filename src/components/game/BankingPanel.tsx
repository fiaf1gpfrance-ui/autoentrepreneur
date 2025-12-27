import { useState } from "react";
import { BankAccount, LoanType, InvestmentType, LOAN_CONFIGS, INVESTMENT_CONFIGS } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { formatCreditRating, getAvailableBanks } from "@/utils/bankingEngine";
import { GaugeBar } from "./GaugeBar";
import { 
  Landmark, 
  CreditCard, 
  TrendingUp, 
  PiggyBank, 
  AlertTriangle,
  Plus,
  ArrowRight,
  Star,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BankingPanelProps {
  bankAccount: BankAccount;
  treasury: number;
  monthlyRevenue: number;
  onRequestLoan: (type: LoanType, amount: number, duration: number) => void;
  onRequestOverdraft: (limit: number) => void;
  onCreateInvestment: (type: InvestmentType, amount: number) => void;
  onLiquidateInvestment: (id: string) => void;
  onChangeBank: (bankName: string) => void;
}

const loanTypeLabels: Record<LoanType, { label: string; icon: string }> = {
  court_terme: { label: "Court terme (1-12 mois)", icon: "⚡" },
  moyen_terme: { label: "Moyen terme (1-5 ans)", icon: "📊" },
  long_terme: { label: "Long terme (5-20 ans)", icon: "🏛️" },
  immobilier: { label: "Crédit immobilier", icon: "🏢" },
};

const investmentTypeLabels: Record<InvestmentType, { label: string; risk: string; color: string }> = {
  livret: { label: "Livret Pro", risk: "Sans risque", color: "text-success" },
  compte_terme: { label: "Compte à terme", risk: "Très faible", color: "text-success" },
  obligations: { label: "Obligations", risk: "Faible", color: "text-info" },
  sicav: { label: "SICAV", risk: "Modéré", color: "text-warning" },
  actions: { label: "Actions", risk: "Élevé", color: "text-destructive" },
};

const relationshipLabels: Record<string, { label: string; color: string }> = {
  nouveau: { label: "Nouveau client", color: "text-muted-foreground" },
  client: { label: "Client", color: "text-foreground" },
  prefere: { label: "Client préféré", color: "text-primary" },
  vip: { label: "Client VIP", color: "text-warning" },
};

export function BankingPanel({
  bankAccount,
  treasury,
  monthlyRevenue,
  onRequestLoan,
  onRequestOverdraft,
  onCreateInvestment,
  onLiquidateInvestment,
  onChangeBank,
}: BankingPanelProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'loans' | 'investments' | 'overdraft'>('overview');
  const [loanType, setLoanType] = useState<LoanType>('moyen_terme');
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanDuration, setLoanDuration] = useState(24);
  const [investType, setInvestType] = useState<InvestmentType>('livret');
  const [investAmount, setInvestAmount] = useState(10000);
  const [overdraftLimit, setOverdraftLimit] = useState(20000);
  const [showBankSwitch, setShowBankSwitch] = useState(false);

  const totalDebt = bankAccount.loans.reduce((sum, l) => sum + l.remainingAmount, 0);
  const totalInvested = bankAccount.investments.reduce((sum, i) => sum + i.currentValue, 0);
  const monthlyLoanPayments = bankAccount.loans.reduce((sum, l) => sum + l.monthlyPayment, 0);
  const relationship = relationshipLabels[bankAccount.relationship];
  const availableBanks = getAvailableBanks(bankAccount.creditScore);
  
  const loanConfig = LOAN_CONFIGS[loanType];
  const investConfig = INVESTMENT_CONFIGS[investType];

  return (
    <div className="space-y-4">
      {/* Bank Header */}
      <div className="game-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Landmark className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold">{bankAccount.bankName}</h3>
              <p className={cn("text-sm", relationship.color)}>
                {relationship.label} • Frais: {formatCurrency(bankAccount.monthlyFees)}/mois
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowBankSwitch(!showBankSwitch)}
            className="btn-game-secondary text-xs"
          >
            Changer de banque
          </button>
        </div>

        {showBankSwitch && (
          <div className="bg-secondary/50 rounded-lg p-3 mb-4 space-y-2">
            <p className="text-xs text-muted-foreground mb-2">Banques disponibles :</p>
            {availableBanks.map(bank => (
              <button
                key={bank.name}
                onClick={() => {
                  onChangeBank(bank.name);
                  setShowBankSwitch(false);
                }}
                disabled={bank.name === bankAccount.bankName}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-lg text-left text-sm transition-colors",
                  bank.name === bankAccount.bankName
                    ? "bg-primary/10 border border-primary"
                    : "hover:bg-secondary"
                )}
              >
                <span>{bank.name}</span>
                <span className="text-muted-foreground">{formatCurrency(bank.monthlyFees)}/mois</span>
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Score Crédit</p>
            <p className="text-2xl font-display font-bold text-primary">
              {formatCreditRating(bankAccount.creditScore)}
            </p>
            <p className="text-xs text-muted-foreground">{bankAccount.creditScore}/1000</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Dette totale</p>
            <p className={cn("text-xl font-bold", totalDebt > 0 ? "text-destructive" : "text-success")}>
              {formatCurrency(totalDebt)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Placements</p>
            <p className="text-xl font-bold text-success">{formatCurrency(totalInvested)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Échéances/mois</p>
            <p className="text-xl font-bold text-warning">{formatCurrency(monthlyLoanPayments)}</p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: Landmark },
          { id: 'loans', label: 'Prêts', icon: CreditCard },
          { id: 'investments', label: 'Placements', icon: PiggyBank },
          { id: 'overdraft', label: 'Découvert', icon: AlertTriangle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
              activeSection === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Credit Score Gauge */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-warning" /> Score de crédit
            </h4>
            <GaugeBar 
              value={bankAccount.creditScore / 10} 
              label="Score" 
              colorClass={bankAccount.creditScore >= 600 ? "bg-success" : bankAccount.creditScore >= 400 ? "bg-warning" : "bg-destructive"} 
            />
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <p>• AAA (800+): Meilleurs taux, conditions VIP</p>
              <p>• A (600-699): Bons taux, accès complet</p>
              <p>• BB (400-499): Taux standards</p>
              <p>• B-D (&lt;400): Accès limité, taux élevés</p>
            </div>
          </div>

          {/* Active Loans Summary */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-3">Prêts en cours</h4>
            {bankAccount.loans.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun prêt en cours</p>
            ) : (
              <div className="space-y-2">
                {bankAccount.loans.slice(0, 3).map(loan => (
                  <div key={loan.id} className="flex justify-between items-center text-sm">
                    <span>{loanTypeLabels[loan.type].icon} {loanTypeLabels[loan.type].label.split(' ')[0]}</span>
                    <span className="font-medium">{formatCurrency(loan.remainingAmount)}</span>
                    <span className="text-muted-foreground">{loan.remainingMonths} mois</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Investments Summary */}
          <div className="game-panel col-span-2">
            <h4 className="font-display font-semibold mb-3">Placements actifs</h4>
            {bankAccount.investments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun placement en cours</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {bankAccount.investments.map(inv => {
                  const config = investmentTypeLabels[inv.type];
                  const gain = inv.currentValue - inv.amount;
                  return (
                    <div key={inv.id} className="bg-secondary/50 rounded-lg p-3">
                      <p className="font-medium text-sm">{config.label}</p>
                      <p className="text-lg font-bold">{formatCurrency(inv.currentValue)}</p>
                      <p className={cn("text-xs", gain >= 0 ? "text-success" : "text-destructive")}>
                        {gain >= 0 ? "+" : ""}{formatCurrency(gain)} ({((gain / inv.amount) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loans Section */}
      {activeSection === 'loans' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Request New Loan */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Demander un prêt</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Type de prêt</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(loanTypeLabels).map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => setLoanType(type as LoanType)}
                      className={cn(
                        "p-2 rounded-lg text-left text-xs transition-colors",
                        loanType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      {info.icon} {info.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">
                  Montant: {formatCurrency(loanAmount)}
                </label>
                <input
                  type="range"
                  min={loanConfig.minAmount}
                  max={Math.min(loanConfig.maxAmount, treasury * 5)}
                  step={5000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-primary mt-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(loanConfig.minAmount)}</span>
                  <span>{formatCurrency(loanConfig.maxAmount)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">
                  Durée: {loanDuration} mois
                </label>
                <input
                  type="range"
                  min={loanConfig.minDuration}
                  max={loanConfig.maxDuration}
                  step={loanConfig.minDuration >= 12 ? 12 : 1}
                  value={loanDuration}
                  onChange={(e) => setLoanDuration(Number(e.target.value))}
                  className="w-full accent-primary mt-1"
                />
              </div>

              <div className="bg-secondary/50 rounded-lg p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux estimé</span>
                  <span className="font-medium">{(loanConfig.baseRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mensualité estimée</span>
                  <span className="font-medium text-warning">
                    ~{formatCurrency(Math.round(loanAmount * (1 + loanConfig.baseRate) / loanDuration))}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onRequestLoan(loanType, loanAmount, loanDuration)}
                className="w-full btn-game-primary flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Demander le prêt
              </button>
            </div>
          </div>

          {/* Current Loans */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Prêts en cours ({bankAccount.loans.length})</h4>
            {bankAccount.loans.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun prêt en cours. Demandez un prêt pour développer votre activité.
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {bankAccount.loans.map(loan => (
                  <div key={loan.id} className="bg-secondary/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">
                          {loanTypeLabels[loan.type].icon} {loanTypeLabels[loan.type].label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Taux: {(loan.interestRate * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-destructive">{formatCurrency(loan.remainingAmount)}</p>
                        <p className="text-xs text-muted-foreground">{loan.remainingMonths} mois restants</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mensualité: {formatCurrency(loan.monthlyPayment)}</span>
                      {loan.missedPayments > 0 && (
                        <span className="text-destructive">⚠️ {loan.missedPayments} impayés</span>
                      )}
                    </div>
                    <GaugeBar
                      value={((loan.duration - loan.remainingMonths) / loan.duration) * 100}
                      label="Progression"
                      colorClass="bg-primary"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Investments Section */}
      {activeSection === 'investments' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Create Investment */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Nouveau placement</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Type de placement</label>
                <div className="space-y-2 mt-1">
                  {Object.entries(investmentTypeLabels).map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => setInvestType(type as InvestmentType)}
                      className={cn(
                        "w-full p-2 rounded-lg text-left text-sm flex justify-between items-center transition-colors",
                        investType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      <span>{info.label}</span>
                      <span className={investType === type ? "" : info.color}>{info.risk}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">
                  Montant: {formatCurrency(investAmount)}
                </label>
                <input
                  type="range"
                  min={investConfig.minAmount}
                  max={Math.min(investConfig.maxAmount, treasury * 0.8)}
                  step={1000}
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  className="w-full accent-primary mt-1"
                />
              </div>

              <div className="bg-secondary/50 rounded-lg p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rendement estimé</span>
                  <span className="font-medium text-success">{(investConfig.baseRate * 100).toFixed(1)}%/an</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risque</span>
                  <span className={investmentTypeLabels[investType].color}>
                    {investmentTypeLabels[investType].risk}
                  </span>
                </div>
                {investConfig.locked && (
                  <p className="text-xs text-warning mt-2">
                    ⚠️ Fonds bloqués - pénalité en cas de retrait anticipé
                  </p>
                )}
              </div>

              <button
                onClick={() => onCreateInvestment(investType, investAmount)}
                disabled={treasury < investAmount}
                className="w-full btn-game-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <TrendingUp className="w-4 h-4" /> Investir
              </button>
            </div>
          </div>

          {/* Current Investments */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Portefeuille ({bankAccount.investments.length})</h4>
            {bankAccount.investments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun placement. Faites fructifier votre trésorerie !
              </p>
            ) : (
              <div className="space-y-3">
                {bankAccount.investments.map(inv => {
                  const config = investmentTypeLabels[inv.type];
                  const gain = inv.currentValue - inv.amount;
                  const gainPercent = (gain / inv.amount) * 100;
                  
                  return (
                    <div key={inv.id} className="bg-secondary/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{config.label}</p>
                          <p className="text-xs text-muted-foreground">
                            Taux: {(inv.interestRate * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(inv.currentValue)}</p>
                          <p className={cn("text-sm", gain >= 0 ? "text-success" : "text-destructive")}>
                            {gain >= 0 ? "+" : ""}{formatCurrency(gain)} ({gainPercent.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                      {inv.locked && (
                        <p className="text-xs text-warning mb-2">🔒 Bloqué jusqu'à maturité</p>
                      )}
                      <button
                        onClick={() => onLiquidateInvestment(inv.id)}
                        className="w-full btn-game-secondary text-xs py-1"
                      >
                        Retirer
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overdraft Section */}
      {activeSection === 'overdraft' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Facilité de caisse / Découvert autorisé
          </h4>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                <h5 className="font-medium mb-2">Situation actuelle</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Découvert autorisé</span>
                    <span className={bankAccount.overdraft.approved ? "text-success" : "text-destructive"}>
                      {bankAccount.overdraft.approved ? "Oui" : "Non"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Limite</span>
                    <span className="font-medium">{formatCurrency(bankAccount.overdraft.limit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilisation</span>
                    <span className={cn(
                      "font-medium",
                      bankAccount.overdraft.currentUsage > 0 ? "text-destructive" : "text-success"
                    )}>
                      {formatCurrency(bankAccount.overdraft.currentUsage)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taux d'intérêt</span>
                    <span className="text-warning">{(bankAccount.overdraft.interestRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {bankAccount.overdraft.currentUsage > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Vous êtes actuellement en découvert. Des agios seront prélevés.
                  </p>
                </div>
              )}
            </div>

            <div>
              <h5 className="font-medium mb-3">
                {bankAccount.overdraft.approved ? "Modifier la limite" : "Demander un découvert"}
              </h5>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Limite souhaitée: {formatCurrency(overdraftLimit)}
                  </label>
                  <input
                    type="range"
                    min={5000}
                    max={Math.max(monthlyRevenue * 2, 50000)}
                    step={5000}
                    value={overdraftLimit}
                    onChange={(e) => setOverdraftLimit(Number(e.target.value))}
                    className="w-full accent-primary mt-1"
                  />
                </div>

                <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1">
                  <p className="text-muted-foreground">
                    Le découvert sera accordé selon votre score de crédit et votre chiffre d'affaires.
                  </p>
                  <p className="text-warning">
                    Taux d'agios estimé: 12-18% selon votre profil
                  </p>
                </div>

                <button
                  onClick={() => onRequestOverdraft(overdraftLimit)}
                  className="w-full btn-game-primary"
                >
                  {bankAccount.overdraft.approved ? "Modifier la limite" : "Demander le découvert"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
