import { useState } from "react";
import { Company, Client, ClientContract, Competitor } from "@/types/game";
import { Salesperson, SALESPERSON_CATALOG, SalesTeam, CRMClient, Opportunity } from "@/types/commercial";
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
  PieChart,
  BarChart3,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  Handshake,
  Briefcase,
  Search,
  Filter,
  Eye,
  MessageSquare,
  FileText,
  Plus,
  UserPlus,
  Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedCommercialPanelProps {
  company: Company;
  salesTeam?: SalesTeam[];
  opportunities?: Opportunity[];
  onHireSalesperson?: (salesperson: Salesperson) => void;
  onLaunchCampaign?: (type: string, budget: number) => void;
  onContactClient?: (clientId: string) => void;
  onCreateOpportunity?: (clientId: string) => void;
  onAdvanceOpportunity?: (oppId: string, stage: string) => void;
  onAddProspect?: (prospect: CRMClient) => void;
}

// Pipeline stages
const pipelineStages = [
  { id: 'qualification', name: 'Qualification', color: 'bg-blue-500' },
  { id: 'demo', name: 'Démonstration', color: 'bg-purple-500' },
  { id: 'proposal', name: 'Proposition', color: 'bg-amber-500' },
  { id: 'negotiation', name: 'Négociation', color: 'bg-orange-500' },
  { id: 'closing', name: 'Closing', color: 'bg-green-500' },
];

// Campaign types with costs
const campaignTypes = [
  { id: 'email', name: 'Email Marketing', baseCost: 500, expectedROI: 3.5, duration: 7 },
  { id: 'social', name: 'Réseaux Sociaux', baseCost: 1000, expectedROI: 2.8, duration: 14 },
  { id: 'ads', name: 'Publicité Digitale', baseCost: 2000, expectedROI: 4.2, duration: 30 },
  { id: 'event', name: 'Événement', baseCost: 5000, expectedROI: 5.0, duration: 1 },
  { id: 'pr', name: 'Relations Presse', baseCost: 3000, expectedROI: 2.5, duration: 60 },
  { id: 'referral', name: 'Programme Parrainage', baseCost: 1500, expectedROI: 6.0, duration: 90 },
];

