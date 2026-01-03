import { useState, useMemo } from "react";
import {
  ReputationState,
  Scandal,
  Rumor,
  CrisisResponse,
  PRAgent,
  Influencer,
  MediaOutlet,
  PRAgency,
  PR_AGENCY_TEMPLATES,
  INFLUENCER_TEMPLATES,
  StakeholderType
} from "@/types/reputation";
import {
  initializeReputationState,
  calculateOverallReputation,
  respondToCrisis,
  hirePRAgent,
  contractPRAgency,
  hireInfluencer,
  generateRandomRumor,
  startLobbyingCampaign,
  publishPressRelease
} from "@/utils/reputationEngine";
import { formatCurrency } from "@/utils/gameEngine";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Newspaper,
  Radio,
  Tv,
  Globe,
  MessageSquare,
  AlertTriangle,
  Shield,
  Star,
  Heart,
  Megaphone,
  Eye,
  UserPlus,
  Building,
  Gavel,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Handshake,
  XCircle,
  Scale,
  DollarSign,
  Clock,
  Target,
  Zap,
  Award,
  Crown,
  Briefcase,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ReputationPanelProps {
  day: number;
  treasury: number;
  onTreasuryChange: (amount: number) => void;
}

const stakeholderConfig: Record<StakeholderType, { name: string; icon: React.ElementType; color: string }> = {
  clients: { name: "Clients", icon: Users, color: "text-blue-400" },
  employees: { name: "Employés", icon: Users, color: "text-green-400" },
  investors: { name: "Investisseurs", icon: TrendingUp, color: "text-emerald-400" },
  media: { name: "Médias", icon: Newspaper, color: "text-purple-400" },
  regulators: { name: "Régulateurs", icon: Gavel, color: "text-orange-400" },
  public: { name: "Grand Public", icon: Globe, color: "text-cyan-400" }
};

const crisisResponseConfig: Record<CrisisResponse, { name: string; icon: React.ElementType; color: string; cost: number }> = {
  deny: { name: "Nier", icon: XCircle, color: "text-gray-400", cost: 1000 },
  apologize: { name: "S'excuser", icon: Heart, color: "text-pink-400", cost: 5000 },
  blame: { name: "Accuser", icon: Target, color: "text-red-400", cost: 2000 },
  compensate: { name: "Compenser", icon: DollarSign, color: "text-green-400", cost: 20000 },
  silence: { name: "Silence", icon: Minus, color: "text-gray-500", cost: 0 },
  counter_attack: { name: "Contre-attaque", icon: Zap, color: "text-amber-400", cost: 10000 },
  legal_action: { name: "Action légale", icon: Scale, color: "text-indigo-400", cost: 30000 }
};

