import { useState, useMemo } from "react";
import {
  InsuranceState,
  Insurance,
  InsuranceType,
  Claim,
  Incident,
  INSURANCE_DEFINITIONS,
  INSURANCE_PROVIDER_TEMPLATES,
  BROKER_TEMPLATES,
  RiskType
} from "@/types/insurance";
import {
  initializeInsuranceState,
  subscribeInsurance,
  cancelInsurance,
  hireBroker,
  triggerIncident,
  processClaim,
  getUncoveredRisks,
  calculateUninsuredExposure,
  getInsuranceRecommendations
} from "@/utils/insuranceEngine";
import { formatCurrency } from "@/utils/gameEngine";
import {
  Shield,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  AlertTriangle,
  Building,
  Users,
  Briefcase,
  Globe,
  Truck,
  Lock,
  Scale,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Zap,
  Flame,
  Droplets,
  Bug,
  UserX,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface InsurancePanelProps {
  day: number;
  treasury: number;
  employeeCount: number;
  reputationScore: number;
  hasInternational: boolean;
  hasProducts: boolean;
  onTreasuryChange: (amount: number) => void;
}

const insuranceIcons: Record<InsuranceType, React.ElementType> = {
  civil_liability: Shield,
  property: Building,
  business_interruption: AlertTriangle,
  cyber: Bug,
  key_person: UserX,
  directors_officers: Briefcase,
  workplace_accident: Users,
  legal_protection: Scale,
  credit: DollarSign,
  transport: Truck,
  product_recall: Package,
  political_risk: Globe
};

const insuranceColors: Record<InsuranceType, string> = {
  civil_liability: "text-blue-400",
  property: "text-orange-400",
  business_interruption: "text-red-400",
  cyber: "text-purple-400",
  key_person: "text-pink-400",
  directors_officers: "text-indigo-400",
  workplace_accident: "text-green-400",
  legal_protection: "text-amber-400",
  credit: "text-emerald-400",
  transport: "text-cyan-400",
  product_recall: "text-rose-400",
  political_risk: "text-violet-400"
};

const riskIcons: Record<RiskType, React.ElementType> = {
  fire: Flame,
  flood: Droplets,
  theft: Lock,
  natural_disaster: Zap,
  cyber_attack: Bug,
  data_breach: Lock,
  equipment_failure: AlertTriangle,
  supply_chain: Truck,
  employee_injury: Users,
  lawsuit: Scale,
  product_defect: Package,
  client_default: DollarSign,
  transport_damage: Truck,
  key_person_loss: UserX,
  political_event: Globe,
  reputation_crisis: AlertCircle
};

export function InsurancePanel({
  day,
  treasury,
  employeeCount,
  reputationScore,
  hasInternational,
  hasProducts,
  onTreasuryChange
}: InsurancePanelProps) {
  const [insState, setInsState] = useState<InsuranceState>(() => initializeInsuranceState());
  const [activeTab, setActiveTab] = useState<'policies' | 'subscribe' | 'claims' | 'risks' | 'broker'>('policies');
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceType | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedCoverage, setSelectedCoverage] = useState<Insurance['coverageLevel']>('standard');

  const recommendations = useMemo(() => 
    getInsuranceRecommendations(insState, employeeCount, hasInternational, hasProducts),
    [insState, employeeCount, hasInternational, hasProducts]
  );

  const uncoveredRisks = useMemo(() => getUncoveredRisks(insState), [insState]);
  const uninsuredExposure = useMemo(() => calculateUninsuredExposure(insState), [insState]);

  const activePolicies = insState.policies.filter(p => p.status === 'active');

  const handleSubscribe = () => {
    if (!selectedInsurance || !selectedProvider) {
      toast.error("Sélectionnez une assurance et un fournisseur");
      return;
    }

    const result = subscribeInsurance(
      insState,
      selectedInsurance,
      selectedProvider,
      selectedCoverage,
      reputationScore,
      day
    );

    if (result.success && result.insurance) {
      setInsState(result.state);
      onTreasuryChange(-result.insurance.monthlyPremium);
      toast.success(result.message);
      setSelectedInsurance(null);
      setSelectedProvider(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleCancel = (insuranceId: string) => {
    const newState = cancelInsurance(insState, insuranceId);
    setInsState(newState);
    toast.info("Assurance résiliée");
  };

  const handleHireBroker = (brokerIndex: number) => {
    const broker = BROKER_TEMPLATES[brokerIndex];
    const newState = hireBroker(insState, `broker_${brokerIndex}`);
    setInsState(newState);
    toast.success(`Courtier ${broker.name} engagé`);
  };

  const handleSimulateIncident = (riskType: RiskType) => {
    const result = triggerIncident(insState, riskType, day);
    setInsState(result.state);
    
    if (result.isCovered) {
      toast.warning(`Incident: ${result.incident.title} - Couvert par assurance!`);
    } else {
      toast.error(`Incident: ${result.incident.title} - NON COUVERT! Perte: ${formatCurrency(result.incident.directDamage)}`);
      onTreasuryChange(-result.incident.directDamage);
    }
  };

  const handleProcessClaim = (claimId: string, approve: boolean) => {
    const claim = insState.claims.find(c => c.id === claimId);
    if (!claim) return;

    const newState = processClaim(insState, claimId, approve, day);
    setInsState(newState);

    if (approve) {
      const paidAmount = Math.max(0, claim.claimedAmount - claim.deductibleApplied);
      onTreasuryChange(paidAmount);
      toast.success(`Sinistre approuvé! Remboursement: ${formatCurrency(paidAmount)}`);
    } else {
      toast.error("Sinistre refusé");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-400" />
            Assurances & Gestion des Risques
          </h2>
          <p className="text-sm text-muted-foreground">
            Protégez votre entreprise contre les imprévus
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{activePolicies.length}</div>
            <div className="text-xs text-muted-foreground">Polices actives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{formatCurrency(insState.totalPremiums)}</div>
            <div className="text-xs text-muted-foreground">Primes/mois</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{formatCurrency(insState.totalCoverage)}</div>
            <div className="text-xs text-muted-foreground">Couverture totale</div>
          </div>
        </div>
      </div>

      {/* Alerte exposition */}
      {uninsuredExposure > 50000 && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-3">
          <ShieldX className="w-6 h-6 text-red-400" />
          <div>
            <span className="font-medium text-red-400">Exposition non assurée: </span>
            <span className="text-red-300">{formatCurrency(uninsuredExposure)}/an de risque potentiel</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'policies', label: 'Mes polices', icon: ShieldCheck },
          { id: 'subscribe', label: 'Souscrire', icon: Plus },
          { id: 'claims', label: 'Sinistres', icon: FileText },
          { id: 'risks', label: 'Risques', icon: AlertTriangle },
          { id: 'broker', label: 'Courtier', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 hover:bg-secondary"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm">{tab.label}</span>
            {tab.id === 'claims' && insState.claims.filter(c => c.status === 'pending').length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 rounded-full">
                {insState.claims.filter(c => c.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'policies' && (
            <div className="space-y-4">
              {/* Recommandations */}
              {recommendations.length > 0 && (
                <div className="glass-effect rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    Recommandations
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {recommendations.slice(0, 4).map(rec => {
                      const Icon = insuranceIcons[rec.type];
                      return (
                        <div
                          key={rec.type}
                          className={cn(
                            "flex-shrink-0 p-3 rounded-lg border cursor-pointer transition-all hover:scale-105",
                            getPriorityColor(rec.priority),
                            "border-current/30"
                          )}
                          onClick={() => {
                            setActiveTab('subscribe');
                            setSelectedInsurance(rec.type);
                          }}
                        >
                          <Icon className="w-5 h-5 mb-1" />
                          <div className="text-sm font-medium whitespace-nowrap">
                            {INSURANCE_DEFINITIONS.find(d => d.type === rec.type)?.name.split(' ').slice(0, 2).join(' ')}
                          </div>
                          <div className="text-xs opacity-70">{rec.priority}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Polices actives */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePolicies.map(policy => {
                  const Icon = insuranceIcons[policy.type];
                  const color = insuranceColors[policy.type];
                  
                  return (
                    <div key={policy.id} className="glass-effect rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-5 h-5", color)} />
                          <span className="font-medium text-sm">{policy.name}</span>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded",
                          policy.coverageLevel === 'premium' ? "bg-purple-500/20 text-purple-400" :
                          policy.coverageLevel === 'unlimited' ? "bg-amber-500/20 text-amber-400" :
                          policy.coverageLevel === 'basic' ? "bg-gray-500/20 text-gray-400" :
                          "bg-blue-500/20 text-blue-400"
                        )}>
                          {policy.coverageLevel}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Couverture</span>
                          <span className="font-medium">{formatCurrency(policy.coverageAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Franchise</span>
                          <span>{formatCurrency(policy.deductible)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prime/mois</span>
                          <span className="text-amber-400">{formatCurrency(policy.monthlyPremium)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bonus/Malus</span>
                          <span className={policy.bonusMalus < 0 ? "text-green-400" : policy.bonusMalus > 0 ? "text-red-400" : ""}>
                            {policy.bonusMalus > 0 ? '+' : ''}{policy.bonusMalus}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {policy.provider.name}
                        </span>
                        <button
                          onClick={() => handleCancel(policy.id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Résilier
                        </button>
                      </div>
                    </div>
                  );
                })}

                {activePolicies.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <ShieldX className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Aucune assurance active</h3>
                    <p className="text-muted-foreground mb-4">
                      Votre entreprise n'est pas protégée contre les risques
                    </p>
                    <button
                      onClick={() => setActiveTab('subscribe')}
                      className="px-4 py-2 bg-primary rounded-lg"
                    >
                      Souscrire une assurance
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'subscribe' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Liste des assurances */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-semibold">Choisir une assurance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {INSURANCE_DEFINITIONS.map(ins => {
                    const Icon = insuranceIcons[ins.type];
                    const color = insuranceColors[ins.type];
                    const isActive = activePolicies.some(p => p.type === ins.type);
                    const isSelected = selectedInsurance === ins.type;
                    
                    return (
                      <div
                        key={ins.type}
                        onClick={() => !isActive && setSelectedInsurance(ins.type)}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all",
                          isActive ? "opacity-50 cursor-not-allowed border-green-500/50" :
                          isSelected ? "ring-2 ring-primary border-primary" :
                          "border-white/10 hover:border-white/30"
                        )}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={cn("w-6 h-6", color)} />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{ins.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">{ins.category}</div>
                          </div>
                          {isActive && <CheckCircle className="w-5 h-5 text-green-400" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{ins.description}</p>
                        <div className="flex justify-between text-xs">
                          <span>À partir de {formatCurrency(ins.monthlyPremium)}/mois</span>
                          <span className="text-green-400">Max {formatCurrency(ins.coverageAmount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-4">
                {selectedInsurance && (
                  <>
                    <div className="glass-effect rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Fournisseur</h3>
                      <div className="space-y-2">
                        {INSURANCE_PROVIDER_TEMPLATES
                          .filter(p => p.specialties.includes(selectedInsurance))
                          .map((provider, i) => (
                            <div
                              key={i}
                              onClick={() => setSelectedProvider(`provider_${i}`)}
                              className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-all",
                                selectedProvider === `provider_${i}` 
                                  ? "ring-2 ring-primary border-primary" 
                                  : "border-white/10 hover:border-white/30"
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{provider.name}</span>
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded",
                                  provider.tier === 'premium' ? "bg-purple-500/20 text-purple-400" :
                                  provider.tier === 'standard' ? "bg-blue-500/20 text-blue-400" :
                                  "bg-gray-500/20 text-gray-400"
                                )}>
                                  {provider.tier}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                                <span>Fiabilité: {provider.reliability}%</span>
                                <span>Prix: ×{provider.priceMultiplier}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="glass-effect rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Niveau de couverture</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {(['basic', 'standard', 'premium', 'unlimited'] as const).map(level => (
                          <button
                            key={level}
                            onClick={() => setSelectedCoverage(level)}
                            className={cn(
                              "p-2 rounded-lg border text-sm transition-all capitalize",
                              selectedCoverage === level
                                ? "ring-2 ring-primary border-primary"
                                : "border-white/10 hover:border-white/30"
                            )}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSubscribe}
                      disabled={!selectedProvider}
                      className="w-full py-3 bg-primary hover:bg-primary/90 rounded-lg font-medium disabled:opacity-50"
                    >
                      Souscrire
                    </button>
                  </>
                )}

                {!selectedInsurance && (
                  <div className="glass-effect rounded-lg p-4 text-center">
                    <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Sélectionnez une assurance pour configurer votre police
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'claims' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Sinistres en cours */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Sinistres en cours</h3>
                <div className="space-y-2">
                  {insState.claims.filter(c => c.status === 'pending' || c.status === 'investigating').map(claim => (
                    <div key={claim.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm capitalize">{claim.eventType.replace('_', ' ')}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded",
                          claim.status === 'pending' ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-blue-500/20 text-blue-400"
                        )}>
                          {claim.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{claim.description}</p>
                      <div className="flex justify-between text-xs mb-3">
                        <span>Réclamé: {formatCurrency(claim.claimedAmount)}</span>
                        <span>Franchise: {formatCurrency(claim.deductibleApplied)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProcessClaim(claim.id, true)}
                          className="flex-1 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => handleProcessClaim(claim.id, false)}
                          className="flex-1 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs"
                        >
                          Refuser
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {insState.claims.filter(c => c.status === 'pending' || c.status === 'investigating').length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun sinistre en attente
                    </p>
                  )}
                </div>
              </div>

              {/* Historique */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Historique des sinistres</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {insState.claims.filter(c => c.status === 'paid' || c.status === 'rejected').map(claim => (
                    <div key={claim.id} className="p-2 rounded bg-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-sm capitalize">{claim.eventType.replace('_', ' ')}</span>
                        <div className="text-xs text-muted-foreground">
                          Jour {claim.eventDate}
                        </div>
                      </div>
                      <div className="text-right">
                        {claim.status === 'paid' ? (
                          <span className="text-green-400 text-sm">+{formatCurrency(claim.paidAmount || 0)}</span>
                        ) : (
                          <span className="text-red-400 text-xs">Refusé</span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {insState.claims.filter(c => c.status === 'paid' || c.status === 'rejected').length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun historique
                    </p>
                  )}
                </div>
              </div>

              {/* Incidents */}
              <div className="glass-effect rounded-lg p-4 lg:col-span-2">
                <h3 className="font-semibold mb-3">Incidents récents</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {insState.incidents.slice(-8).map(incident => {
                    const Icon = riskIcons[incident.type] || AlertTriangle;
                    return (
                      <div
                        key={incident.id}
                        className={cn(
                          "p-3 rounded-lg border",
                          incident.isCovered ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
                        )}
                      >
                        <Icon className={cn("w-5 h-5 mb-1", incident.isCovered ? "text-green-400" : "text-red-400")} />
                        <div className="text-sm font-medium">{incident.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {incident.isCovered ? "Couvert" : `Perte: ${formatCurrency(incident.directDamage)}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Risques non couverts */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-red-400">Risques non couverts ({uncoveredRisks.length})</h3>
                <div className="space-y-2">
                  {uncoveredRisks.map(risk => {
                    const Icon = riskIcons[risk.type] || AlertTriangle;
                    return (
                      <div key={risk.id} className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-red-400" />
                          <span className="font-medium text-sm">{risk.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{risk.description}</p>
                        <div className="flex justify-between text-xs">
                          <span>Probabilité: {risk.probability}%/an</span>
                          <span className="text-red-400">Dommage max: {formatCurrency(risk.maxDamage)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simuler un incident */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Simuler un incident (test)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['fire', 'cyber_attack', 'employee_injury', 'client_default', 'lawsuit', 'product_defect'] as RiskType[]).map(riskType => {
                    const Icon = riskIcons[riskType];
                    return (
                      <button
                        key={riskType}
                        onClick={() => handleSimulateIncident(riskType)}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                      >
                        <Icon className="w-5 h-5 mb-1 text-orange-400" />
                        <div className="text-sm font-medium capitalize">{riskType.replace('_', ' ')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'broker' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Courtier actuel */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Votre courtier</h3>
                {insState.broker ? (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{insState.broker.name}</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Réduction primes:</span>
                        <span className="ml-2 text-green-400">-{insState.broker.effectiveness}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Commission:</span>
                        <span className="ml-2">{insState.broker.fee}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun courtier engagé</p>
                    <p className="text-xs mt-1">Un courtier négocie de meilleurs tarifs</p>
                  </div>
                )}
              </div>

              {/* Courtiers disponibles */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Courtiers disponibles</h3>
                <div className="space-y-3">
                  {BROKER_TEMPLATES.map((broker, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{broker.name}</span>
                        <span className="text-sm text-green-400">-{broker.effectiveness}% sur primes</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-3">
                        <span>Commission: {broker.fee}%</span>
                        <span>Réputation: {broker.reputation}%</span>
                      </div>
                      <button
                        onClick={() => handleHireBroker(i)}
                        disabled={insState.broker !== undefined}
                        className="w-full py-2 bg-primary hover:bg-primary/90 rounded text-sm disabled:opacity-50"
                      >
                        Engager
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
