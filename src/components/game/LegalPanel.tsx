import { useState } from "react";
import { LegalCase, Lawyer, IntellectualProperty, LegalCaseType } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { GaugeBar } from "./GaugeBar";
import { Scale, Shield, AlertTriangle, FileText, Plus, Gavel } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalPanelProps {
  legalCases: LegalCase[];
  lawyers: Lawyer[];
  intellectualProperty: IntellectualProperty[];
  treasury: number;
  onHireLawyer: (lawyer: Partial<Lawyer>) => void;
  onAssignLawyer: (caseId: string, lawyerId: string) => void;
  onRegisterIP: (ip: Partial<IntellectualProperty>) => void;
}

const caseTypeLabels: Record<LegalCaseType, { label: string; icon: string }> = {
  prudhommes: { label: "Prud'hommes", icon: "⚖️" },
  commercial: { label: "Litige commercial", icon: "💼" },
  fiscal: { label: "Contentieux fiscal", icon: "📊" },
  propriete_intellectuelle: { label: "Propriété intellectuelle", icon: "💡" },
  contrat: { label: "Litige contractuel", icon: "📝" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  preparation: { label: "Préparation", color: "text-muted-foreground" },
  en_cours: { label: "En cours", color: "text-info" },
  mediation: { label: "Médiation", color: "text-warning" },
  jugement: { label: "Jugement", color: "text-primary" },
  appel: { label: "Appel", color: "text-destructive" },
  cloture: { label: "Clôturé", color: "text-success" },
};

const availableLawyers: Partial<Lawyer>[] = [
  { name: "Me. Dupont", specialty: 'commercial', hourlyRate: 200, successRate: 70, reputation: 60 },
  { name: "Me. Martin", specialty: 'prudhommes', hourlyRate: 150, successRate: 75, reputation: 65 },
  { name: "Me. Bernard", specialty: 'fiscal', hourlyRate: 300, successRate: 85, reputation: 80 },
  { name: "Me. Durand", specialty: 'propriete_intellectuelle', hourlyRate: 250, successRate: 80, reputation: 75 },
  { name: "Me. Lefebvre (Elite)", specialty: 'commercial', hourlyRate: 500, successRate: 95, reputation: 95 },
];

export function LegalPanel({
  legalCases,
  lawyers,
  intellectualProperty,
  treasury,
  onHireLawyer,
  onAssignLawyer,
  onRegisterIP,
}: LegalPanelProps) {
  const [activeTab, setActiveTab] = useState<'cases' | 'lawyers' | 'ip'>('cases');

  const activeCases = legalCases.filter(c => c.status !== 'cloture');
  const totalLegalCosts = legalCases.reduce((sum, c) => sum + c.actualCost, 0);
  const potentialLiabilities = activeCases.reduce((sum, c) => sum + c.potentialLoss, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="game-panel text-center">
          <Scale className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Affaires en cours</p>
          <p className={cn("text-xl font-bold", activeCases.length > 0 ? "text-warning" : "text-success")}>
            {activeCases.length}
          </p>
        </div>
        <div className="game-panel text-center">
          <Gavel className="w-6 h-6 text-info mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Avocats</p>
          <p className="text-xl font-bold">{lawyers.length}</p>
        </div>
        <div className="game-panel text-center">
          <Shield className="w-6 h-6 text-warning mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Frais juridiques</p>
          <p className="text-xl font-bold text-destructive">{formatCurrency(totalLegalCosts)}</p>
        </div>
        <div className="game-panel text-center">
          <AlertTriangle className="w-6 h-6 text-destructive mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Risque potentiel</p>
          <p className="text-xl font-bold text-destructive">{formatCurrency(potentialLiabilities)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'cases', label: 'Contentieux', icon: Scale, badge: activeCases.length },
          { id: 'lawyers', label: 'Avocats', icon: Gavel },
          { id: 'ip', label: 'Propriété Intellectuelle', icon: Shield },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors relative",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cases Tab */}
      {activeTab === 'cases' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Affaires juridiques</h4>
          {legalCases.length === 0 ? (
            <div className="text-center py-8">
              <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Aucune affaire en cours. Espérons que ça dure !
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {legalCases.map(legalCase => {
                const typeInfo = caseTypeLabels[legalCase.type];
                const statusInfo = statusLabels[legalCase.status];
                const assignedLawyer = lawyers.find(l => l.id === legalCase.lawyerId);

                return (
                  <div key={legalCase.id} className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-display font-semibold flex items-center gap-2">
                          <span>{typeInfo.icon}</span>
                          {legalCase.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          vs. {legalCase.opponent} • Débuté jour {legalCase.startDate}
                        </p>
                      </div>
                      <span className={cn("text-sm px-2 py-1 rounded-full bg-secondary", statusInfo.color)}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{legalCase.description}</p>

                    <div className="grid grid-cols-4 gap-3 text-xs mb-3">
                      <div>
                        <span className="text-muted-foreground">Coût estimé</span>
                        <p className="font-medium text-warning">{formatCurrency(legalCase.estimatedCost)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Coût actuel</span>
                        <p className="font-medium text-destructive">{formatCurrency(legalCase.actualCost)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Risque</span>
                        <p className="font-medium text-destructive">{formatCurrency(legalCase.potentialLoss)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Chances</span>
                        <p className={cn("font-medium", legalCase.winProbability >= 50 ? "text-success" : "text-warning")}>
                          {legalCase.winProbability}%
                        </p>
                      </div>
                    </div>

                    <GaugeBar 
                      value={legalCase.winProbability} 
                      label="Probabilité de succès" 
                      colorClass={legalCase.winProbability >= 60 ? "bg-success" : legalCase.winProbability >= 40 ? "bg-warning" : "bg-destructive"} 
                    />

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Avocat: </span>
                        <span className="font-medium">
                          {assignedLawyer ? assignedLawyer.name : 'Non assigné'}
                        </span>
                      </div>
                      {!assignedLawyer && lawyers.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) onAssignLawyer(legalCase.id, e.target.value);
                          }}
                          className="bg-background border border-border rounded-lg px-2 py-1 text-xs"
                        >
                          <option value="">Assigner un avocat...</option>
                          {lawyers
                            .filter(l => l.specialty === legalCase.type)
                            .map(l => (
                              <option key={l.id} value={l.id}>{l.name}</option>
                            ))
                          }
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Lawyers Tab */}
      {activeTab === 'lawyers' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Available Lawyers */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Avocats disponibles</h4>
            <div className="space-y-3">
              {availableLawyers.map((lawyer, idx) => (
                <div key={idx} className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">{lawyer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {caseTypeLabels[lawyer.specialty!].label}
                      </p>
                    </div>
                    <button
                      onClick={() => onHireLawyer(lawyer)}
                      className="btn-game-primary text-xs py-1 px-2"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Taux horaire</span>
                      <p className="font-medium">{formatCurrency(lawyer.hourlyRate!)}/h</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Succès</span>
                      <p className={cn("font-medium", (lawyer.successRate || 0) >= 80 ? "text-success" : "text-warning")}>
                        {lawyer.successRate}%
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Réputation</span>
                      <p className="font-medium">{lawyer.reputation}/100</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Lawyers */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Mes avocats ({lawyers.length})</h4>
            {lawyers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun avocat sous contrat. Engagez-en en cas de litige.
              </p>
            ) : (
              <div className="space-y-3">
                {lawyers.map(lawyer => (
                  <div key={lawyer.id} className="bg-secondary/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{lawyer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {caseTypeLabels[lawyer.specialty].label}
                        </p>
                      </div>
                      <span className="text-xs text-success">{lawyer.successRate}% succès</span>
                    </div>
                    <GaugeBar value={lawyer.reputation} label="Réputation" colorClass="bg-primary" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* IP Tab */}
      {activeTab === 'ip' && (
        <div className="game-panel">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-display font-semibold">Propriété intellectuelle</h4>
            <button
              onClick={() => onRegisterIP({ type: 'marque', name: 'Nouvelle marque', annualFee: 500, value: 10000 })}
              className="btn-game-primary text-xs flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Déposer
            </button>
          </div>
          
          {intellectualProperty.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Aucune propriété intellectuelle enregistrée. Protégez vos innovations !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {intellectualProperty.map(ip => (
                <div key={ip.id} className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{ip.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{ip.type}</p>
                    </div>
                    <span className="text-xs text-primary">{formatCurrency(ip.value)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Enregistré</span>
                      <p className="font-medium">Jour {ip.registrationDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expire</span>
                      <p className="font-medium">Jour {ip.expirationDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frais annuels</span>
                      <p className="font-medium text-warning">{formatCurrency(ip.annualFee)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
