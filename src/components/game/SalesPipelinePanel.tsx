import { useState, useCallback } from "react";
import { 
  Lead, 
  Deal, 
  LeadSource, 
  DealStage, 
  SalesPipeline,
  CustomerFeedback 
} from "@/types/advancedSystems";
import { 
  generateLead, 
  generateLeadBatch, 
  qualifyLead, 
  createDealFromLead, 
  advanceDealStage, 
  addDealActivity,
  calculatePipelineMetrics,
  calculateNPS,
  calculateCSAT,
  LEAD_SOURCES,
  STAGE_PROBABILITIES 
} from "@/utils/salesEngine";
import { formatCurrency } from "@/utils/gameEngine";
import { GaugeBar } from "./GaugeBar";
import { 
  Users,
  TrendingUp,
  Target,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  Briefcase,
  Search,
  Filter,
  Plus,
  UserPlus,
  Megaphone,
  Zap,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ArrowUpRight,
  Globe,
  Share2,
  Handshake,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SalesPipelinePanelProps {
  pipeline: SalesPipeline;
  customerFeedback: CustomerFeedback[];
  treasury: number;
  currentDay: number;
  onGenerateLead: (lead: Lead) => void;
  onGenerateLeadBatch: (leads: Lead[], cost: number) => void;
  onQualifyLead: (leadId: string, qualified: boolean, newScore: number) => void;
  onConvertToDeaL: (leadId: string, deal: Deal) => void;
  onAdvanceDeal: (dealId: string, success: boolean) => void;
  onAddActivity: (dealId: string, activityType: string, description: string) => void;
  onRecordFeedback: (feedback: CustomerFeedback) => void;
}

const STAGE_CONFIG: Record<DealStage, { label: string; color: string; icon: typeof Target }> = {
  prospecting: { label: 'Prospection', color: 'bg-blue-500', icon: Search },
  qualification: { label: 'Qualification', color: 'bg-purple-500', icon: Filter },
  needs_analysis: { label: 'Analyse', color: 'bg-cyan-500', icon: Target },
  proposal: { label: 'Proposition', color: 'bg-amber-500', icon: FileText },
  negotiation: { label: 'Négociation', color: 'bg-orange-500', icon: Handshake },
  closing: { label: 'Closing', color: 'bg-emerald-500', icon: CheckCircle },
  won: { label: 'Gagné', color: 'bg-success', icon: Star },
  lost: { label: 'Perdu', color: 'bg-destructive', icon: ThumbsDown },
};

const SOURCE_CONFIG: Record<LeadSource, { label: string; icon: typeof Globe }> = {
  website: { label: 'Site web', icon: Globe },
  referral: { label: 'Recommandation', icon: Share2 },
  cold_call: { label: 'Démarchage', icon: Phone },
  trade_show: { label: 'Salon pro', icon: Users },
  social_media: { label: 'Réseaux sociaux', icon: MessageSquare },
  advertising: { label: 'Publicité', icon: Megaphone },
  partnership: { label: 'Partenariat', icon: Handshake },
};

export function SalesPipelinePanel({
  pipeline,
  customerFeedback,
  treasury,
  currentDay,
  onGenerateLead,
  onGenerateLeadBatch,
  onQualifyLead,
  onConvertToDeaL,
  onAdvanceDeal,
  onAddActivity,
  onRecordFeedback,
}: SalesPipelinePanelProps) {
  const [activeTab, setActiveTab] = useState<'leads' | 'deals' | 'sources' | 'metrics'>('leads');
  const [selectedSource, setSelectedSource] = useState<LeadSource | null>(null);
  const [selectedStage, setSelectedStage] = useState<DealStage | null>(null);
  const [leadBudget, setLeadBudget] = useState(1000);

  // Calculate metrics
  const metrics = calculatePipelineMetrics(pipeline);
  const nps = calculateNPS(customerFeedback);
  const csat = calculateCSAT(customerFeedback);

  // Filter leads by status
  const newLeads = pipeline.leads.filter(l => l.status === 'new');
  const contactedLeads = pipeline.leads.filter(l => l.status === 'contacted');
  const qualifiedLeads = pipeline.leads.filter(l => l.status === 'qualified');

  // Filter deals by stage
  const activeDeals = pipeline.deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
  const wonDeals = pipeline.deals.filter(d => d.stage === 'won');
  const lostDeals = pipeline.deals.filter(d => d.stage === 'lost');

  const handleGenerateSingleLead = useCallback((source: LeadSource) => {
    const cost = LEAD_SOURCES[source].cost;
    if (treasury < cost) {
      toast.error("Budget insuffisant");
      return;
    }
    const lead = generateLead(source, currentDay);
    onGenerateLead(lead);
    toast.success(`Nouveau lead: ${lead.companyName}`);
  }, [treasury, currentDay, onGenerateLead]);

  const handleGenerateBatch = useCallback((source: LeadSource) => {
    const { leads, cost } = generateLeadBatch(source, leadBudget, currentDay);
    if (treasury < cost) {
      toast.error("Budget insuffisant");
      return;
    }
    onGenerateLeadBatch(leads, cost);
    toast.success(`${leads.length} leads générés pour ${formatCurrency(cost)}`);
  }, [treasury, leadBudget, currentDay, onGenerateLeadBatch]);

  const handleQualifyLead = useCallback((lead: Lead) => {
    const { qualified, score } = qualifyLead(lead, 70); // 70 = average skill level
    onQualifyLead(lead.id, qualified, score);
    if (qualified) {
      toast.success(`${lead.companyName} qualifié avec un score de ${score}!`);
    } else {
      toast.info(`${lead.companyName} non qualifié`);
    }
  }, [onQualifyLead]);

  const handleConvertToDeal = useCallback((lead: Lead) => {
    const deal = createDealFromLead(lead, currentDay);
    onConvertToDeaL(lead.id, deal);
    toast.success(`Opportunité créée: ${deal.name}`);
  }, [currentDay, onConvertToDeaL]);

  const handleAdvanceDeal = useCallback((deal: Deal, success: boolean) => {
    onAdvanceDeal(deal.id, success);
    if (success) {
      if (deal.stage === 'closing') {
        toast.success(`Affaire gagnée! +${formatCurrency(deal.value)}`);
      } else {
        toast.success(`Opportunité avancée!`);
      }
    } else {
      toast.error(`Opportunité perdue`);
    }
  }, [onAdvanceDeal]);

  const tabs = [
    { id: 'leads', label: 'Leads', icon: UserPlus, count: pipeline.leads.length },
    { id: 'deals', label: 'Pipeline', icon: TrendingUp, count: activeDeals.length },
    { id: 'sources', label: 'Sources', icon: Megaphone },
    { id: 'metrics', label: 'Métriques', icon: BarChart3 },
  ];

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="game-panel text-center">
          <UserPlus className="w-5 h-5 text-info mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Leads</p>
          <p className="text-sm font-bold">{pipeline.leads.length}</p>
        </div>
        <div className="game-panel text-center">
          <Briefcase className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Opportunités</p>
          <p className="text-sm font-bold">{activeDeals.length}</p>
        </div>
        <div className="game-panel text-center">
          <DollarSign className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Pipeline Total</p>
          <p className="text-sm font-bold">{formatCurrency(metrics.totalValue)}</p>
        </div>
        <div className="game-panel text-center">
          <Target className="w-5 h-5 text-warning mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Pondéré</p>
          <p className="text-sm font-bold">{formatCurrency(metrics.weightedValue)}</p>
        </div>
        <div className="game-panel text-center">
          <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Gagnés</p>
          <p className="text-sm font-bold">{wonDeals.length}</p>
        </div>
        <div className="game-panel text-center">
          <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">NPS</p>
          <p className={cn("text-sm font-bold", nps >= 50 ? "text-success" : nps >= 0 ? "text-warning" : "text-destructive")}>
            {nps}
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
            {tab.count !== undefined && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-background/20 text-[10px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-3">Génération de Leads</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.keys(LEAD_SOURCES) as LeadSource[]).slice(0, 4).map(source => {
                const config = LEAD_SOURCES[source];
                const sourceInfo = SOURCE_CONFIG[source];
                const SourceIcon = sourceInfo.icon;
                return (
                  <button
                    key={source}
                    onClick={() => handleGenerateSingleLead(source)}
                    disabled={treasury < config.cost}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    <SourceIcon className="w-5 h-5 text-primary" />
                    <span className="text-xs font-medium">{sourceInfo.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {config.cost === 0 ? 'Gratuit' : formatCurrency(config.cost)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Leads by Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* New Leads */}
            <div className="game-panel">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-semibold text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Nouveaux ({newLeads.length})
                </h4>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {newLeads.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Aucun nouveau lead</p>
                ) : (
                  newLeads.map(lead => (
                    <div key={lead.id} className="bg-secondary/30 rounded-lg p-2">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-xs font-medium">{lead.companyName}</p>
                          <p className="text-[10px] text-muted-foreground">{lead.contactName}</p>
                        </div>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium",
                          lead.score >= 70 ? "bg-success/20 text-success" :
                          lead.score >= 40 ? "bg-warning/20 text-warning" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {lead.score}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-primary">{formatCurrency(lead.estimatedValue)}</span>
                        <button
                          onClick={() => handleQualifyLead(lead)}
                          className="px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[10px]"
                        >
                          Qualifier
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Contacted Leads */}
            <div className="game-panel">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-semibold text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-info" />
                  Contactés ({contactedLeads.length})
                </h4>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {contactedLeads.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Aucun lead contacté</p>
                ) : (
                  contactedLeads.map(lead => (
                    <div key={lead.id} className="bg-secondary/30 rounded-lg p-2">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-xs font-medium">{lead.companyName}</p>
                          <p className="text-[10px] text-muted-foreground">{lead.contactName}</p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-info/20 text-info">
                          {lead.score}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-primary">{formatCurrency(lead.estimatedValue)}</span>
                        <button
                          onClick={() => handleQualifyLead(lead)}
                          className="px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[10px]"
                        >
                          Qualifier
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Qualified Leads */}
            <div className="game-panel">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-semibold text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Qualifiés ({qualifiedLeads.length})
                </h4>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {qualifiedLeads.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Aucun lead qualifié</p>
                ) : (
                  qualifiedLeads.map(lead => (
                    <div key={lead.id} className="bg-secondary/30 rounded-lg p-2">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-xs font-medium">{lead.companyName}</p>
                          <p className="text-[10px] text-muted-foreground">{lead.contactName}</p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-success/20 text-success">
                          {lead.score}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-primary">{formatCurrency(lead.estimatedValue)}</span>
                        <button
                          onClick={() => handleConvertToDeal(lead)}
                          className="px-2 py-1 rounded bg-success/10 hover:bg-success/20 text-success text-[10px] flex items-center gap-1"
                        >
                          <ArrowRight className="w-3 h-3" />
                          Convertir
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deals Tab - Pipeline View */}
      {activeTab === 'deals' && (
        <div className="space-y-4">
          {/* Pipeline Stages */}
          <div className="game-panel overflow-x-auto">
            <h4 className="font-display font-semibold mb-4">Pipeline Commercial</h4>
            <div className="flex gap-2 min-w-max">
              {(['prospecting', 'qualification', 'needs_analysis', 'proposal', 'negotiation', 'closing'] as DealStage[]).map(stage => {
                const config = STAGE_CONFIG[stage];
                const stageDeals = pipeline.deals.filter(d => d.stage === stage);
                const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
                return (
                  <button
                    key={stage}
                    onClick={() => setSelectedStage(selectedStage === stage ? null : stage)}
                    className={cn(
                      "flex-1 min-w-[120px] rounded-lg p-3 transition-all border-2",
                      selectedStage === stage ? "border-primary" : "border-transparent",
                      "bg-secondary/50 hover:bg-secondary"
                    )}
                  >
                    <div className={cn("w-full h-1 rounded-full mb-2", config.color)} />
                    <p className="text-xs font-medium">{config.label}</p>
                    <p className="text-lg font-bold">{stageDeals.length}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(stageValue)}</p>
                    <p className="text-[10px] text-muted-foreground">{STAGE_PROBABILITIES[stage]}% prob.</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deals List */}
          <div className="game-panel">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-semibold text-sm">
                {selectedStage ? STAGE_CONFIG[selectedStage].label : 'Toutes les opportunités'}
              </h4>
              {selectedStage && (
                <button
                  onClick={() => setSelectedStage(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Voir tout
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {activeDeals
                .filter(d => !selectedStage || d.stage === selectedStage)
                .map(deal => {
                  const config = STAGE_CONFIG[deal.stage];
                  const daysOpen = currentDay - deal.createdAt;
                  const daysToClose = deal.expectedCloseDate - currentDay;
                  return (
                    <div key={deal.id} className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{deal.name}</p>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] text-white",
                            config.color
                          )}>
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span>{daysOpen} jours</span>
                          <span className={daysToClose < 0 ? "text-destructive" : ""}>
                            {daysToClose > 0 ? `${daysToClose}j restants` : 'En retard'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold text-success">{formatCurrency(deal.value)}</p>
                        <p className="text-xs text-muted-foreground">{deal.probability}%</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleAdvanceDeal(deal, true)}
                          className="p-2 rounded-lg bg-success/10 hover:bg-success/20 text-success"
                          title="Avancer"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAdvanceDeal(deal, false)}
                          className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive"
                          title="Perdu"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              {activeDeals.filter(d => !selectedStage || d.stage === selectedStage).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Aucune opportunité{selectedStage ? ` en ${STAGE_CONFIG[selectedStage].label.toLowerCase()}` : ''}
                </p>
              )}
            </div>
          </div>

          {/* Won/Lost Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="game-panel">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <h4 className="font-display font-semibold text-sm">Gagnés</h4>
              </div>
              <p className="text-2xl font-bold text-success">{formatCurrency(wonDeals.reduce((s, d) => s + d.value, 0))}</p>
              <p className="text-xs text-muted-foreground">{wonDeals.length} affaires</p>
            </div>
            <div className="game-panel">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsDown className="w-5 h-5 text-destructive" />
                <h4 className="font-display font-semibold text-sm">Perdus</h4>
              </div>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(lostDeals.reduce((s, d) => s + d.value, 0))}</p>
              <p className="text-xs text-muted-foreground">{lostDeals.length} affaires</p>
            </div>
          </div>
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Sources de Leads</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(LEAD_SOURCES) as LeadSource[]).map(source => {
                const config = LEAD_SOURCES[source];
                const sourceInfo = SOURCE_CONFIG[source];
                const SourceIcon = sourceInfo.icon;
                const leadsFromSource = pipeline.leads.filter(l => l.source === source);
                return (
                  <div key={source} className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <SourceIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{sourceInfo.label}</p>
                        <p className="text-xs text-muted-foreground">{leadsFromSource.length} leads</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coût/lead</span>
                        <span className="font-medium">{config.cost === 0 ? 'Gratuit' : formatCurrency(config.cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Qualité</span>
                        <span className={cn(
                          "font-medium",
                          config.quality >= 70 ? "text-success" :
                          config.quality >= 50 ? "text-warning" :
                          "text-muted-foreground"
                        )}>{config.quality}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volume max</span>
                        <span className="font-medium">{config.volume}/campagne</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleGenerateSingleLead(source)}
                      disabled={treasury < config.cost}
                      className="w-full btn-game-primary text-xs py-2 disabled:opacity-50"
                    >
                      Générer un lead
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Batch Generation */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-3">Campagne de Génération</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Budget</label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={leadBudget}
                  onChange={(e) => setLeadBudget(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(leadBudget)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['website', 'advertising', 'trade_show', 'social_media'] as LeadSource[]).map(source => {
                const config = LEAD_SOURCES[source];
                const sourceInfo = SOURCE_CONFIG[source];
                const expectedLeads = config.cost > 0 ? Math.floor(leadBudget / config.cost) : config.volume;
                return (
                  <button
                    key={source}
                    onClick={() => handleGenerateBatch(source)}
                    disabled={treasury < config.cost}
                    className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary text-left disabled:opacity-50"
                  >
                    <p className="text-xs font-medium">{sourceInfo.label}</p>
                    <p className="text-lg font-bold text-primary">~{Math.min(expectedLeads, config.volume)}</p>
                    <p className="text-[10px] text-muted-foreground">leads estimés</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="game-panel text-center">
              <p className="text-xs text-muted-foreground mb-1">Valeur Moyenne</p>
              <p className="text-xl font-bold">{formatCurrency(metrics.avgDealSize)}</p>
            </div>
            <div className="game-panel text-center">
              <p className="text-xs text-muted-foreground mb-1">Cycle de Vente</p>
              <p className="text-xl font-bold">{pipeline.averageSalesCycle} jours</p>
            </div>
            <div className="game-panel text-center">
              <p className="text-xs text-muted-foreground mb-1">Taux de Conversion</p>
              <p className="text-xl font-bold">{Math.round(pipeline.winRate)}%</p>
            </div>
            <div className="game-panel text-center">
              <p className="text-xs text-muted-foreground mb-1">CSAT</p>
              <p className={cn(
                "text-xl font-bold",
                csat >= 80 ? "text-success" : csat >= 60 ? "text-warning" : "text-destructive"
              )}>{csat}%</p>
            </div>
          </div>

          {/* Stage Breakdown */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Répartition par Étape</h4>
            <div className="space-y-3">
              {(['prospecting', 'qualification', 'needs_analysis', 'proposal', 'negotiation', 'closing'] as DealStage[]).map(stage => {
                const config = STAGE_CONFIG[stage];
                const value = metrics.stageBreakdown[stage];
                const percentage = metrics.totalValue > 0 ? (value / metrics.totalValue) * 100 : 0;
                return (
                  <div key={stage} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{config.label}</span>
                      <span className="text-muted-foreground">{formatCurrency(value)}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all", config.color)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NPS Details */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-3">Net Promoter Score</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <GaugeBar 
                  value={Math.max(0, nps + 100)} 
                  max={200} 
                  colorClass={nps >= 50 ? "bg-success" : nps >= 0 ? "bg-warning" : "bg-destructive"}
                  label={nps >= 50 ? "Excellent" : nps >= 0 ? "Correct" : "À améliorer"}
                />
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-3xl font-bold",
                  nps >= 50 ? "text-success" : nps >= 0 ? "text-warning" : "text-destructive"
                )}>{nps}</p>
                <p className="text-xs text-muted-foreground">NPS</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
