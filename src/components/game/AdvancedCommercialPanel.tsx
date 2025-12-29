import { useState } from "react";
import { Company, Client, ClientContract, Competitor, Product } from "@/types/game";
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
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedCommercialPanelProps {
  company: Company;
  onContactClient?: (clientId: string) => void;
  onCreateOpportunity?: (clientId: string) => void;
  onAdvanceOpportunity?: (oppId: string, stage: string) => void;
}

// Mock CRM data
const mockOpportunities = [
  { id: 'opp1', name: 'Contrat Enterprise ABC', client: 'TechCorp SA', value: 150000, stage: 'negotiation', probability: 75, daysOpen: 45, nextAction: 'Présentation finale' },
  { id: 'opp2', name: 'Renouvellement Premium', client: 'GlobalRetail', value: 85000, stage: 'proposal', probability: 60, daysOpen: 28, nextAction: 'Envoi devis révisé' },
  { id: 'opp3', name: 'Extension Services', client: 'FinanceFirst', value: 220000, stage: 'qualification', probability: 40, daysOpen: 12, nextAction: 'RDV découverte' },
  { id: 'opp4', name: 'POC Innovation', client: 'StartupXYZ', value: 35000, stage: 'demo', probability: 55, daysOpen: 20, nextAction: 'Demo technique' },
];

const pipelineStages = [
  { id: 'qualification', name: 'Qualification', color: 'bg-blue-500' },
  { id: 'demo', name: 'Démonstration', color: 'bg-purple-500' },
  { id: 'proposal', name: 'Proposition', color: 'bg-amber-500' },
  { id: 'negotiation', name: 'Négociation', color: 'bg-orange-500' },
  { id: 'closing', name: 'Closing', color: 'bg-green-500' },
];

