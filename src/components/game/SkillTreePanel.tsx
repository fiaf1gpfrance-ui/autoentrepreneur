import { useState, useMemo } from "react";
import { 
  SkillTreeState, 
  Skill, 
  SkillCategory, 
  SkillTier,
  SPECIALIZATION_DEFINITIONS 
} from "@/types/skillTree";
import {
  initializeSkillTree,
  canUnlockSkill,
  unlockSkill,
  getSkillCost,
  getSkillsByCategory,
  getOverallProgress,
  canActivateSpecialization,
  activateSpecialization,
  respecCategory,
  fullRespec,
  calculateTotalSkillBonuses
} from "@/utils/skillTreeEngine";
import { 
  Crown, 
  Clock, 
  Target, 
  Calculator, 
  PiggyBank, 
  Banknote,
  Star,
  Heart,
  TrendingUp,
  Cpu,
  Laptop,
  BarChart,
  UserPlus,
  GraduationCap,
  Users,
  CheckCircle,
  Settings,
  Package,
  Globe,
  FileText,
  Shield,
  Map,
  Zap,
  Lightbulb,
  Search,
  Minimize,
  Handshake,
  Ship,
  Network,
  Lock,
  Gavel,
  Sparkles,
  GitMerge,
  Brain,
  Factory,
  Scale,
  Trophy,
  Atom,
  HeartHandshake,
  Earth,
  Gem,
  Rocket,
  Landmark,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Info,
  Building,
  Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface SkillTreePanelProps {
  onSkillPointsChange?: (points: number) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Crown, Clock, Target, Calculator, PiggyBank, Banknote, Star, Heart, TrendingUp,
  Cpu, Laptop, BarChart, UserPlus, GraduationCap, Users, CheckCircle, Settings,
  Package, Globe, FileText, Shield, Map, Zap, Lightbulb, Search, Minimize,
  Handshake, Ship, Network, Lock, Gavel, Sparkles, GitMerge, Brain, Factory,
  Scale, Trophy, Atom, HeartHandshake, Earth, Gem, Rocket, Landmark, Building, Megaphone
};

const categoryConfig: Record<SkillCategory, { name: string; icon: React.ElementType; color: string }> = {
  management: { name: "Management", icon: Crown, color: "from-amber-500 to-orange-600" },
  finance: { name: "Finance", icon: Landmark, color: "from-emerald-500 to-teal-600" },
  marketing: { name: "Marketing", icon: Megaphone, color: "from-pink-500 to-rose-600" },
  technology: { name: "Technologie", icon: Cpu, color: "from-cyan-500 to-blue-600" },
  hr: { name: "Ressources Humaines", icon: Users, color: "from-violet-500 to-purple-600" },
  production: { name: "Production", icon: Factory, color: "from-gray-500 to-slate-600" },
  international: { name: "International", icon: Globe, color: "from-indigo-500 to-blue-600" },
  legal: { name: "Juridique", icon: Scale, color: "from-slate-500 to-gray-600" }
};

const tierColors: Record<SkillTier, string> = {
  1: "border-gray-400 bg-gray-500/20",
  2: "border-green-400 bg-green-500/20",
  3: "border-blue-400 bg-blue-500/20",
  4: "border-purple-400 bg-purple-500/20",
  5: "border-amber-400 bg-amber-500/20"
};

const tierNames: Record<SkillTier, string> = {
  1: "Fondamental",
  2: "Intermédiaire",
  3: "Avancé",
  4: "Expert",
  5: "Maîtrise"
};

export function SkillTreePanel({ onSkillPointsChange }: SkillTreePanelProps) {
  const [skillTree, setSkillTree] = useState<SkillTreeState>(() => initializeSkillTree());
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>("management");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showSpecializations, setShowSpecializations] = useState(false);
  const [expandedTiers, setExpandedTiers] = useState<Record<SkillTier, boolean>>({ 1: true, 2: true, 3: true, 4: true, 5: true });

  const progress = useMemo(() => getOverallProgress(skillTree), [skillTree]);
  const bonuses = useMemo(() => calculateTotalSkillBonuses(skillTree), [skillTree]);
  const categorySkills = useMemo(() => getSkillsByCategory(skillTree, selectedCategory), [skillTree, selectedCategory]);

  const handleUnlockSkill = (skillId: string) => {
    const result = canUnlockSkill(skillTree, skillId);
    if (!result.canUnlock) {
      toast.error(result.reason);
      return;
    }

    const newState = unlockSkill(skillTree, skillId);
    setSkillTree(newState);
    
    const skill = newState.skills[skillId];
    toast.success(`${skill.name} amélioré au niveau ${skill.currentLevel}!`);
    onSkillPointsChange?.(newState.skillPoints);
  };

  const handleActivateSpecialization = (specId: string) => {
    const result = canActivateSpecialization(skillTree, specId as any);
    if (!result.canActivate) {
      toast.error(result.reason);
      return;
    }

    const newState = activateSpecialization(skillTree, specId as any);
    setSkillTree(newState);
    
    const spec = SPECIALIZATION_DEFINITIONS.find(s => s.id === specId);
    toast.success(`Spécialisation "${spec?.name}" activée!`);
  };

  const handleRespecCategory = (category: SkillCategory) => {
    const newState = respecCategory(skillTree, category);
    setSkillTree(newState);
    toast.info(`Catégorie ${categoryConfig[category].name} réinitialisée. Points récupérés: ${newState.skillPoints - skillTree.skillPoints}`);
  };

  const handleFullRespec = () => {
    const newState = fullRespec(skillTree);
    setSkillTree(newState);
    toast.info(`Réinitialisation complète. Points récupérés: ${newState.skillPoints}`);
  };

  const toggleTier = (tier: SkillTier) => {
    setExpandedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  const renderSkillNode = (skill: Skill) => {
    const Icon = iconMap[skill.icon] || Star;
    const canUnlock = canUnlockSkill(skillTree, skill.id).canUnlock;
    const cost = getSkillCost(skill);
    const isMaxed = skill.currentLevel >= skill.maxLevel;
    const isLocked = !skill.isUnlocked;

    return (
      <motion.div
        key={skill.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "relative p-3 rounded-lg border-2 cursor-pointer transition-all",
          tierColors[skill.tier],
          isLocked && "opacity-40 grayscale",
          isMaxed && "ring-2 ring-amber-400",
          canUnlock && !isMaxed && "hover:scale-105 hover:shadow-lg",
          selectedSkill?.id === skill.id && "ring-2 ring-primary"
        )}
        onClick={() => setSelectedSkill(skill)}
        onDoubleClick={() => !isMaxed && handleUnlockSkill(skill.id)}
      >
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <Lock className="w-6 h-6 text-white/70" />
          </div>
        )}

        {/* Skill content */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg",
            skill.currentLevel > 0 ? "bg-primary/20" : "bg-muted/50"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              skill.currentLevel > 0 ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{skill.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Niv. {skill.currentLevel}/{skill.maxLevel}
              </span>
              {!isMaxed && (
                <span className="text-xs text-amber-400">
                  {cost} pts
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Level progress */}
        <div className="mt-2">
          <Progress 
            value={(skill.currentLevel / skill.maxLevel) * 100} 
            className="h-1.5"
          />
        </div>

        {/* Specialization badge */}
        {skill.specialization && (
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header avec stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Arbre de Compétences
          </h2>
          <p className="text-sm text-muted-foreground">
            Développez vos capacités de dirigeant
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{skillTree.skillPoints}</div>
            <div className="text-xs text-muted-foreground">Points disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{progress.percentage}%</div>
            <div className="text-xs text-muted-foreground">Progression</div>
          </div>
        </div>
      </div>

      {/* Progression globale */}
      <div className="glass-effect rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progression globale</span>
          <span className="text-sm text-muted-foreground">
            {progress.unlockedSkills}/{progress.totalSkills} compétences • {progress.totalLevels}/{progress.maxLevels} niveaux
          </span>
        </div>
        <Progress value={progress.percentage} className="h-2" />
        
        {/* Tier progress */}
        <div className="grid grid-cols-5 gap-2 mt-3">
          {([1, 2, 3, 4, 5] as SkillTier[]).map(tier => (
            <div key={tier} className="text-center">
              <div className="text-xs font-medium">{tierNames[tier]}</div>
              <div className="text-xs text-muted-foreground">
                {progress.tierProgress[tier].unlocked}/{progress.tierProgress[tier].total}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Onglets de catégorie */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {(Object.keys(categoryConfig) as SkillCategory[]).map(category => {
          const config = categoryConfig[category];
          const Icon = config.icon;
          const catProgress = progress.categoryProgress[category];
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all",
                selectedCategory === category
                  ? `bg-gradient-to-r ${config.color} text-white`
                  : "bg-secondary/50 hover:bg-secondary"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{config.name}</span>
              <span className="text-xs opacity-70">
                {catProgress.unlocked}/{catProgress.total}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setShowSpecializations(!showSpecializations)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all",
            showSpecializations
              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
              : "bg-secondary/50 hover:bg-secondary"
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Spécialisations</span>
        </button>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Liste des compétences */}
        <div className="lg:col-span-2 space-y-4">
          {showSpecializations ? (
            // Spécialisations
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Voies de Spécialisation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SPECIALIZATION_DEFINITIONS.map(spec => {
                  const canActivate = canActivateSpecialization(skillTree, spec.id).canActivate;
                  const isActive = skillTree.activeSpecialization === spec.id;
                  const Icon = iconMap[spec.icon] || Star;
                  
                  return (
                    <motion.div
                      key={spec.id}
                      layout
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all",
                        isActive && "ring-2 ring-amber-400 border-amber-400",
                        canActivate && !isActive && "hover:scale-102 hover:shadow-lg border-green-400/50",
                        !canActivate && "opacity-50 border-gray-600"
                      )}
                      onClick={() => canActivate && handleActivateSpecialization(spec.id)}
                    >
                      <div className={cn(
                        "flex items-center gap-3 mb-2"
                      )}>
                        <div className={cn(
                          "p-2 rounded-lg bg-gradient-to-br",
                          spec.color
                        )}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{spec.name}</h4>
                          <p className="text-xs text-muted-foreground">{spec.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 mt-3">
                        <div className="text-xs font-medium text-muted-foreground">Bonus:</div>
                        {spec.bonuses.map((bonus, i) => (
                          <div key={i} className="text-xs text-green-400">
                            ✓ {bonus.description}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-xs font-medium text-amber-400">
                          🌟 {spec.ultimateAbility.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {spec.ultimateAbility.description}
                        </div>
                      </div>
                      
                      {isActive && (
                        <div className="mt-2 text-center">
                          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                            Spécialisation Active
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Compétences par tier
            <div className="space-y-4">
              {([1, 2, 3, 4, 5] as SkillTier[]).map(tier => {
                const tierSkills = categorySkills.filter(s => s.tier === tier);
                if (tierSkills.length === 0) return null;
                
                return (
                  <div key={tier} className="space-y-2">
                    <button
                      onClick={() => toggleTier(tier)}
                      className="flex items-center gap-2 w-full text-left"
                    >
                      {expandedTiers[tier] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span className={cn(
                        "font-semibold",
                        tier === 5 && "text-amber-400"
                      )}>
                        Tier {tier} - {tierNames[tier]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({tierSkills.filter(s => s.currentLevel > 0).length}/{tierSkills.length})
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedTiers[tier] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
                        >
                          {tierSkills.map(skill => renderSkillNode(skill))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel de détails */}
        <div className="space-y-4">
          {/* Détails de la compétence sélectionnée */}
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = iconMap[selectedSkill.icon] || Star;
                  return (
                    <div className={cn(
                      "p-3 rounded-lg",
                      selectedSkill.currentLevel > 0 ? "bg-primary/20" : "bg-muted/50"
                    )}>
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="font-bold">{selectedSkill.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs",
                      tierColors[selectedSkill.tier]
                    )}>
                      Tier {selectedSkill.tier}
                    </span>
                    <span className="text-muted-foreground">
                      {categoryConfig[selectedSkill.category].name}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {selectedSkill.description}
              </p>

              <div>
                <div className="text-sm font-medium mb-2">Niveau {selectedSkill.currentLevel}/{selectedSkill.maxLevel}</div>
                <Progress 
                  value={(selectedSkill.currentLevel / selectedSkill.maxLevel) * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Effets:</div>
                <div className="space-y-1">
                  {selectedSkill.effects.map((effect, i) => (
                    <div key={i} className="text-sm flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span>
                        {effect.description}
                        {effect.perLevel && selectedSkill.currentLevel > 0 && (
                          <span className="text-primary ml-1">
                            (actuel: {effect.value * selectedSkill.currentLevel}%)
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSkill.prerequisites.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Prérequis:</div>
                  <div className="space-y-1">
                    {selectedSkill.prerequisites.map(prereqId => {
                      const prereq = skillTree.skills[prereqId];
                      return (
                        <div key={prereqId} className="text-sm flex items-center gap-2">
                          <span className={prereq?.currentLevel > 0 ? "text-green-400" : "text-red-400"}>
                            {prereq?.currentLevel > 0 ? "✓" : "✗"}
                          </span>
                          <span>{prereq?.name || prereqId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedSkill.currentLevel < selectedSkill.maxLevel && (
                <button
                  onClick={() => handleUnlockSkill(selectedSkill.id)}
                  disabled={!canUnlockSkill(skillTree, selectedSkill.id).canUnlock}
                  className={cn(
                    "w-full py-2 rounded-lg font-medium transition-all",
                    canUnlockSkill(skillTree, selectedSkill.id).canUnlock
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {selectedSkill.currentLevel === 0 ? "Débloquer" : "Améliorer"} ({getSkillCost(selectedSkill)} pts)
                </button>
              )}
            </motion.div>
          )}

          {/* Bonus actifs */}
          <div className="glass-effect rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Bonus Actifs
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(bonuses).length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun bonus actif</p>
              ) : (
                Object.entries(bonuses).slice(0, 10).map(([type, value]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">
                      {type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-green-400">+{value}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions de respec */}
          <div className="glass-effect rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Réinitialisation
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleRespecCategory(selectedCategory)}
                className="w-full py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg text-sm transition-colors"
              >
                Réinitialiser {categoryConfig[selectedCategory].name} (75% remboursé)
              </button>
              <button
                onClick={handleFullRespec}
                className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
              >
                Réinitialisation Complète (50% remboursé)
              </button>
            </div>
          </div>

          {/* Jalons */}
          <div className="glass-effect rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Jalons
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {skillTree.milestones.map(milestone => (
                <div 
                  key={milestone.id}
                  className={cn(
                    "p-2 rounded-lg border",
                    milestone.isCompleted 
                      ? "border-green-400/30 bg-green-500/10" 
                      : "border-white/10 bg-white/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-sm font-medium",
                      milestone.isCompleted && "text-green-400"
                    )}>
                      {milestone.name}
                    </span>
                    {milestone.isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
