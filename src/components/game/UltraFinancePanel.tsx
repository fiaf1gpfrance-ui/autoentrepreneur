import { useState } from "react";
import { Company } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { GaugeBar } from "./GaugeBar";
import { 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart3,
  Calculator,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Target,
  Wallet,
  CreditCard,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UltraFinancePanelProps {
  company: Company;
  day: number;
  month: number;
  year: number;
}

export function UltraFinancePanel({ company, day, month, year }: UltraFinancePanelProps) {
  const [activeTab, setActiveTab] = useState<'bilan' | 'resultat' | 'tresorerie' | 'ratios' | 'budget' | 'previsions'>('bilan');

  // Calculate balance sheet items
  const actifImmobilise = company.properties.reduce((sum, p) => sum + p.currentValue, 0) +
    company.intellectualProperty.reduce((sum, ip) => sum + ip.value, 0);
  
  const stocks = company.inventory.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);
  const creancesClients = company.invoices.filter(i => !i.paid).reduce((sum, i) => sum + i.amount, 0);
  const disponibilites = company.treasury;
  const placements = company.bankAccount.investments.reduce((sum, i) => sum + i.currentValue, 0);
  
  const totalActif = actifImmobilise + stocks + creancesClients + disponibilites + placements;
  
  const capitalSocial = company.capital;
  const reserves = Math.max(0, company.treasury - company.capital) * 0.3;
  const resultatExercice = company.monthlyRevenue - company.monthlyExpenses;
  const capitauxPropres = capitalSocial + reserves + resultatExercice;
  
  const dettesFinancieres = company.bankAccount.loans.reduce((sum, l) => sum + l.remainingAmount, 0);
  const dettesFournisseurs = 0; // Simplified
  const dettesFiscales = company.taxDeclarations.filter(t => !t.paid).reduce((sum, t) => sum + t.amount, 0);
  
  const totalPassif = capitauxPropres + dettesFinancieres + dettesFournisseurs + dettesFiscales;

  // Income statement
  const chiffreAffaires = company.monthlyRevenue * 12;
  const chargesExploitation = company.monthlyExpenses * 12;
  const resultatExploitation = chiffreAffaires - chargesExploitation;
  const chargesFinancieres = company.bankAccount.loans.reduce((sum, l) => sum + l.monthlyPayment * 12 * 0.3, 0);
  const resultatFinancier = -chargesFinancieres;
  const resultatCourant = resultatExploitation + resultatFinancier;
  const impotSocietes = resultatCourant > 0 ? resultatCourant * 0.25 : 0;
  const resultatNet = resultatCourant - impotSocietes;

  // Cash flow
  const fluxExploitation = resultatNet + (actifImmobilise * 0.1); // + amortissements
  const fluxInvestissement = -company.properties.filter(p => p.leaseType === 'achat').slice(-1).reduce((sum, p) => sum + (p.purchasePrice || 0), 0);
  const fluxFinancement = company.bankAccount.loans.filter(l => l.startDate > day - 365).reduce((sum, l) => sum + l.amount, 0);
  const variationTresorerie = fluxExploitation + fluxInvestissement + fluxFinancement;

  // Financial ratios
  const ratioLiquidite = (disponibilites + placements) / Math.max(1, dettesFinancieres + dettesFiscales);
  const ratioEndettement = dettesFinancieres / Math.max(1, capitauxPropres);
  const rentabiliteEconomique = resultatExploitation / Math.max(1, totalActif) * 100;
  const rentabiliteFinanciere = resultatNet / Math.max(1, capitauxPropres) * 100;
  const margeNette = resultatNet / Math.max(1, chiffreAffaires) * 100;
  const rotationActif = chiffreAffaires / Math.max(1, totalActif);
  const bfr = stocks + creancesClients - dettesFournisseurs;
  const fondsRoulement = capitauxPropres + dettesFinancieres - actifImmobilise;
  const tresorerieNette = fondsRoulement - bfr;

  const tabs = [
    { id: 'bilan', label: 'Bilan', icon: FileSpreadsheet },
    { id: 'resultat', label: 'Résultat', icon: BarChart3 },
    { id: 'tresorerie', label: 'Trésorerie', icon: Wallet },
    { id: 'ratios', label: 'Ratios', icon: PieChart },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'previsions', label: 'Prévisions', icon: LineChart },
  ];

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3">
        <div className="game-panel text-center">
          <Building2 className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Actif Total</p>
          <p className="text-sm font-bold">{formatCurrency(totalActif)}</p>
        </div>
        <div className="game-panel text-center">
          <Wallet className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Capitaux Propres</p>
          <p className="text-sm font-bold text-success">{formatCurrency(capitauxPropres)}</p>
        </div>
        <div className="game-panel text-center">
          <TrendingUp className="w-5 h-5 text-info mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">CA Annuel</p>
          <p className="text-sm font-bold">{formatCurrency(chiffreAffaires)}</p>
        </div>
        <div className="game-panel text-center">
          <Calculator className="w-5 h-5 mx-auto mb-1" style={{ color: resultatNet >= 0 ? 'var(--success)' : 'var(--destructive)' }} />
          <p className="text-[10px] text-muted-foreground">Résultat Net</p>
          <p className={cn("text-sm font-bold", resultatNet >= 0 ? "text-success" : "text-destructive")}>{formatCurrency(resultatNet)}</p>
        </div>
        <div className="game-panel text-center">
          <CreditCard className="w-5 h-5 text-warning mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Dettes</p>
          <p className="text-sm font-bold text-warning">{formatCurrency(dettesFinancieres)}</p>
        </div>
        <div className="game-panel text-center">
          <Percent className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Marge Nette</p>
          <p className={cn("text-sm font-bold", margeNette >= 10 ? "text-success" : margeNette >= 0 ? "text-warning" : "text-destructive")}>
            {margeNette.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors",
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bilan Tab */}
      {activeTab === 'bilan' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="game-panel">
            <h4 className="font-display font-semibold text-success mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4" /> ACTIF
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">ACTIF IMMOBILISÉ</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Immobilisations corporelles</span>
                    <span className="font-medium">{formatCurrency(company.properties.reduce((s, p) => s + p.currentValue, 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Immobilisations incorporelles</span>
                    <span className="font-medium">{formatCurrency(company.intellectualProperty.reduce((s, ip) => s + ip.value, 0))}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">ACTIF CIRCULANT</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Stocks</span>
                    <span className="font-medium">{formatCurrency(stocks)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Créances clients</span>
                    <span className="font-medium">{formatCurrency(creancesClients)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Disponibilités</span>
                    <span className="font-medium">{formatCurrency(disponibilites)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Placements</span>
                    <span className="font-medium">{formatCurrency(placements)}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between font-semibold">
                  <span>TOTAL ACTIF</span>
                  <span className="text-success">{formatCurrency(totalActif)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="game-panel">
            <h4 className="font-display font-semibold text-destructive mb-4 flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4" /> PASSIF
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">CAPITAUX PROPRES</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Capital social</span>
                    <span className="font-medium">{formatCurrency(capitalSocial)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Réserves</span>
                    <span className="font-medium">{formatCurrency(reserves)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Résultat de l'exercice</span>
                    <span className={cn("font-medium", resultatExercice >= 0 ? "text-success" : "text-destructive")}>
                      {formatCurrency(resultatExercice)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">DETTES</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Dettes financières</span>
                    <span className="font-medium">{formatCurrency(dettesFinancieres)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dettes fournisseurs</span>
                    <span className="font-medium">{formatCurrency(dettesFournisseurs)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dettes fiscales</span>
                    <span className="font-medium">{formatCurrency(dettesFiscales)}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between font-semibold">
                  <span>TOTAL PASSIF</span>
                  <span className="text-destructive">{formatCurrency(totalPassif)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Résultat Tab */}
      {activeTab === 'resultat' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Compte de Résultat (Année {year})</h4>
          <div className="space-y-3">
            <div className="bg-success/10 rounded-lg p-3">
              <div className="flex justify-between">
                <span className="font-medium">Chiffre d'affaires</span>
                <span className="font-bold text-success">{formatCurrency(chiffreAffaires)}</span>
              </div>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Charges d'exploitation</span>
                <span className="text-destructive">-{formatCurrency(chargesExploitation)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="pl-4 text-muted-foreground">dont salaires</span>
                <span>-{formatCurrency(company.employees.reduce((s, e) => s + e.brutSalary * 12 * 1.45, 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="pl-4 text-muted-foreground">dont loyers</span>
                <span>-{formatCurrency(company.properties.reduce((s, p) => s + (p.monthlyRent || 0) * 12, 0))}</span>
              </div>
            </div>

            <div className="flex justify-between p-2 bg-primary/10 rounded-lg">
              <span className="font-medium">Résultat d'exploitation</span>
              <span className={cn("font-bold", resultatExploitation >= 0 ? "text-success" : "text-destructive")}>
                {formatCurrency(resultatExploitation)}
              </span>
            </div>

            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span>Charges financières</span>
                <span className="text-destructive">-{formatCurrency(chargesFinancieres)}</span>
              </div>
            </div>

            <div className="flex justify-between p-2">
              <span>Résultat courant avant impôts</span>
              <span className={cn("font-medium", resultatCourant >= 0 ? "text-success" : "text-destructive")}>
                {formatCurrency(resultatCourant)}
              </span>
            </div>

            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span>Impôt sur les sociétés (25%)</span>
                <span className="text-destructive">-{formatCurrency(impotSocietes)}</span>
              </div>
            </div>

            <div className="flex justify-between p-3 bg-primary/20 rounded-lg border-2 border-primary">
              <span className="font-bold">RÉSULTAT NET</span>
              <span className={cn("font-bold text-lg", resultatNet >= 0 ? "text-success" : "text-destructive")}>
                {formatCurrency(resultatNet)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Trésorerie Tab */}
      {activeTab === 'tresorerie' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Tableau des Flux de Trésorerie</h4>
          <div className="space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" /> Flux d'exploitation
              </h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Résultat net</span><span>{formatCurrency(resultatNet)}</span></div>
                <div className="flex justify-between"><span>+ Amortissements</span><span>{formatCurrency(actifImmobilise * 0.1)}</span></div>
                <div className="flex justify-between font-medium pt-2 border-t border-border">
                  <span>Total</span>
                  <span className={fluxExploitation >= 0 ? "text-success" : "text-destructive"}>{formatCurrency(fluxExploitation)}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-warning" /> Flux d'investissement
              </h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Acquisitions</span><span className="text-destructive">{formatCurrency(fluxInvestissement)}</span></div>
                <div className="flex justify-between font-medium pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-warning">{formatCurrency(fluxInvestissement)}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-info" /> Flux de financement
              </h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Nouveaux emprunts</span><span className="text-success">{formatCurrency(fluxFinancement)}</span></div>
                <div className="flex justify-between font-medium pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-info">{formatCurrency(fluxFinancement)}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/20 rounded-lg p-4 border-2 border-primary">
              <div className="flex justify-between font-bold">
                <span>VARIATION DE TRÉSORERIE</span>
                <span className={variationTresorerie >= 0 ? "text-success" : "text-destructive"}>
                  {variationTresorerie >= 0 ? '+' : ''}{formatCurrency(variationTresorerie)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ratios Tab */}
      {activeTab === 'ratios' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Ratios de Liquidité</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Ratio de liquidité générale</span>
                  <span className={cn("text-sm font-medium", ratioLiquidite >= 1 ? "text-success" : "text-destructive")}>
                    {ratioLiquidite.toFixed(2)}
                  </span>
                </div>
                <GaugeBar value={Math.min(100, ratioLiquidite * 50)} label="" colorClass={ratioLiquidite >= 1 ? "bg-success" : "bg-destructive"} />
                <p className="text-xs text-muted-foreground mt-1">{ratioLiquidite >= 1 ? '✓ Bonne liquidité' : '⚠ Risque de liquidité'}</p>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">BFR (Besoin en Fonds de Roulement)</span>
                  <span className="text-sm font-medium">{formatCurrency(bfr)}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Fonds de Roulement</span>
                  <span className={cn("text-sm font-medium", fondsRoulement >= 0 ? "text-success" : "text-destructive")}>
                    {formatCurrency(fondsRoulement)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Trésorerie Nette</span>
                  <span className={cn("text-sm font-medium", tresorerieNette >= 0 ? "text-success" : "text-destructive")}>
                    {formatCurrency(tresorerieNette)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Ratios de Rentabilité</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">ROE (Rentabilité financière)</span>
                  <span className={cn("text-sm font-medium", rentabiliteFinanciere >= 10 ? "text-success" : rentabiliteFinanciere >= 0 ? "text-warning" : "text-destructive")}>
                    {rentabiliteFinanciere.toFixed(1)}%
                  </span>
                </div>
                <GaugeBar value={Math.min(100, Math.max(0, rentabiliteFinanciere + 20))} label="" colorClass={rentabiliteFinanciere >= 10 ? "bg-success" : "bg-warning"} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">ROA (Rentabilité économique)</span>
                  <span className={cn("text-sm font-medium", rentabiliteEconomique >= 5 ? "text-success" : "text-warning")}>
                    {rentabiliteEconomique.toFixed(1)}%
                  </span>
                </div>
                <GaugeBar value={Math.min(100, Math.max(0, rentabiliteEconomique * 5))} label="" colorClass={rentabiliteEconomique >= 5 ? "bg-success" : "bg-warning"} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Marge nette</span>
                  <span className={cn("text-sm font-medium", margeNette >= 10 ? "text-success" : margeNette >= 0 ? "text-warning" : "text-destructive")}>
                    {margeNette.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Rotation de l'actif</span>
                  <span className="text-sm font-medium">{rotationActif.toFixed(2)}x</span>
                </div>
              </div>
            </div>
          </div>

          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Ratios d'Endettement</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Ratio d'endettement</span>
                  <span className={cn("text-sm font-medium", ratioEndettement <= 1 ? "text-success" : ratioEndettement <= 2 ? "text-warning" : "text-destructive")}>
                    {ratioEndettement.toFixed(2)}
                  </span>
                </div>
                <GaugeBar value={Math.min(100, ratioEndettement * 33)} label="" colorClass={ratioEndettement <= 1 ? "bg-success" : ratioEndettement <= 2 ? "bg-warning" : "bg-destructive"} />
                <p className="text-xs text-muted-foreground mt-1">
                  {ratioEndettement <= 1 ? '✓ Faible endettement' : ratioEndettement <= 2 ? '⚠ Endettement modéré' : '⚠ Fort endettement'}
                </p>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Capacité de remboursement</span>
                  <span className="text-sm font-medium">
                    {fluxExploitation > 0 ? `${(dettesFinancieres / fluxExploitation).toFixed(1)} ans` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Indicateurs de Risque</h4>
            <div className="space-y-3">
              {[
                { name: 'Santé financière', score: Math.min(100, 50 + rentabiliteFinanciere * 2 + ratioLiquidite * 20 - ratioEndettement * 10), good: 70 },
                { name: 'Solvabilité', score: Math.min(100, capitauxPropres / Math.max(1, totalPassif) * 100), good: 30 },
                { name: 'Autonomie financière', score: Math.min(100, capitauxPropres / Math.max(1, dettesFinancieres + capitauxPropres) * 100), good: 50 },
              ].map(indicator => (
                <div key={indicator.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{indicator.name}</span>
                    <span className={cn("text-sm font-medium flex items-center gap-1", indicator.score >= indicator.good ? "text-success" : "text-warning")}>
                      {indicator.score >= indicator.good ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {indicator.score.toFixed(0)}%
                    </span>
                  </div>
                  <GaugeBar value={indicator.score} label="" colorClass={indicator.score >= indicator.good ? "bg-success" : "bg-warning"} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Budget Prévisionnel Année {year}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Poste</th>
                  <th className="text-right py-2">Budget</th>
                  <th className="text-right py-2">Réalisé</th>
                  <th className="text-right py-2">Écart</th>
                  <th className="text-right py-2">%</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Chiffre d\'affaires', budget: chiffreAffaires * 1.1, realise: chiffreAffaires },
                  { name: 'Charges salariales', budget: company.employees.reduce((s, e) => s + e.brutSalary * 12 * 1.45, 0), realise: company.employees.reduce((s, e) => s + e.brutSalary * month * 1.45, 0) * 12 / month },
                  { name: 'Loyers & charges', budget: company.properties.reduce((s, p) => s + (p.monthlyRent || 0) * 12, 0) * 1.02, realise: company.properties.reduce((s, p) => s + (p.monthlyRent || 0) * 12, 0) },
                  { name: 'Marketing', budget: company.products.reduce((s, p) => s + p.marketingBudget * 12, 0), realise: company.products.reduce((s, p) => s + p.marketingBudget * month, 0) * 12 / month },
                  { name: 'R&D', budget: 50000, realise: company.products.filter(p => p.phase === 'rd').reduce((s, p) => s + p.rdCost, 0) },
                ].map(row => {
                  const ecart = row.realise - row.budget;
                  const pct = row.budget !== 0 ? (row.realise / row.budget - 1) * 100 : 0;
                  return (
                    <tr key={row.name} className="border-b border-border/50">
                      <td className="py-2">{row.name}</td>
                      <td className="text-right py-2">{formatCurrency(row.budget)}</td>
                      <td className="text-right py-2">{formatCurrency(row.realise)}</td>
                      <td className={cn("text-right py-2", ecart >= 0 ? "text-success" : "text-destructive")}>
                        {ecart >= 0 ? '+' : ''}{formatCurrency(ecart)}
                      </td>
                      <td className={cn("text-right py-2", pct >= 0 ? "text-success" : "text-destructive")}>
                        {pct >= 0 ? '+' : ''}{pct.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prévisions Tab */}
      {activeTab === 'previsions' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Prévisions Financières (12 mois)</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[3, 6, 9, 12].map(mois => {
                const projectedRevenue = chiffreAffaires * (1 + 0.05 * (mois / 12));
                const projectedExpenses = chargesExploitation * (1 + 0.02 * (mois / 12));
                const projectedProfit = projectedRevenue - projectedExpenses - projectedRevenue * 0.25;
                const projectedTreasury = company.treasury + projectedProfit / 12 * mois;
                
                return (
                  <div key={mois} className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-2">+{mois} mois</p>
                    <p className="font-medium text-sm">CA: {formatCurrency(projectedRevenue)}</p>
                    <p className={cn("text-xs", projectedProfit >= 0 ? "text-success" : "text-destructive")}>
                      Résultat: {formatCurrency(projectedProfit)}
                    </p>
                    <p className="text-xs text-muted-foreground">Tréso: {formatCurrency(projectedTreasury)}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4">
              <h5 className="font-medium mb-2">Scénarios</h5>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Pessimiste (-10%)</p>
                  <p className="font-medium">{formatCurrency(chiffreAffaires * 0.9)}</p>
                  <p className={cn("text-xs", (chiffreAffaires * 0.9 - chargesExploitation) >= 0 ? "text-success" : "text-destructive")}>
                    {formatCurrency((chiffreAffaires * 0.9 - chargesExploitation) * 0.75)}
                  </p>
                </div>
                <div className="text-center border-x border-border">
                  <p className="text-muted-foreground">Base</p>
                  <p className="font-medium">{formatCurrency(chiffreAffaires)}</p>
                  <p className="text-xs text-success">{formatCurrency(resultatNet)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Optimiste (+15%)</p>
                  <p className="font-medium">{formatCurrency(chiffreAffaires * 1.15)}</p>
                  <p className="text-xs text-success">{formatCurrency((chiffreAffaires * 1.15 - chargesExploitation) * 0.75)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
