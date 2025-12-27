import { useState } from "react";
import { Employee, Training, SocialBenefit, Union, UnionDemand, TrainingType, BenefitType } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { GaugeBar } from "./GaugeBar";
import { 
  GraduationCap, 
  Heart, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HRAdvancedPanelProps {
  employees: Employee[];
  socialBenefits: SocialBenefit[];
  unions: Union[];
  treasury: number;
  onStartTraining: (employeeId: string, training: Partial<Training>) => void;
  onToggleBenefit: (benefit: BenefitType) => void;
  onNegotiateUnion: (unionId: string, demandId: string, accept: boolean) => void;
  onPromoteEmployee: (employeeId: string) => void;
  onGiveRaise: (employeeId: string, amount: number) => void;
}

const trainingOptions: { type: TrainingType; name: string; duration: number; cost: number; skillBoost: number }[] = [
  { type: 'technique', name: "Formation Technique", duration: 5, cost: 2000, skillBoost: 10 },
  { type: 'management', name: "Leadership & Management", duration: 10, cost: 5000, skillBoost: 15 },
  { type: 'langue', name: "Anglais Professionnel", duration: 15, cost: 3000, skillBoost: 8 },
  { type: 'securite', name: "Sécurité au travail", duration: 2, cost: 500, skillBoost: 3 },
  { type: 'commercial', name: "Techniques de vente", duration: 7, cost: 3500, skillBoost: 12 },
];

const benefitOptions: { type: BenefitType; name: string; cost: number; moralBonus: number }[] = [
  { type: 'mutuelle', name: "Mutuelle entreprise", cost: 80, moralBonus: 10 },
  { type: 'tickets_resto', name: "Tickets restaurant", cost: 150, moralBonus: 8 },
  { type: 'interessement', name: "Intéressement", cost: 0, moralBonus: 15 },
  { type: 'participation', name: "Participation", cost: 0, moralBonus: 12 },
  { type: 'ce', name: "Comité d'entreprise", cost: 50, moralBonus: 10 },
  { type: 'teletravail', name: "Télétravail", cost: 20, moralBonus: 15 },
  { type: 'voiture', name: "Voiture de fonction", cost: 500, moralBonus: 20 },
];

const priorityColors = {
  faible: "text-muted-foreground",
  moyenne: "text-info",
  haute: "text-warning",
  critique: "text-destructive",
};

export function HRAdvancedPanel({
  employees,
  socialBenefits,
  unions,
  treasury,
  onStartTraining,
  onToggleBenefit,
  onNegotiateUnion,
  onPromoteEmployee,
  onGiveRaise,
}: HRAdvancedPanelProps) {
  const [activeTab, setActiveTab] = useState<'training' | 'benefits' | 'unions' | 'careers'>('training');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [raiseAmount, setRaiseAmount] = useState(200);

  const avgMoral = employees.length > 0
    ? employees.reduce((sum, e) => sum + e.moral, 0) / employees.length
    : 0;

  const totalBenefitsCost = socialBenefits
    .filter(b => b.active)
    .reduce((sum, b) => sum + b.monthlyCost * employees.length, 0);

  const unionTension = unions.length > 0
    ? unions.reduce((sum, u) => sum + (100 - u.relationship), 0) / unions.length
    : 0;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="game-panel text-center">
          <GraduationCap className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">En formation</p>
          <p className="text-xl font-bold">
            {employees.filter(e => e.trainings.some(t => !t.completed)).length}
          </p>
        </div>
        <div className="game-panel text-center">
          <Heart className="w-6 h-6 text-success mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Moral moyen</p>
          <p className={cn("text-xl font-bold", avgMoral >= 70 ? "text-success" : avgMoral >= 40 ? "text-warning" : "text-destructive")}>
            {Math.round(avgMoral)}%
          </p>
        </div>
        <div className="game-panel text-center">
          <TrendingUp className="w-6 h-6 text-info mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Coût avantages</p>
          <p className="text-xl font-bold text-warning">{formatCurrency(totalBenefitsCost)}/mois</p>
        </div>
        <div className="game-panel text-center">
          <Users className="w-6 h-6 text-warning mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Tension syndicale</p>
          <p className={cn("text-xl font-bold", unionTension < 30 ? "text-success" : unionTension < 60 ? "text-warning" : "text-destructive")}>
            {Math.round(unionTension)}%
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'training', label: 'Formations', icon: GraduationCap },
          { id: 'benefits', label: 'Avantages', icon: Heart },
          { id: 'unions', label: 'Syndicats', icon: Users },
          { id: 'careers', label: 'Carrières', icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
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

      {/* Training Tab */}
      {activeTab === 'training' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Available Trainings */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Formations disponibles</h4>
            <div className="space-y-3">
              {trainingOptions.map(training => (
                <div key={training.type} className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">{training.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {training.duration} jours • +{training.skillBoost} compétences
                      </p>
                    </div>
                    <span className="text-sm font-medium text-warning">
                      {formatCurrency(training.cost)}
                    </span>
                  </div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        onStartTraining(e.target.value, training);
                        e.target.value = '';
                      }
                    }}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="">Sélectionner un employé...</option>
                    {employees
                      .filter(e => !e.trainings.some(t => !t.completed))
                      .map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))
                    }
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Trainings in Progress */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Formations en cours</h4>
            {employees.filter(e => e.trainings.some(t => !t.completed)).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune formation en cours. Formez vos employés pour améliorer leurs compétences.
              </p>
            ) : (
              <div className="space-y-3">
                {employees
                  .filter(e => e.trainings.some(t => !t.completed))
                  .map(emp => {
                    const activeTraining = emp.trainings.find(t => !t.completed);
                    return (
                      <div key={emp.id} className="bg-secondary/50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{activeTraining?.name}</p>
                          </div>
                          <Clock className="w-4 h-4 text-warning" />
                        </div>
                        <GaugeBar value={50} label="Progression" colorClass="bg-primary" />
                      </div>
                    );
                  })
                }
              </div>
            )}
          </div>
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Avantages sociaux</h4>
          <div className="grid grid-cols-2 gap-4">
            {benefitOptions.map(benefit => {
              const active = socialBenefits.find(b => b.type === benefit.type)?.active;
              const monthlyCost = benefit.cost * employees.length;
              
              return (
                <div 
                  key={benefit.type} 
                  className={cn(
                    "rounded-lg p-4 border-2 transition-colors cursor-pointer",
                    active 
                      ? "bg-primary/10 border-primary" 
                      : "bg-secondary/50 border-transparent hover:border-primary/50"
                  )}
                  onClick={() => onToggleBenefit(benefit.type)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{benefit.name}</p>
                      <p className="text-xs text-muted-foreground">
                        +{benefit.moralBonus}% moral
                      </p>
                    </div>
                    {active ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className={cn("text-sm font-medium", active ? "text-warning" : "text-muted-foreground")}>
                    {monthlyCost > 0 ? `${formatCurrency(monthlyCost)}/mois` : 'Variable selon résultats'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unions Tab */}
      {activeTab === 'unions' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Relations syndicales</h4>
          {unions.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Aucun syndicat actif. Un syndicat peut se former si le moral est bas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {unions.map(union => (
                <div key={union.id} className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-semibold">{union.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {union.memberCount} membres • Influence: {union.influence}%
                      </p>
                    </div>
                    <GaugeBar 
                      value={union.relationship} 
                      label="Relation" 
                      colorClass={union.relationship >= 60 ? "bg-success" : union.relationship >= 30 ? "bg-warning" : "bg-destructive"}
                    />
                  </div>

                  {union.demands.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Revendications :</p>
                      {union.demands.map(demand => (
                        <div key={demand.id} className="bg-background/50 rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <p className="text-sm">{demand.description}</p>
                            <p className={cn("text-xs", priorityColors[demand.priority])}>
                              Priorité {demand.priority} • Coût: {formatCurrency(demand.costImpact)}/mois
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onNegotiateUnion(union.id, demand.id, true)}
                              className="btn-game-primary text-xs py-1 px-2"
                            >
                              Accepter
                            </button>
                            <button
                              onClick={() => onNegotiateUnion(union.id, demand.id, false)}
                              className="btn-game-destructive text-xs py-1 px-2"
                            >
                              Refuser
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Careers Tab */}
      {activeTab === 'careers' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Gestion des carrières</h4>
          <div className="grid grid-cols-2 gap-4">
            {employees.map(emp => (
              <div key={emp.id} className="bg-secondary/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.role}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {emp.experience} ans exp.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-muted-foreground">Ancienneté</span>
                    <p className="font-medium">{emp.seniority} mois</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Promotions</span>
                    <p className="font-medium">{emp.promotions}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Salaire</span>
                    <p className="font-medium">{formatCurrency(emp.brutSalary)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dernière augm.</span>
                    <p className="font-medium">{emp.lastRaise ? `Jour ${emp.lastRaise}` : 'Jamais'}</p>
                  </div>
                </div>

                <GaugeBar value={emp.skills} label="Compétences" colorClass="bg-primary" />

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onPromoteEmployee(emp.id)}
                    className="flex-1 btn-game-primary text-xs py-1"
                  >
                    Promouvoir
                  </button>
                  <button
                    onClick={() => onGiveRaise(emp.id, raiseAmount)}
                    className="flex-1 btn-game-secondary text-xs py-1"
                  >
                    Augmenter (+{formatCurrency(raiseAmount)})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