export function AdvancedCommercialPanel({ 
  company, 
  salesTeam = [],
  opportunities = [],
  onHireSalesperson,
  onLaunchCampaign,
  onContactClient,
  onCreateOpportunity,
  onAddProspect
}: AdvancedCommercialPanelProps) {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'team' | 'clients' | 'campaigns' | 'competition' | 'kpi'>('pipeline');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock opportunities if none provided
  const mockOpportunities = opportunities.length > 0 ? opportunities : [
    { id: 'opp1', name: 'Contrat Enterprise ABC', clientId: 'c1', value: 150000, stage: 'negotiation' as const, probability: 75, createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, expectedCloseDate: Date.now() + 30 * 24 * 60 * 60 * 1000, assignedTo: 'sales1', notes: [], activities: [] },
    { id: 'opp2', name: 'Renouvellement Premium', clientId: 'c2', value: 85000, stage: 'proposal' as const, probability: 60, createdAt: Date.now() - 28 * 24 * 60 * 60 * 1000, expectedCloseDate: Date.now() + 45 * 24 * 60 * 60 * 1000, assignedTo: 'sales2', notes: [], activities: [] },
    { id: 'opp3', name: 'Extension Services', clientId: 'c3', value: 220000, stage: 'qualification' as const, probability: 40, createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000, expectedCloseDate: Date.now() + 60 * 24 * 60 * 60 * 1000, assignedTo: 'sales1', notes: [], activities: [] },
    { id: 'opp4', name: 'POC Innovation', clientId: 'c4', value: 35000, stage: 'demo' as const, probability: 55, createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, expectedCloseDate: Date.now() + 20 * 24 * 60 * 60 * 1000, assignedTo: 'sales3', notes: [], activities: [] },
  ];

  // Calculate metrics
  const totalPipelineValue = mockOpportunities.reduce((sum, o) => sum + o.value, 0);
  const weightedPipeline = mockOpportunities.reduce((sum, o) => sum + o.value * (o.probability / 100), 0);
  const avgDealSize = totalPipelineValue / Math.max(mockOpportunities.length, 1);
  const conversionRate = 32;
  const avgSalesCycle = 45;

  // Client metrics
  const totalClients = company.clients.length;
  const activeContracts = company.clients.flatMap(c => c.contracts).filter(c => c.status === 'active').length;
  const totalClientRevenue = company.clients.reduce((sum, c) => sum + c.totalRevenue, 0);
  const avgClientScore = company.clients.length > 0 
    ? company.clients.reduce((sum, c) => sum + c.relationshipScore, 0) / company.clients.length 
    : 0;

  // Salesperson categories (use role instead of specialty)
  const salespersonCategories = [...new Set(SALESPERSON_CATALOG.map(s => s.role))];

  const tabs = [
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'team', label: 'Équipe', icon: Users },
    { id: 'clients', label: 'Clients', icon: Briefcase },
    { id: 'campaigns', label: 'Campagnes', icon: Megaphone },
    { id: 'competition', label: 'Concurrence', icon: Eye },
    { id: 'kpi', label: 'KPIs', icon: BarChart3 },
  ];

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3">
        <div className="game-panel text-center">
          <DollarSign className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Pipeline Total</p>
          <p className="text-sm font-bold">{formatCurrency(totalPipelineValue)}</p>
        </div>
        <div className="game-panel text-center">
          <Target className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Pondéré</p>
          <p className="text-sm font-bold">{formatCurrency(weightedPipeline)}</p>
        </div>
        <div className="game-panel text-center">
          <Briefcase className="w-5 h-5 text-info mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Opportunités</p>
          <p className="text-sm font-bold">{mockOpportunities.length}</p>
        </div>
        <div className="game-panel text-center">
          <TrendingUp className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Taux Conv.</p>
          <p className="text-sm font-bold">{conversionRate}%</p>
        </div>
        <div className="game-panel text-center">
          <Users className="w-5 h-5 text-warning mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Clients</p>
          <p className="text-sm font-bold">{totalClients}</p>
        </div>
        <div className="game-panel text-center">
          <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Cycle Vente</p>
          <p className="text-sm font-bold">{avgSalesCycle}j</p>
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

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Pipeline Commercial</h4>
            <div className="flex gap-2 mb-4">
              {pipelineStages.map(stage => {
                const stageOpps = mockOpportunities.filter(o => o.stage === stage.id);
                const stageValue = stageOpps.reduce((sum, o) => sum + o.value, 0);
                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                    className={cn(
                      "flex-1 rounded-lg p-3 transition-all border-2",
                      selectedStage === stage.id ? "border-primary" : "border-transparent",
                      "bg-secondary/50 hover:bg-secondary"
                    )}
                  >
                    <div className={cn("w-full h-1 rounded-full mb-2", stage.color)} />
                    <p className="text-xs font-medium">{stage.name}</p>
                    <p className="text-lg font-bold">{stageOpps.length}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(stageValue)}</p>
                  </button>
                );
              })}
            </div>

            {/* Opportunities List */}
            <div className="space-y-2">
              {mockOpportunities
                .filter(o => !selectedStage || o.stage === selectedStage)
                .map(opp => {
                  const createdTime = 'createdAt' in opp ? (opp as any).createdAt : Date.now();
                  const daysOpen = Math.floor((Date.now() - createdTime) / (24 * 60 * 60 * 1000));
                  const stage = pipelineStages.find(s => s.id === opp.stage);
                  const oppName = 'name' in opp ? (opp as any).name : `Opportunité ${opp.id}`;
                  return (
                    <div key={opp.id} className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{oppName}</p>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs",
                            stage?.color.replace('bg-', 'bg-') + '/20'
                          )}>
                            {stage?.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{daysOpen} jours</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold text-success">{formatCurrency(opp.value)}</p>
                        <p className="text-xs text-muted-foreground">{opp.probability}% probabilité</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <button 
            onClick={() => {
              const newProspect: CRMClient = {
                id: `prospect_${Date.now()}`,
                name: `Prospect ${Date.now()}`,
                type: 'prospect',
                sector: 'services',
                size: 'pme',
                status: 'pending',
                contactInfo: {
                  email: 'contact@example.com',
                  phone: '+33 1 00 00 00 00',
                  address: 'Paris, France'
                },
                assignedTo: '',
                revenue: 0,
                potential: 50000,
                lastContact: Date.now(),
                nextAction: 'Premier contact',
                nextActionDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
                notes: [],
                opportunities: [],
                orders: [],
                satisfaction: 0,
                loyaltyScore: 0
              };
              onAddProspect?.(newProspect);
            }}
            className="w-full btn-game-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Ajouter un prospect
          </button>
        </div>
      )}

      {/* Sales Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs transition-colors",
                selectedCategory === 'all' ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
              )}
            >
              Tous
            </button>
            {salespersonCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs transition-colors capitalize",
                  selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SALESPERSON_CATALOG
              .filter(sp => selectedCategory === 'all' || sp.role === selectedCategory)
              .map(salesperson => {
                const hiringCost = salesperson.baseSalary * 2; // 2 months salary as hiring cost
                const hasNegotiation = salesperson.skills.includes('negotiation');
                const hasClosing = salesperson.skills.includes('closing');
                return (
                  <div key={salesperson.id} className="game-panel">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-display font-semibold">{salesperson.title}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{salesperson.role.replace('_', ' ')}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        salesperson.experience >= 6 ? "bg-purple-500/20 text-purple-400" :
                        salesperson.experience >= 3 ? "bg-info/20 text-info" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {salesperson.experience >= 6 ? 'Senior' : salesperson.experience >= 3 ? 'Confirmé' : 'Junior'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expérience</span>
                        <span className="font-medium">{salesperson.experience} ans</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Commission</span>
                        <span className="font-medium text-success">{Math.round(salesperson.commission * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Compétences</span>
                        <span className="font-medium text-primary">{salesperson.skills.length}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">{formatCurrency(salesperson.baseSalary)}/an</span>
                      <button
                        onClick={() => {
                          const fullSalesperson: Salesperson = {
                            id: `sp_${Date.now()}`,
                            name: salesperson.title,
                            role: salesperson.role,
                            salary: salesperson.baseSalary,
                            commission: salesperson.commission,
                            experience: salesperson.experience,
                            skills: salesperson.skills,
                            performance: 70,
                            satisfaction: 80,
                            clients: [],
                            hireDate: Date.now()
                          };
                          onHireSalesperson?.(fullSalesperson);
                        }}
                        disabled={company.treasury < hiringCost}
                        className="btn-game-primary text-xs py-1.5 px-4 disabled:opacity-50"
                      >
                        <UserPlus className="w-3 h-3 mr-1 inline" /> Recruter ({formatCurrency(hiringCost)})
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="pl-9 pr-4 py-2 bg-secondary rounded-lg text-sm w-64"
                />
              </div>
              <button className="btn-game-secondary flex items-center gap-2 text-sm">
                <Filter className="w-4 h-4" /> Filtrer
              </button>
            </div>
            <button className="btn-game-primary text-sm">+ Nouveau client</button>
          </div>

          <div className="game-panel">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Client</th>
                  <th className="text-center py-2">Type</th>
                  <th className="text-right py-2">CA Total</th>
                  <th className="text-center py-2">Contrats</th>
                  <th className="text-center py-2">Relation</th>
                  <th className="text-center py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {company.clients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      Aucun client enregistré
                    </td>
                  </tr>
                ) : (
                  company.clients.map(client => (
                    <tr key={client.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-xs text-muted-foreground">{client.sector}</p>
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs",
                          client.type === 'grand_compte' ? "bg-primary/20 text-primary" :
                          client.type === 'pme' ? "bg-info/20 text-info" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {client.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="text-right py-3 font-medium">{formatCurrency(client.totalRevenue)}</td>
                      <td className="text-center py-3">{client.contracts.length}</td>
                      <td className="text-center py-3">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-16">
                            <GaugeBar value={client.relationshipScore} label="" colorClass={client.relationshipScore >= 70 ? "bg-success" : "bg-warning"} />
                          </div>
                          <span className="text-xs">{client.relationshipScore}%</span>
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <div className="flex justify-center gap-1">
                          <button 
                            onClick={() => onContactClient?.(client.id)}
                            className="p-1.5 rounded bg-secondary hover:bg-secondary/80"
                          >
                            <Phone className="w-3 h-3" />
                          </button>
                          <button className="p-1.5 rounded bg-secondary hover:bg-secondary/80"><Mail className="w-3 h-3" /></button>
                          <button className="p-1.5 rounded bg-secondary hover:bg-secondary/80"><FileText className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" /> Lancer une campagne
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {campaignTypes.map(campaign => (
                <div key={campaign.id} className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">Durée: {campaign.duration} jours</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coût minimum</span>
                      <span className="font-medium">{formatCurrency(campaign.baseCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROI attendu</span>
                      <span className="font-medium text-success">x{campaign.expectedROI}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onLaunchCampaign?.(campaign.id, campaign.baseCost)}
                    disabled={company.treasury < campaign.baseCost}
                    className="w-full btn-game-primary text-xs py-1.5 disabled:opacity-50"
                  >
                    Lancer ({formatCurrency(campaign.baseCost)})
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Campagnes actives</h4>
            {company.marketingCampaigns.filter(c => c.active).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucune campagne active</p>
            ) : (
              <div className="space-y-3">
                {company.marketingCampaigns.filter(c => c.active).map(campaign => (
                  <div key={campaign.id} className="bg-secondary/30 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Budget: {formatCurrency(campaign.budget)} | Reach: {campaign.reach.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">ROI: {(campaign.roi * 100).toFixed(0)}%</p>
                      <p className="text-xs text-muted-foreground">{campaign.conversions} conversions</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Competition Tab */}
      {activeTab === 'competition' && (
        <div className="space-y-4">
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-warning" /> Analyse Concurrentielle
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {company.competitors.slice(0, 4).map(competitor => (
                <div key={competitor.id} className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-semibold">{competitor.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{competitor.size}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">{competitor.marketShare}% PDM</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Agressivité</p>
                      <GaugeBar value={competitor.aggressiveness} label="" colorClass="bg-destructive" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Innovation</p>
                      <GaugeBar value={competitor.innovation} label="" colorClass="bg-info" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Réputation</p>
                      <GaugeBar value={competitor.reputation} label="" colorClass="bg-success" />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Prix: {competitor.priceLevel > 1 ? 'Plus cher' : competitor.priceLevel < 1 ? 'Moins cher' : 'Similaire'} ({(competitor.priceLevel * 100 - 100).toFixed(0)}%)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPIs Tab */}
      {activeTab === 'kpi' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Indicateurs de Performance Commerciale</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Pipeline Total', value: totalPipelineValue, format: 'currency' },
              { name: 'Pipeline Pondéré', value: weightedPipeline, format: 'currency' },
              { name: 'Deal Moyen', value: avgDealSize, format: 'currency' },
              { name: 'Taux Conversion', value: conversionRate, format: 'percent' },
              { name: 'Cycle Vente', value: avgSalesCycle, format: 'days' },
              { name: 'Clients Actifs', value: totalClients, format: 'number' },
              { name: 'CA Clients', value: totalClientRevenue, format: 'currency' },
              { name: 'Score Relation Moy.', value: avgClientScore, format: 'percent' },
            ].map(kpi => (
              <div key={kpi.name} className="bg-secondary/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">{kpi.name}</p>
                <p className="text-2xl font-bold text-foreground">
                  {kpi.format === 'currency' ? formatCurrency(kpi.value) :
                   kpi.format === 'percent' ? `${kpi.value.toFixed(0)}%` :
                   kpi.format === 'days' ? `${kpi.value}j` :
                   kpi.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
