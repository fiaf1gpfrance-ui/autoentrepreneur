import { useState } from "react";
import { formatCurrency } from "@/utils/gameEngine";
import { 
  Cpu, 
  Brain, 
  Shield, 
  Cloud, 
  Database, 
  Smartphone, 
  Wifi, 
  Link,
  Lock,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  Beaker
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Technology {
  id: string;
  name: string;
  category: string;
  description: string;
  cost: number;
  researchTime: number;
  productivity: number;
  unlocked: boolean;
  researching: boolean;
  progress: number;
  prerequisites: string[];
}

interface TechnologyPanelProps {
  technologies: Technology[];
  treasury: number;
  onStartResearch: (techId: string) => void;
  onCancelResearch?: (techId: string) => void;
}

const categoryConfig: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  automation: { icon: Cpu, color: "text-blue-500", bgColor: "bg-blue-500/10", label: "Automatisation" },
  ai: { icon: Brain, color: "text-purple-500", bgColor: "bg-purple-500/10", label: "Intelligence Artificielle" },
  security: { icon: Shield, color: "text-red-500", bgColor: "bg-red-500/10", label: "Sécurité" },
  cloud: { icon: Cloud, color: "text-cyan-500", bgColor: "bg-cyan-500/10", label: "Cloud" },
  data: { icon: Database, color: "text-green-500", bgColor: "bg-green-500/10", label: "Data" },
  mobile: { icon: Smartphone, color: "text-orange-500", bgColor: "bg-orange-500/10", label: "Mobile" },
  iot: { icon: Wifi, color: "text-yellow-500", bgColor: "bg-yellow-500/10", label: "IoT" },
  blockchain: { icon: Link, color: "text-pink-500", bgColor: "bg-pink-500/10", label: "Blockchain" },
};

export function TechnologyPanel({ technologies, treasury, onStartResearch, onCancelResearch }: TechnologyPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const unlockedCount = technologies.filter(t => t.unlocked).length;
  const researchingCount = technologies.filter(t => t.researching).length;
  const totalProductivityBonus = technologies.filter(t => t.unlocked).reduce((sum, t) => sum + t.productivity, 0);
  
  const groupedTech = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  const canResearch = (tech: Technology): boolean => {
    if (tech.unlocked || tech.researching) return false;
    if (treasury < tech.cost) return false;
    return tech.prerequisites.every(prereqId => 
      technologies.find(t => t.id === prereqId)?.unlocked
    );
  };

  const displayedCategories = selectedCategory 
    ? { [selectedCategory]: groupedTech[selectedCategory] || [] }
    : groupedTech;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="game-panel text-center">
          <Beaker className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{unlockedCount}/{technologies.length}</p>
          <p className="text-xs text-muted-foreground">Technologies</p>
        </div>
        <div className="game-panel text-center">
          <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{researchingCount}</p>
          <p className="text-xs text-muted-foreground">En Recherche</p>
        </div>
        <div className="game-panel text-center">
          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">+{totalProductivityBonus}%</p>
          <p className="text-xs text-muted-foreground">Bonus Productivité</p>
        </div>
        <div className="game-panel text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{Math.round((unlockedCount / technologies.length) * 100)}%</p>
          <p className="text-xs text-muted-foreground">Avancement R&D</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="game-panel">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm transition-colors",
              !selectedCategory 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            Tous
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = groupedTech[key]?.filter(t => t.unlocked).length || 0;
            const total = groupedTech[key]?.length || 0;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                  selectedCategory === key 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <Icon className="w-4 h-4" />
                {config.label}
                <span className="text-xs opacity-70">({count}/{total})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnlockedOnly}
              onChange={(e) => setShowUnlockedOnly(e.target.checked)}
              className="rounded"
            />
            <span className="text-muted-foreground">Afficher uniquement les technologies débloquées</span>
          </label>
        </div>
      </div>

      {/* Technology Tree */}
      <div className="space-y-6">
        {Object.entries(displayedCategories).map(([category, techs]) => {
          const config = categoryConfig[category] || categoryConfig.automation;
          const Icon = config.icon;
          const filteredTechs = showUnlockedOnly ? techs.filter(t => t.unlocked) : techs;
          
          if (filteredTechs.length === 0) return null;
          
          return (
            <div key={category} className="game-panel">
              <div className="flex items-center gap-2 mb-4">
                <div className={cn("p-2 rounded-lg", config.bgColor)}>
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <h3 className="font-display font-semibold">{config.label}</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  {techs.filter(t => t.unlocked).length}/{techs.length} débloquées
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTechs.map(tech => {
                  const isResearchable = canResearch(tech);
                  const prereqsMet = tech.prerequisites.every(prereqId => 
                    technologies.find(t => t.id === prereqId)?.unlocked
                  );
                  
                  return (
                    <div 
                      key={tech.id}
                      className={cn(
                        "relative p-4 rounded-lg border transition-all",
                        tech.unlocked 
                          ? "bg-gradient-to-br from-success/20 to-success/5 border-success/30"
                          : tech.researching
                          ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 animate-pulse"
                          : prereqsMet
                          ? "bg-card border-border hover:border-primary/50"
                          : "bg-secondary/30 border-border opacity-50"
                      )}
                    >
                      {tech.unlocked && (
                        <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-success" />
                      )}
                      {!prereqsMet && !tech.unlocked && (
                        <Lock className="absolute top-2 right-2 w-4 h-4 text-muted-foreground" />
                      )}
                      
                      <h4 className="font-medium mb-1">{tech.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{tech.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-muted-foreground">Coût:</span>
                          <span className="ml-1 font-medium">{formatCurrency(tech.cost)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Durée:</span>
                          <span className="ml-1 font-medium">{tech.researchTime} mois</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Productivité:</span>
                          <span className="ml-1 font-medium text-success">+{tech.productivity}%</span>
                        </div>
                      </div>
                      
                      {tech.prerequisites.length > 0 && !tech.unlocked && (
                        <div className="text-[10px] text-muted-foreground mb-3">
                          <span>Prérequis: </span>
                          {tech.prerequisites.map((prereqId, i) => {
                            const prereq = technologies.find(t => t.id === prereqId);
                            return (
                              <span 
                                key={prereqId}
                                className={cn(
                                  prereq?.unlocked ? "text-success" : "text-destructive"
                                )}
                              >
                                {prereq?.name || prereqId}
                                {i < tech.prerequisites.length - 1 && ", "}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      
                      {tech.researching && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-mono">{Math.round(tech.progress)}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${tech.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {!tech.unlocked && !tech.researching && (
                        <button
                          onClick={() => onStartResearch(tech.id)}
                          disabled={!isResearchable}
                          className={cn(
                            "w-full py-2 rounded-lg text-sm font-medium transition-colors",
                            isResearchable
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "bg-secondary text-muted-foreground cursor-not-allowed"
                          )}
                        >
                          {!prereqsMet 
                            ? "Prérequis manquants" 
                            : treasury < tech.cost 
                            ? "Budget insuffisant"
                            : "Lancer la R&D"
                          }
                        </button>
                      )}
                      
                      {tech.researching && onCancelResearch && (
                        <button
                          onClick={() => onCancelResearch(tech.id)}
                          className="w-full py-2 rounded-lg text-sm font-medium bg-destructive/20 text-destructive hover:bg-destructive/30"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
