import { useState } from "react";
import { Company, Product, Supplier, InventoryItem } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { GaugeBar } from "./GaugeBar";
import { 
  Factory,
  Settings,
  Wrench,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  BarChart3,
  Truck,
  Boxes,
  ClipboardCheck,
  Award,
  RefreshCw,
  Gauge,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedProductionPanelProps {
  company: Company;
  onCreateProductionLine?: (line: any) => void;
  onScheduleMaintenance?: (lineId: string) => void;
  onOptimizeProcess?: (type: string) => void;
}

// Mock production data
const generateProductionLines = (products: Product[]) => [
  { id: 'line1', name: 'Ligne Alpha', type: 'semi_auto', capacity: 100, currentOutput: 78, efficiency: 82, maintenanceLevel: 75, status: 'running', products: products.slice(0, 1).map(p => p.id) },
  { id: 'line2', name: 'Ligne Beta', type: 'automated', capacity: 200, currentOutput: 165, efficiency: 88, maintenanceLevel: 90, status: 'running', products: products.slice(0, 2).map(p => p.id) },
  { id: 'line3', name: 'Ligne Gamma', type: 'manual', capacity: 50, currentOutput: 35, efficiency: 70, maintenanceLevel: 45, status: 'maintenance', products: [] },
];

const qualityCertifications = [
  { id: 'iso9001', name: 'ISO 9001', description: 'Management qualité', status: 'certified', nextAudit: 90, cost: 15000 },
  { id: 'iso14001', name: 'ISO 14001', description: 'Management environnemental', status: 'in_progress', progress: 65, cost: 20000 },
  { id: 'iso45001', name: 'ISO 45001', description: 'Santé et sécurité', status: 'not_started', cost: 18000 },
];

const leanTools = [
  { id: '5s', name: '5S', description: 'Organisation du poste de travail', implemented: true, impact: '+15% productivité' },
  { id: 'smed', name: 'SMED', description: 'Réduction temps de changement', implemented: false, impact: '-50% temps setup' },
  { id: 'kanban', name: 'Kanban', description: 'Gestion flux tirés', implemented: true, impact: '-30% stocks' },
  { id: 'tpm', name: 'TPM', description: 'Maintenance productive totale', implemented: false, impact: '+20% disponibilité' },
  { id: 'kaizen', name: 'Kaizen', description: 'Amélioration continue', implemented: true, impact: '+10% efficacité/an' },
  { id: 'pokayoke', name: 'Poka-Yoke', description: 'Détrompeurs anti-erreur', implemented: false, impact: '-80% défauts' },
];

export function AdvancedProductionPanel({ company, onOptimizeProcess }: AdvancedProductionPanelProps) {
  const [activeTab, setActiveTab] = useState<'lines' | 'quality' | 'lean' | 'maintenance' | 'kpi' | 'planning'>('lines');

  const productionLines = generateProductionLines(company.products);
  
  // Calculate OEE (Overall Equipment Effectiveness)
  const avgAvailability = productionLines.filter(l => l.status === 'running').length / productionLines.length * 100;
  const avgPerformance = productionLines.reduce((sum, l) => sum + (l.currentOutput / l.capacity), 0) / productionLines.length * 100;
  const avgQuality = 96; // Mock quality rate
  const oee = (avgAvailability / 100) * (avgPerformance / 100) * (avgQuality / 100) * 100;

  // Calculate inventory metrics
  const totalStockValue = company.inventory.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);
  const lowStockItems = company.inventory.filter(i => i.quantity <= i.reorderLevel);

  const tabs = [
    { id: 'lines', label: 'Lignes', icon: Factory },
    { id: 'quality', label: 'Qualité', icon: Award },
    { id: 'lean', label: 'Lean', icon: Zap },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'kpi', label: 'KPIs', icon: BarChart3 },
    { id: 'planning', label: 'Planning', icon: Clock },
  ];

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-6 gap-3">
        <div className="game-panel text-center">
          <Gauge className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">OEE Global</p>
          <p className={cn("text-sm font-bold", oee >= 85 ? "text-success" : oee >= 60 ? "text-warning" : "text-destructive")}>
            {oee.toFixed(1)}%
          </p>
        </div>
        <div className="game-panel text-center">
          <Factory className="w-5 h-5 text-info mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Lignes Actives</p>
          <p className="text-sm font-bold">{productionLines.filter(l => l.status === 'running').length}/{productionLines.length}</p>
        </div>
        <div className="game-panel text-center">
          <TrendingUp className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Efficacité Moy.</p>
          <p className="text-sm font-bold">{Math.round(avgPerformance)}%</p>
        </div>
        <div className="game-panel text-center">
          <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Taux Qualité</p>
          <p className="text-sm font-bold text-success">{avgQuality}%</p>
        </div>
        <div className="game-panel text-center">
          <Boxes className="w-5 h-5 text-warning mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Valeur Stocks</p>
          <p className="text-sm font-bold">{formatCurrency(totalStockValue)}</p>
        </div>
        <div className="game-panel text-center">
          <AlertTriangle className="w-5 h-5 text-destructive mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Alertes Stock</p>
          <p className={cn("text-sm font-bold", lowStockItems.length > 0 ? "text-destructive" : "text-success")}>
            {lowStockItems.length}
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

      {/* Production Lines Tab */}
      {activeTab === 'lines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {productionLines.map(line => (
              <div key={line.id} className="game-panel">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-display font-semibold">{line.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{line.type.replace('_', ' ')}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    line.status === 'running' ? "bg-success/20 text-success" :
                    line.status === 'maintenance' ? "bg-warning/20 text-warning" :
                    "bg-destructive/20 text-destructive"
                  )}>
                    {line.status === 'running' ? 'En marche' : line.status === 'maintenance' ? 'Maintenance' : 'Arrêt'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Production</span>
                      <span>{line.currentOutput}/{line.capacity} unités/jour</span>
                    </div>
                    <GaugeBar value={(line.currentOutput / line.capacity) * 100} label="" colorClass="bg-primary" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Efficacité</span>
                      <span className={line.efficiency >= 80 ? "text-success" : "text-warning"}>{line.efficiency}%</span>
                    </div>
                    <GaugeBar value={line.efficiency} label="" colorClass={line.efficiency >= 80 ? "bg-success" : "bg-warning"} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>État maintenance</span>
                      <span className={line.maintenanceLevel >= 70 ? "text-success" : line.maintenanceLevel >= 40 ? "text-warning" : "text-destructive"}>
                        {line.maintenanceLevel}%
                      </span>
                    </div>
                    <GaugeBar 
                      value={line.maintenanceLevel} 
                      label="" 
                      colorClass={line.maintenanceLevel >= 70 ? "bg-success" : line.maintenanceLevel >= 40 ? "bg-warning" : "bg-destructive"} 
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 btn-game-primary text-xs py-1.5">
                      <Settings className="w-3 h-3 mr-1 inline" /> Configurer
                    </button>
                    <button className="flex-1 btn-game-secondary text-xs py-1.5">
                      <Wrench className="w-3 h-3 mr-1 inline" /> Maintenance
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full btn-game-primary flex items-center justify-center gap-2">
            <Factory className="w-4 h-4" /> Ajouter une ligne de production
          </button>
        </div>
      )}

      {/* Quality Tab */}
      {activeTab === 'quality' && (
        <div className="space-y-4">
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> Certifications
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {qualityCertifications.map(cert => (
                <div key={cert.id} className={cn(
                  "rounded-lg p-4 border-2",
                  cert.status === 'certified' ? "bg-success/10 border-success" :
                  cert.status === 'in_progress' ? "bg-warning/10 border-warning" :
                  "bg-secondary/50 border-transparent"
                )}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-xs text-muted-foreground">{cert.description}</p>
                    </div>
                    {cert.status === 'certified' && <CheckCircle className="w-5 h-5 text-success" />}
                    {cert.status === 'in_progress' && <Clock className="w-5 h-5 text-warning" />}
                  </div>
                  
                  {cert.status === 'certified' && (
                    <p className="text-xs text-success">Prochain audit dans {cert.nextAudit} jours</p>
                  )}
                  {cert.status === 'in_progress' && (
                    <>
                      <GaugeBar value={cert.progress || 0} label="" colorClass="bg-warning" />
                      <p className="text-xs text-muted-foreground mt-1">{cert.progress}% complété</p>
                    </>
                  )}
                  {cert.status === 'not_started' && (
                    <button className="w-full btn-game-secondary text-xs py-1 mt-2">
                      Démarrer ({formatCurrency(cert.cost)})
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-info" /> Contrôle Qualité
            </h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-success">96%</p>
                <p className="text-xs text-muted-foreground">Taux de conformité</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-warning">12</p>
                <p className="text-xs text-muted-foreground">Non-conformités</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-info">89%</p>
                <p className="text-xs text-muted-foreground">First Pass Yield</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">2.1%</p>
                <p className="text-xs text-muted-foreground">Taux de rebut</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lean Tab */}
      {activeTab === 'lean' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" /> Outils Lean Manufacturing
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {leanTools.map(tool => (
              <div key={tool.id} className={cn(
                "rounded-lg p-4 border-2 transition-colors",
                tool.implemented ? "bg-success/10 border-success" : "bg-secondary/50 border-transparent hover:border-primary/50"
              )}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                  {tool.implemented ? (
                    <CheckCircle className="w-5 h-5 text-success shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground shrink-0" />
                  )}
                </div>
                <p className="text-xs font-medium text-primary">{tool.impact}</p>
                {!tool.implemented && (
                  <button 
                    onClick={() => onOptimizeProcess?.(tool.id)}
                    className="w-full btn-game-primary text-xs py-1 mt-2"
                  >
                    Implémenter
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-warning" /> Planning Maintenance
            </h4>
            <div className="space-y-3">
              {productionLines.map(line => (
                <div key={line.id} className="bg-secondary/50 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{line.name}</p>
                    <p className="text-xs text-muted-foreground">
                      État: {line.maintenanceLevel}% | Type: {line.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <GaugeBar 
                      value={line.maintenanceLevel} 
                      label="" 
                      colorClass={line.maintenanceLevel >= 70 ? "bg-success" : line.maintenanceLevel >= 40 ? "bg-warning" : "bg-destructive"} 
                    />
                    <button className="btn-game-secondary text-xs py-1 px-3">
                      Planifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="game-panel">
              <h4 className="font-display font-semibold mb-3">Maintenances Préventives</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Ce mois</span><span className="font-medium">3</span></div>
                <div className="flex justify-between"><span>Coût estimé</span><span className="font-medium">{formatCurrency(4500)}</span></div>
                <div className="flex justify-between"><span>Temps arrêt prévu</span><span className="font-medium">12h</span></div>
              </div>
            </div>
            <div className="game-panel">
              <h4 className="font-display font-semibold mb-3">Indicateurs MTBF/MTTR</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>MTBF moyen</span><span className="font-medium text-success">720h</span></div>
                <div className="flex justify-between"><span>MTTR moyen</span><span className="font-medium text-warning">4.2h</span></div>
                <div className="flex justify-between"><span>Disponibilité</span><span className="font-medium text-success">99.4%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPIs Tab */}
      {activeTab === 'kpi' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Indicateurs de Performance Production</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'OEE', value: oee, target: 85, unit: '%', good: true },
              { name: 'Disponibilité', value: avgAvailability, target: 95, unit: '%', good: avgAvailability >= 90 },
              { name: 'Performance', value: avgPerformance, target: 90, unit: '%', good: avgPerformance >= 85 },
              { name: 'Qualité', value: avgQuality, target: 99, unit: '%', good: avgQuality >= 95 },
              { name: 'Takt Time', value: 45, target: 40, unit: 's', good: false },
              { name: 'Lead Time', value: 5.2, target: 4, unit: 'j', good: false },
              { name: 'Rotation Stock', value: 8.5, target: 10, unit: 'x', good: false },
              { name: 'Taux Rebut', value: 2.1, target: 1.5, unit: '%', good: false },
            ].map(kpi => (
              <div key={kpi.name} className="bg-secondary/50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-muted-foreground">{kpi.name}</p>
                  {kpi.good ? <TrendingUp className="w-4 h-4 text-success" /> : <Target className="w-4 h-4 text-warning" />}
                </div>
                <p className={cn("text-xl font-bold", kpi.good ? "text-success" : "text-warning")}>
                  {typeof kpi.value === 'number' ? kpi.value.toFixed(1) : kpi.value}{kpi.unit}
                </p>
                <p className="text-xs text-muted-foreground">Cible: {kpi.target}{kpi.unit}</p>
                <GaugeBar 
                  value={Math.min(100, (kpi.value / kpi.target) * 100)} 
                  label="" 
                  colorClass={kpi.good ? "bg-success" : "bg-warning"} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Planning Tab */}
      {activeTab === 'planning' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-info" /> Planning de Production
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Produit</th>
                  <th className="text-center py-2">Ligne</th>
                  <th className="text-right py-2">Quantité</th>
                  <th className="text-right py-2">Produit</th>
                  <th className="text-right py-2">Progression</th>
                  <th className="text-center py-2">Priorité</th>
                  <th className="text-center py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {company.products.filter(p => p.phase !== 'rd').map((product, i) => (
                  <tr key={product.id} className="border-b border-border/50">
                    <td className="py-2 font-medium">{product.name}</td>
                    <td className="text-center py-2">Ligne {['Alpha', 'Beta', 'Gamma'][i % 3]}</td>
                    <td className="text-right py-2">{Math.round(product.salesVolume * 30)}</td>
                    <td className="text-right py-2">{Math.round(product.salesVolume * 30 * 0.7)}</td>
                    <td className="text-right py-2">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-16">
                          <GaugeBar value={70} label="" colorClass="bg-primary" />
                        </div>
                        <span>70%</span>
                      </div>
                    </td>
                    <td className="text-center py-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        i === 0 ? "bg-destructive/20 text-destructive" :
                        i === 1 ? "bg-warning/20 text-warning" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {i === 0 ? 'Haute' : i === 1 ? 'Moyenne' : 'Basse'}
                      </span>
                    </td>
                    <td className="text-center py-2">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-success/20 text-success">En cours</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