export function ReputationPanel({ day, treasury, onTreasuryChange }: ReputationPanelProps) {
  const [repState, setRepState] = useState<ReputationState>(() => initializeReputationState());
  const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'crisis' | 'pr' | 'lobbying'>('overview');
  const [selectedScandal, setSelectedScandal] = useState<Scandal | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ stakeholders: true, trends: true });

  const overallScore = useMemo(() => calculateOverallReputation(repState), [repState]);

  const handleCrisisResponse = (scandalId: string, response: CrisisResponse) => {
    const config = crisisResponseConfig[response];
    if (treasury < config.cost) {
      toast.error("Budget insuffisant");
      return;
    }

    const result = respondToCrisis(repState, scandalId, response, day, config.cost);
    if (result.success) {
      setRepState(result.state);
      onTreasuryChange(-config.cost);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleHirePRAgent = (type: PRAgent['type'], level: number) => {
    const { state, agent } = hirePRAgent(repState, type, level);
    setRepState(state);
    toast.success(`${agent.name} recruté comme ${type}`);
  };

  const handleContractAgency = (agencyIndex: number) => {
    const agency = PR_AGENCY_TEMPLATES[agencyIndex];
    if (treasury < agency.monthlyFee * 3) {
      toast.error("Budget insuffisant (3 mois d'avance requis)");
      return;
    }

    const newState = contractPRAgency(repState, `agency_${agencyIndex}`, 90, day);
    setRepState(newState);
    onTreasuryChange(-agency.monthlyFee * 3);
    toast.success(`Contrat signé avec ${agency.name}`);
  };

  const handleHireInfluencer = (influencerIndex: number) => {
    const template = INFLUENCER_TEMPLATES[influencerIndex];
    if (treasury < template.cost * 3) {
      toast.error("Budget insuffisant");
      return;
    }

    const newState = hireInfluencer(repState, `influencer_${influencerIndex}`, 90, day);
    setRepState(newState);
    onTreasuryChange(-template.cost * 3);
    toast.success(`${template.name} recruté comme influenceur`);
  };

  const handlePublishPressRelease = () => {
    const budget = 5000;
    if (treasury < budget) {
      toast.error("Budget insuffisant");
      return;
    }

    const newState = publishPressRelease(repState, "Communiqué officiel", "Notre entreprise annonce...", budget, day);
    setRepState(newState);
    onTreasuryChange(-budget);
    toast.success("Communiqué de presse publié");
  };

  const handleStartLobbying = (target: 'government' | 'regulator' | 'association' | 'ngo') => {
    const budget = 50000;
    if (treasury < budget) {
      toast.error("Budget insuffisant");
      return;
    }

    const newState = startLobbyingCampaign(repState, target, "Influence réglementaire", budget, day);
    setRepState(newState);
    onTreasuryChange(-budget);
    toast.success("Campagne de lobbying lancée");
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getTrendIcon = () => {
    switch (repState.score.trend) {
      case 'rising': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'falling': return <TrendingDown className="w-5 h-5 text-red-400" />;
      default: return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-yellow-400";
    if (score >= 20) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            Réputation & Relations Publiques
          </h2>
          <p className="text-sm text-muted-foreground">
            Gérez votre image et vos relations médias
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className={cn("text-3xl font-bold", getScoreColor(overallScore))}>
              {Math.round(overallScore)}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              Score global {getTrendIcon()}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
          { id: 'media', label: 'Médias', icon: Newspaper },
          { id: 'crisis', label: 'Crises', icon: AlertTriangle },
          { id: 'pr', label: 'Équipe RP', icon: Users },
          { id: 'lobbying', label: 'Lobbying', icon: Building }
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
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Score par stakeholder */}
              <div className="glass-effect rounded-lg p-4">
                <button
                  onClick={() => toggleSection('stakeholders')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="font-semibold">Réputation par partie prenante</h3>
                  {expandedSections.stakeholders ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSections.stakeholders && (
                  <div className="space-y-3">
                    {(Object.entries(stakeholderConfig) as [StakeholderType, typeof stakeholderConfig[StakeholderType]][]).map(([key, config]) => {
                      const score = repState.score.byStakeholder[key];
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <config.icon className={cn("w-4 h-4", config.color)} />
                              <span className="text-sm">{config.name}</span>
                            </div>
                            <span className={cn("font-medium", getScoreColor(score))}>
                              {score}%
                            </span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Scandales actifs */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Crises en cours ({repState.scandals.filter(s => s.phase !== 'resolved').length})
                </h3>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {repState.scandals.filter(s => s.phase !== 'resolved').length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune crise active 🎉
                    </p>
                  ) : (
                    repState.scandals.filter(s => s.phase !== 'resolved').map(scandal => (
                      <div
                        key={scandal.id}
                        onClick={() => setSelectedScandal(scandal)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all hover:bg-white/5",
                          scandal.severity >= 8 ? "border-red-500/50 bg-red-500/10" :
                          scandal.severity >= 5 ? "border-orange-500/50 bg-orange-500/10" :
                          "border-yellow-500/50 bg-yellow-500/10"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{scandal.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                            {scandal.phase}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Sévérité: {scandal.severity}/10</span>
                          <span>Attention: {scandal.mediaAttention}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="glass-effect rounded-lg p-4 lg:col-span-2">
                <h3 className="font-semibold mb-3">Actions rapides</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={handlePublishPressRelease}
                    disabled={treasury < 5000}
                    className="p-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                  >
                    <Newspaper className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-sm font-medium">Communiqué</div>
                    <div className="text-xs text-muted-foreground">5 000€</div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('pr')}
                    className="p-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
                  >
                    <UserPlus className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-sm font-medium">Recruter RP</div>
                    <div className="text-xs text-muted-foreground">Équipe</div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('lobbying')}
                    className="p-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
                  >
                    <Building className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <div className="text-sm font-medium">Lobbying</div>
                    <div className="text-xs text-muted-foreground">Influence</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      const rumor = generateRandomRumor(day, overallScore);
                      setRepState(prev => ({ ...prev, activeRumors: [...prev.activeRumors, rumor] }));
                      toast.warning("Une rumeur circule...");
                    }}
                    className="p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-red-400 mx-auto mb-1" />
                    <div className="text-sm font-medium">Test Rumeur</div>
                    <div className="text-xs text-muted-foreground">Debug</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Médias */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Médias traditionnels</h3>
                <div className="space-y-2">
                  {repState.mediaOutlets.map(outlet => (
                    <div key={outlet.id} className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {outlet.type === 'newspaper' && <Newspaper className="w-5 h-5 text-blue-400" />}
                        {outlet.type === 'tv' && <Tv className="w-5 h-5 text-purple-400" />}
                        {outlet.type === 'radio' && <Radio className="w-5 h-5 text-green-400" />}
                        {outlet.type === 'blog' && <Globe className="w-5 h-5 text-cyan-400" />}
                        <div>
                          <div className="font-medium text-sm">{outlet.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {outlet.reach}k lecteurs • Influence: {outlet.influence}%
                          </div>
                        </div>
                      </div>
                      <div className={cn(
                        "text-sm font-medium",
                        outlet.stance > 20 ? "text-green-400" :
                        outlet.stance < -20 ? "text-red-400" :
                        "text-gray-400"
                      )}>
                        {outlet.stance > 0 ? '+' : ''}{outlet.stance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Réseaux sociaux</h3>
                <div className="space-y-3">
                  {repState.socialMedia.map(platform => (
                    <div key={platform.platform} className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{platform.platform}</span>
                        <span className="text-sm text-muted-foreground">
                          {platform.followers.toLocaleString()} abonnés
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <div className="text-muted-foreground">Engagement</div>
                          <div className="font-medium">{platform.engagement}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Sentiment</div>
                          <div className={cn(
                            "font-medium",
                            platform.sentiment > 0 ? "text-green-400" : platform.sentiment < 0 ? "text-red-400" : "text-gray-400"
                          )}>
                            {platform.sentiment > 0 ? '+' : ''}{platform.sentiment}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Viralité</div>
                          <div className="font-medium">{platform.viralPotential}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Influenceurs disponibles */}
              <div className="glass-effect rounded-lg p-4 lg:col-span-2">
                <h3 className="font-semibold mb-3">Influenceurs disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {INFLUENCER_TEMPLATES.map((inf, i) => {
                    const isHired = repState.influencers.some(i2 => i2.name === inf.name);
                    return (
                      <div key={i} className={cn(
                        "p-3 rounded-lg border transition-all",
                        isHired ? "border-green-500/50 bg-green-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{inf.name}</span>
                          <Star className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {inf.niche} • {(inf.followers / 1000).toFixed(0)}k abonnés
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-400">+{inf.reputationBoost}% rep</span>
                          {isHired ? (
                            <span className="text-xs text-green-400">Actif</span>
                          ) : (
                            <button
                              onClick={() => handleHireInfluencer(i)}
                              disabled={treasury < inf.cost * 3}
                              className="text-xs px-2 py-1 bg-primary rounded disabled:opacity-50"
                            >
                              {formatCurrency(inf.cost)}/mois
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crisis' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Liste des crises */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Crises actives</h3>
                <div className="space-y-2">
                  {repState.scandals.filter(s => s.phase !== 'resolved').map(scandal => (
                    <div
                      key={scandal.id}
                      onClick={() => setSelectedScandal(scandal)}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all",
                        selectedScandal?.id === scandal.id ? "ring-2 ring-primary" : "",
                        scandal.severity >= 8 ? "border-red-500/50 bg-red-500/10" :
                        scandal.severity >= 5 ? "border-orange-500/50 bg-orange-500/10" :
                        "border-yellow-500/50 bg-yellow-500/10"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{scandal.title}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded",
                          scandal.phase === 'trial' ? "bg-red-500" :
                          scandal.phase === 'viral' ? "bg-orange-500" :
                          "bg-yellow-500"
                        )}>
                          {scandal.phase}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{scandal.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>Résolution: {scandal.resolutionProgress}%</span>
                        <span>Attention média: {scandal.mediaAttention}%</span>
                      </div>
                      <Progress value={scandal.resolutionProgress} className="h-1 mt-2" />
                    </div>
                  ))}
                  
                  {repState.scandals.filter(s => s.phase !== 'resolved').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Aucune crise en cours</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Détails et réponses */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Réponse à la crise</h3>
                
                {selectedScandal ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-white/5">
                      <h4 className="font-medium">{selectedScandal.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{selectedScandal.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded bg-white/5">
                        <span className="text-muted-foreground">Sévérité:</span>
                        <span className="ml-2 font-medium">{selectedScandal.severity}/10</span>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <span className="text-muted-foreground">Phase:</span>
                        <span className="ml-2 font-medium capitalize">{selectedScandal.phase}</span>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <span className="text-muted-foreground">Dommage rep:</span>
                        <span className="ml-2 font-medium text-red-400">-{selectedScandal.reputationDamage}%</span>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <span className="text-muted-foreground">Risque légal:</span>
                        <span className="ml-2 font-medium">{selectedScandal.legalRisk}%</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Options de réponse:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(crisisResponseConfig) as [CrisisResponse, typeof crisisResponseConfig[CrisisResponse]][]).map(([response, config]) => (
                          <button
                            key={response}
                            onClick={() => handleCrisisResponse(selectedScandal.id, response)}
                            disabled={treasury < config.cost}
                            className={cn(
                              "p-2 rounded-lg border transition-all flex items-center gap-2 disabled:opacity-50",
                              "hover:bg-white/10 border-white/10"
                            )}
                          >
                            <config.icon className={cn("w-4 h-4", config.color)} />
                            <div className="text-left flex-1">
                              <div className="text-sm font-medium">{config.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {config.cost > 0 ? formatCurrency(config.cost) : 'Gratuit'}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedScandal.responses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Réponses précédentes:</h4>
                        <div className="space-y-1">
                          {selectedScandal.responses.map((resp, i) => (
                            <div key={i} className="text-xs flex items-center justify-between p-2 bg-white/5 rounded">
                              <span className="capitalize">{resp.type}</span>
                              <span>Efficacité: {resp.effectiveness}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Sélectionnez une crise pour répondre</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pr' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Équipe actuelle */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Équipe RP ({repState.prAgents.length})</h3>
                <div className="space-y-2">
                  {repState.prAgents.map(agent => (
                    <div key={agent.id} className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{agent.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {agent.type.replace('_', ' ')} • Niveau {agent.level}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-400">+{agent.effectiveness}%</div>
                        <div className="text-xs text-muted-foreground">{formatCurrency(agent.salary)}/mois</div>
                      </div>
                    </div>
                  ))}
                  
                  {repState.prAgents.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucun agent RP</p>
                  )}
                </div>
              </div>

              {/* Recrutement */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Recruter</h3>
                <div className="space-y-2">
                  {[
                    { type: 'press_officer' as const, name: 'Attaché de presse' },
                    { type: 'community_manager' as const, name: 'Community Manager' },
                    { type: 'crisis_manager' as const, name: 'Gestionnaire de crise' },
                    { type: 'lobbyist' as const, name: 'Lobbyiste' },
                    { type: 'influencer_manager' as const, name: 'Manager influenceurs' }
                  ].map(role => (
                    <div key={role.type} className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{role.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(level => (
                          <button
                            key={level}
                            onClick={() => handleHirePRAgent(role.type, level)}
                            className="flex-1 py-1 text-xs bg-primary/20 hover:bg-primary/40 rounded transition-colors"
                          >
                            Niv.{level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agences */}
              <div className="glass-effect rounded-lg p-4 lg:col-span-2">
                <h3 className="font-semibold mb-3">Agences RP</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {PR_AGENCY_TEMPLATES.map((agency, i) => {
                    const isContracted = repState.contractedAgencies.some(a => a.name === agency.name);
                    return (
                      <div key={i} className={cn(
                        "p-4 rounded-lg border transition-all",
                        isContracted ? "border-green-500/50 bg-green-500/10" : "border-white/10 bg-white/5"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{agency.name}</span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded",
                            agency.tier === 'elite' ? "bg-amber-500" :
                            agency.tier === 'premium' ? "bg-purple-500" :
                            agency.tier === 'standard' ? "bg-blue-500" :
                            "bg-gray-500"
                          )}>
                            {agency.tier}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{agency.specialty}</p>
                        <div className="grid grid-cols-2 gap-1 text-xs mb-3">
                          <div>Efficacité: {agency.effectiveness}%</div>
                          <div>Crise: +{agency.crisisBonus}%</div>
                        </div>
                        {isContracted ? (
                          <span className="text-xs text-green-400">Sous contrat</span>
                        ) : (
                          <button
                            onClick={() => handleContractAgency(i)}
                            disabled={treasury < agency.monthlyFee * 3}
                            className="w-full py-2 bg-primary hover:bg-primary/90 rounded text-sm disabled:opacity-50"
                          >
                            {formatCurrency(agency.monthlyFee)}/mois
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lobbying' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Campagnes actives */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Campagnes en cours</h3>
                <div className="space-y-2">
                  {repState.lobbyingCampaigns.map(campaign => (
                    <div key={campaign.id} className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm capitalize">{campaign.target}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(campaign.progress)}%
                        </span>
                      </div>
                      <Progress value={campaign.progress} className="h-2 mb-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Budget: {formatCurrency(campaign.budget)}</span>
                        <span>Succès: {campaign.successProbability}%</span>
                      </div>
                    </div>
                  ))}
                  
                  {repState.lobbyingCampaigns.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune campagne active
                    </p>
                  )}
                </div>
              </div>

              {/* Nouvelles campagnes */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold mb-3">Lancer une campagne</h3>
                <div className="space-y-2">
                  {[
                    { target: 'government' as const, name: 'Gouvernement', desc: 'Influencer les politiques', cost: 50000 },
                    { target: 'regulator' as const, name: 'Régulateur', desc: 'Assouplir les règles', cost: 40000 },
                    { target: 'association' as const, name: 'Association', desc: 'Obtenir un label', cost: 20000 },
                    { target: 'ngo' as const, name: 'ONG', desc: 'Partenariat social', cost: 15000 }
                  ].map(option => (
                    <button
                      key={option.target}
                      onClick={() => handleStartLobbying(option.target)}
                      disabled={treasury < option.cost}
                      className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{option.name}</div>
                          <div className="text-xs text-muted-foreground">{option.desc}</div>
                        </div>
                        <span className="text-sm text-amber-400">{formatCurrency(option.cost)}</span>
                      </div>
                    </button>
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