export function AdvancedCommercialPanel({ company, onContactClient }: AdvancedCommercialPanelProps) {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'clients' | 'forecast' | 'competition' | 'activity' | 'kpi'>('pipeline');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Calculate metrics
  const totalPipelineValue = mockOpportunities.reduce((sum, o) => sum + o.value, 0);
  const weightedPipeline = mockOpportunities.reduce((sum, o) => sum + o.value * (o.probability / 100), 0);
  const avgDealSize = totalPipelineValue / mockOpportunities.length;
  const conversionRate = 32; // Mock
  const avgSalesCycle = 45; // Mock days

  // Client metrics
  const totalClients = company.clients.length;
  const activeContracts = company.clients.flatMap(c => c.contracts).filter(c => c.status === 'active').length;
  const totalClientRevenue = company.clients.reduce((sum, c) => sum + c.totalRevenue, 0);
  const avgClientScore = company.clients.length > 0 
    ? company.clients.reduce((sum, c) => sum + c.relationshipScore, 0) / company.clients.length 
    : 0;

  const tabs = [
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'forecast', label: 'Prévisions', icon: Target },
    { id: 'competition', label: 'Concurrence', icon: Eye },
    { id: 'activity', label: 'Activités', icon: Calendar },
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
          {/* Pipeline Stages */}
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
                .map(opp => (
                <div key={opp.id} className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{opp.name}</p>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        pipelineStages.find(s => s.id === opp.stage)?.color.replace('bg-', 'bg-') + '/20',
                        pipelineStages.find(s => s.id === opp.stage)?.color.replace('bg-', 'text-').replace('-500', '-400')
                      )}>
                        {pipelineStages.find(s => s.id === opp.stage)?.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{opp.client} • {opp.daysOpen} jours</p>
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
              ))}
            </div>
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
                  <th className="text-center py-2">Dernier Contact</th>
                  <th className="text-center py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {company.clients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
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
                          <GaugeBar value={client.relationshipScore} label="" colorClass={client.relationshipScore >= 70 ? "bg-success" : "bg-warning"} />
                          <span className="text-xs">{client.relationshipScore}%</span>
                        </div>
                      </td>
                      <td className="text-center py-3 text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 30)} jours
                      </td>
                      <td className="text-center py-3">
                        <div className="flex justify-center gap-1">
                          <button className="p-1.5 rounded bg-secondary hover:bg-secondary/80"><Phone className="w-3 h-3" /></button>
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

      {/* Forecast Tab */}
      {activeTab === 'forecast' && (
        <div className="space-y-4">
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Prévisions de Ventes</h4>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {['Best Case', 'Commit', 'Expected', 'Worst Case'].map((scenario, i) => {
                const values = [totalPipelineValue * 0.9, weightedPipeline * 1.1, weightedPipeline, weightedPipeline * 0.7];
                return (
                  <div key={scenario} className="bg-secondary/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{scenario}</p>
                    <p className={cn(
                      "text-xl font-bold",
                      i === 0 ? "text-success" : i === 3 ? "text-destructive" : "text-foreground"
                    )}>
                      {formatCurrency(values[i])}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h5 className="font-medium">Objectif Trimestriel</h5>
                  <p className="text-xs text-muted-foreground">Q{Math.ceil((new Date().getMonth() + 1) / 3)} 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatCurrency(totalClientRevenue)}</p>
                  <p className="text-xs text-muted-foreground">sur {formatCurrency(500000)} objectif</p>
                </div>
              </div>
              <GaugeBar value={Math.min(100, (totalClientRevenue / 500000) * 100)} label="" colorClass="bg-primary" />
              <p className="text-xs text-muted-foreground mt-2">
                {((totalClientRevenue / 500000) * 100).toFixed(1)}% de l'objectif atteint
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="game-panel">
              <h4 className="font-display font-semibold mb-3">Par Produit</h4>
              <div className="space-y-2">
                {company.products.slice(0, 5).map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-sm">{product.name}</span>
                    <span className="font-medium">{formatCurrency(product.salesVolume * product.currentPrice * 30)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="game-panel">
              <h4 className="font-display font-semibold mb-3">Par Segment</h4>
              <div className="space-y-2">
                {['Grand Compte', 'PME', 'TPE', 'Particulier', 'Public'].map((segment, i) => (
                  <div key={segment} className="flex justify-between items-center">
                    <span className="text-sm">{segment}</span>
                    <span className="font-medium">{formatCurrency([120000, 85000, 45000, 20000, 30000][i])}</span>
                  </div>
                ))}
              </div>
            </div>
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
                      <GaugeBar value={competitor.innovation} label="" colorClass="bg-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Réputation</p>
                      <GaugeBar value={competitor.reputation} label="" colorClass="bg-success" />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Prix: {competitor.priceLevel > 1 ? '+' : ''}{((competitor.priceLevel - 1) * 100).toFixed(0)}% vs nous</span>
                    <span className="text-muted-foreground">{competitor.products.length} produits</span>
                  </div>
                </div>
              ))}
            </div>

            {company.competitors.length === 0 && (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">Aucun concurrent identifié</p>
              </div>
            )}
          </div>

          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Positionnement Prix</h4>
            <div className="flex items-end justify-around h-32 bg-secondary/30 rounded-lg p-4">
              {[...company.competitors.slice(0, 3), { name: 'Vous', priceLevel: 1, marketShare: company.marketShare }].map((c, i) => (
                <div key={i} className="text-center">
                  <div 
                    className={cn(
                      "w-16 rounded-t-lg mx-auto mb-2",
                      c.name === 'Vous' ? "bg-primary" : "bg-muted"
                    )}
                    style={{ height: `${Math.max(20, c.marketShare * 2)}px` }}
                  />
                  <p className="text-xs font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.marketShare}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-info" /> Activités Commerciales
          </h4>
          <div className="space-y-3">
            {[
              { type: 'call', title: 'Appel TechCorp SA', time: 'Aujourd\'hui 14h00', status: 'scheduled' },
              { type: 'meeting', title: 'RDV GlobalRetail - Négociation', time: 'Demain 10h00', status: 'scheduled' },
              { type: 'email', title: 'Relance FinanceFirst', time: 'Hier', status: 'completed' },
              { type: 'demo', title: 'Demo StartupXYZ', time: 'Dans 3 jours', status: 'scheduled' },
              { type: 'call', title: 'Appel suivi prospect', time: 'Il y a 2 jours', status: 'completed' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 bg-secondary/30 rounded-lg p-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  activity.type === 'call' ? "bg-blue-500/20" :
                  activity.type === 'meeting' ? "bg-purple-500/20" :
                  activity.type === 'email' ? "bg-green-500/20" :
                  "bg-amber-500/20"
                )}>
                  {activity.type === 'call' ? <Phone className="w-4 h-4 text-blue-400" /> :
                   activity.type === 'meeting' ? <Users className="w-4 h-4 text-purple-400" /> :
                   activity.type === 'email' ? <Mail className="w-4 h-4 text-green-400" /> :
                   <Eye className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  activity.status === 'completed' ? "bg-success/20 text-success" : "bg-info/20 text-info"
                )}>
                  {activity.status === 'completed' ? 'Terminé' : 'Planifié'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPIs Tab */}
      {activeTab === 'kpi' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Indicateurs Commerciaux</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Taux de conversion', value: conversionRate, target: 35, unit: '%', trend: 'up' },
              { name: 'Cycle de vente', value: avgSalesCycle, target: 40, unit: 'j', trend: 'down' },
              { name: 'Panier moyen', value: avgDealSize, target: 50000, unit: '€', trend: 'up' },
              { name: 'Vélocité pipeline', value: 125000, target: 100000, unit: '€/mois', trend: 'up' },
              { name: 'NPS Clients', value: 45, target: 50, unit: '', trend: 'stable' },
              { name: 'Taux rétention', value: 92, target: 90, unit: '%', trend: 'up' },
              { name: 'CAC', value: 2500, target: 2000, unit: '€', trend: 'down' },
              { name: 'LTV/CAC', value: 4.2, target: 5, unit: 'x', trend: 'up' },
            ].map(kpi => {
              const isGood = kpi.name === 'Cycle de vente' || kpi.name === 'CAC' 
                ? kpi.value <= kpi.target 
                : kpi.value >= kpi.target;
              return (
                <div key={kpi.name} className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-muted-foreground">{kpi.name}</p>
                    {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4 text-success" /> :
                     kpi.trend === 'down' ? <TrendingUp className="w-4 h-4 text-destructive rotate-180" /> :
                     <div className="w-4 h-0.5 bg-muted-foreground rounded" />}
                  </div>
                  <p className={cn("text-xl font-bold", isGood ? "text-success" : "text-warning")}>
                    {typeof kpi.value === 'number' && kpi.unit === '€' ? formatCurrency(kpi.value) :
                     typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}{kpi.unit !== '€' ? kpi.unit : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">Cible: {kpi.unit === '€' ? formatCurrency(kpi.target) : kpi.target}{kpi.unit !== '€' ? kpi.unit : ''}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
