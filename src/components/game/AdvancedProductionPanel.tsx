import { useState } from "react";
import { Company, Product } from "@/types/game";
import { ProductionEquipment, EQUIPMENT_CATALOG, ProductionLine } from "@/types/production";
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
  Timer,
  Plus,
  ShoppingCart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedProductionPanelProps {
  company: Company;
  productionLines?: ProductionLine[];
  onBuyEquipment?: (equipment: ProductionEquipment) => void;
  onScheduleMaintenance?: (lineId: string) => void;
  onOptimizeProcess?: (type: string) => void;
  onAddProductionLine?: (line: ProductionLine) => void;
  onStartCertification?: (certId: string, cost: number) => void;
}

// Quality certifications with realistic costs
const qualityCertifications = [
  { id: 'iso9001', name: 'ISO 9001', description: 'Management qualité', status: 'not_started', nextAudit: 90, cost: 15000 },
  { id: 'iso14001', name: 'ISO 14001', description: 'Management environnemental', status: 'not_started', progress: 0, cost: 20000 },
  { id: 'iso45001', name: 'ISO 45001', description: 'Santé et sécurité', status: 'not_started', cost: 18000 },
];

const leanTools = [
  { id: '5s', name: '5S', description: 'Organisation du poste de travail', implemented: false, impact: '+15% productivité', cost: 5000 },
  { id: 'smed', name: 'SMED', description: 'Réduction temps de changement', implemented: false, impact: '-50% temps setup', cost: 8000 },
  { id: 'kanban', name: 'Kanban', description: 'Gestion flux tirés', implemented: false, impact: '-30% stocks', cost: 6000 },
  { id: 'tpm', name: 'TPM', description: 'Maintenance productive totale', implemented: false, impact: '+20% disponibilité', cost: 12000 },
  { id: 'kaizen', name: 'Kaizen', description: 'Amélioration continue', implemented: false, impact: '+10% efficacité/an', cost: 4000 },
  { id: 'pokayoke', name: 'Poka-Yoke', description: 'Détrompeurs anti-erreur', implemented: false, impact: '-80% défauts', cost: 7000 },
];

export function AdvancedProductionPanel({ 
  company, 
  productionLines = [],
  onBuyEquipment, 
  onScheduleMaintenance,
  onOptimizeProcess,
  onAddProductionLine,
  onStartCertification
}: AdvancedProductionPanelProps) {
  const [activeTab, setActiveTab] = useState<'lines' | 'equipment' | 'quality' | 'lean' | 'maintenance' | 'kpi'>('lines');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Generate mock production lines if none provided
  const lines = productionLines.length > 0 ? productionLines : [
    { id: 'line1', name: 'Ligne Alpha', type: 'semi_auto' as const, capacity: 100, currentOutput: 78, efficiency: 82, maintenanceLevel: 75, status: 'running' as const, machines: [], shifts: [], products: company.products.slice(0, 1).map(p => p.id) },
    { id: 'line2', name: 'Ligne Beta', type: 'automated' as const, capacity: 200, currentOutput: 165, efficiency: 88, maintenanceLevel: 90, status: 'running' as const, machines: [], shifts: [], products: company.products.slice(0, 2).map(p => p.id) },
  ];

  // Calculate OEE (Overall Equipment Effectiveness)
  const avgAvailability = lines.filter(l => l.status === 'running').length / Math.max(lines.length, 1) * 100;
  const avgPerformance = lines.reduce((sum, l) => sum + (l.currentOutput / l.capacity), 0) / Math.max(lines.length, 1) * 100;
  const avgQuality = 96;
  const oee = (avgAvailability / 100) * (avgPerformance / 100) * (avgQuality / 100) * 100;

  // Calculate inventory metrics
  const totalStockValue = company.inventory.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);
  const lowStockItems = company.inventory.filter(i => i.quantity <= i.reorderLevel);

  // Equipment categories
  const equipmentCategories = [...new Set(EQUIPMENT_CATALOG.map(e => e.category))];

  const tabs = [
    { id: 'lines', label: 'Lignes', icon: Factory },
    { id: 'equipment', label: 'Équipements', icon: ShoppingCart },
    { id: 'quality', label: 'Qualité', icon: Award },
    { id: 'lean', label: 'Lean', icon: Zap },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'kpi', label: 'KPIs', icon: BarChart3 },
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
          <p className="text-sm font-bold">{lines.filter(l => l.status === 'running').length}/{lines.length}</p>
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
            {lines.map(line => (
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
                    <button 
                      onClick={() => onScheduleMaintenance?.(line.id)}
                      className="flex-1 btn-game-secondary text-xs py-1.5"
                    >
                      <Wrench className="w-3 h-3 mr-1 inline" /> Maintenance
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              const newLine: ProductionLine = {
                id: `line_${Date.now()}`,
                name: `Ligne ${lines.length + 1}`,
                type: 'semi_auto',
                capacity: 100,
                currentOutput: 0,
                efficiency: 70,
                maintenanceLevel: 100,
                status: 'stopped',
                machines: [],
                shifts: [],
                products: []
              };
              onAddProductionLine?.(newLine);
            }}
            disabled={company.treasury < 50000}
            className="w-full btn-game-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Factory className="w-4 h-4" /> Ajouter une ligne de production (50 000€)
          </button>
        </div>
      )}

      {/* Equipment Shop Tab */}
      {activeTab === 'equipment' && (
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
            {equipmentCategories.map(cat => (
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
            {EQUIPMENT_CATALOG
              .filter(eq => selectedCategory === 'all' || eq.category === selectedCategory)
              .map(equipment => (
              <div key={equipment.id} className="game-panel">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-display font-semibold">{equipment.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{equipment.category}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    equipment.tier === 'premium' ? "bg-purple-500/20 text-purple-400" :
                    equipment.tier === 'advanced' ? "bg-info/20 text-info" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {equipment.tier}
                  </span>
                </div>
                
                <div className="space-y-2 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacité</span>
                    <span className="font-medium">+{equipment.capacityBoost} unités/jour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficacité</span>
                    <span className="font-medium text-success">+{equipment.efficiencyBoost}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maintenance</span>
                    <span className="font-medium">{formatCurrency(equipment.maintenanceCost)}/mois</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{formatCurrency(equipment.price)}</span>
                  <button
                    onClick={() => onBuyEquipment?.(equipment)}
                    disabled={company.treasury < equipment.price}
                    className="btn-game-primary text-xs py-1.5 px-4 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-3 h-3 mr-1 inline" /> Acheter
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                    <button 
                      onClick={() => onStartCertification?.(cert.id, cert.cost)}
                      disabled={company.treasury < cert.cost}
                      className="w-full btn-game-secondary text-xs py-1 mt-2 disabled:opacity-50"
                    >
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
                <p className="text-xs font-medium text-primary mb-2">{tool.impact}</p>
                {!tool.implemented && (
                  <button 
                    onClick={() => onOptimizeProcess?.(tool.id)}
                    disabled={company.treasury < tool.cost}
                    className="w-full btn-game-primary text-xs py-1 disabled:opacity-50"
                  >
                    Implémenter ({formatCurrency(tool.cost)})
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
              {lines.map(line => (
                <div key={line.id} className="bg-secondary/50 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{line.name}</p>
                    <p className="text-xs text-muted-foreground">
                      État: {line.maintenanceLevel}% | Type: {line.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <GaugeBar 
                        value={line.maintenanceLevel} 
                        label="" 
                        colorClass={line.maintenanceLevel >= 70 ? "bg-success" : line.maintenanceLevel >= 40 ? "bg-warning" : "bg-destructive"} 
                      />
                    </div>
                    <button 
                      onClick={() => onScheduleMaintenance?.(line.id)}
                      disabled={company.treasury < 2000}
                      className="btn-game-secondary text-xs py-1 px-3 disabled:opacity-50"
                    >
                      Planifier (2 000€)
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
              { name: 'OEE', value: oee, target: 85, unit: '%', good: oee >= 85 },
              { name: 'Taux Qualité', value: avgQuality, target: 98, unit: '%', good: avgQuality >= 98 },
              { name: 'Disponibilité', value: avgAvailability, target: 95, unit: '%', good: avgAvailability >= 95 },
              { name: 'Performance', value: avgPerformance, target: 90, unit: '%', good: avgPerformance >= 90 },
              { name: 'Temps Cycle', value: 45, target: 40, unit: 'min', good: false },
              { name: 'Lead Time', value: 5, target: 3, unit: 'jours', good: false },
              { name: 'Productivité', value: 85, target: 90, unit: '%', good: false },
              { name: 'Rotation Stocks', value: 8, target: 12, unit: 'x/an', good: false },
            ].map(kpi => (
              <div key={kpi.name} className="bg-secondary/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">{kpi.name}</p>
                <p className={cn("text-2xl font-bold", kpi.good ? "text-success" : "text-warning")}>
                  {typeof kpi.value === 'number' ? kpi.value.toFixed(1) : kpi.value}{kpi.unit}
                </p>
                <p className="text-xs text-muted-foreground">Cible: {kpi.target}{kpi.unit}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
