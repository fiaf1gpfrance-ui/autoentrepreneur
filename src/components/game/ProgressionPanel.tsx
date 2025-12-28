import { useState } from "react";
import { 
  Trophy, Star, Target, Flame, TrendingUp, Award, 
  Lock, Check, ChevronRight, Zap, Crown, Gift
} from "lucide-react";
import { 
  initializeSkillTrees, 
  unlockSkill, 
  getActiveEffects,
  getPrestigeLevels,
  getPrestigeLevel,
  calculatePrestigePoints,
  generateDailyQuests,
  generateWeeklyQuests,
  generateStoryQuests,
} from "@/utils/progressionEngine";
import { SkillTree, Skill, Quest, PrestigeLevel, PlayerStats, SkillTreeCategory } from "@/types/advancedFeatures";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProgressionPanelProps {
  day: number;
  stats: Partial<PlayerStats>;
}

const categoryIcons: Record<SkillTreeCategory, typeof Trophy> = {
  management: Award,
  finance: TrendingUp,
  marketing: Target,
  operations: Zap,
  technology: Star,
  hr: Trophy,
  international: Crown,
};

const categoryColors: Record<SkillTreeCategory, string> = {
  management: "from-blue-500 to-blue-600",
  finance: "from-green-500 to-green-600",
  marketing: "from-pink-500 to-pink-600",
  operations: "from-orange-500 to-orange-600",
  technology: "from-purple-500 to-purple-600",
  hr: "from-cyan-500 to-cyan-600",
  international: "from-amber-500 to-amber-600",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-success/20 text-success",
  medium: "bg-warning/20 text-warning",
  hard: "bg-destructive/20 text-destructive",
  legendary: "bg-purple-500/20 text-purple-400",
};

export function ProgressionPanel({ day, stats }: ProgressionPanelProps) {
  const [skillTrees, setSkillTrees] = useState<SkillTree[]>(() => initializeSkillTrees());
  const [selectedTree, setSelectedTree] = useState<SkillTreeCategory>('management');
  const [activeTab, setActiveTab] = useState<'skills' | 'quests' | 'prestige'>('skills');
  const [skillPoints, setSkillPoints] = useState(10);
  const [prestigePoints, setPrestigePoints] = useState(0);
  const [xp, setXp] = useState(0);
  
  const prestigeLevels = getPrestigeLevels();
  const currentPrestige = getPrestigeLevel(prestigePoints, prestigeLevels);
  const nextPrestige = prestigeLevels.find(l => l.pointsRequired > prestigePoints);
  
  const dailyQuests = generateDailyQuests(day);
  const weeklyQuests = generateWeeklyQuests(Math.floor(day / 7));
  const storyQuests = generateStoryQuests();
  
  const activeEffects = getActiveEffects(skillTrees);
  const currentTree = skillTrees.find(t => t.category === selectedTree);

  const handleUnlockSkill = (treeId: string, skillId: string) => {
    const result = unlockSkill(skillTrees, treeId, skillId, skillPoints);
    if (result.success) {
      setSkillTrees(result.trees);
      setSkillPoints(prev => prev - result.pointsUsed);
      toast.success("Compétence débloquée !");
    } else {
      toast.error("Impossible de débloquer cette compétence");
    }
  };

  const getTotalUnlocked = () => {
    return skillTrees.reduce((sum, t) => sum + t.unlockedSkills, 0);
  };

  const renderSkillNode = (skill: Skill, tree: SkillTree) => {
    const prereqsMet = skill.prerequisites.every(p => 
      tree.skills.find(s => s.id === p)?.unlocked
    );
    const canUnlock = !skill.unlocked && prereqsMet && skillPoints >= skill.cost;
    
    return (
      <div
        key={skill.id}
        onClick={() => canUnlock && handleUnlockSkill(tree.id, skill.id)}
        className={cn(
          "relative p-3 rounded-xl border-2 transition-all cursor-pointer",
          skill.unlocked ? "bg-primary/20 border-primary" : 
          canUnlock ? "bg-secondary border-success hover:border-success/80 hover:scale-105" :
          prereqsMet ? "bg-secondary border-border hover:border-primary/50" : 
          "bg-muted border-border opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{skill.icon}</span>
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-sm truncate">{skill.name}</h5>
            <p className="text-[10px] text-muted-foreground line-clamp-1">{skill.description}</p>
          </div>
          {skill.unlocked ? (
            <Check className="w-5 h-5 text-success flex-shrink-0" />
          ) : (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-bold">{skill.cost}</span>
            </div>
          )}
        </div>
        {!prereqsMet && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
      </div>
    );
  };

  const renderQuest = (quest: Quest) => (
    <div key={quest.id} className="game-panel border border-border">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-sm">{quest.title}</h4>
        </div>
        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", difficultyColors[quest.difficulty])}>
          {quest.difficulty.toUpperCase()}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{quest.description}</p>
      
      {/* Progress */}
      <div className="space-y-2 mb-3">
        {quest.objectives.map(obj => (
          <div key={obj.id} className="flex items-center gap-2">
            <div className="flex-1 bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (obj.current / obj.target) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {obj.current}/{obj.target}
            </span>
          </div>
        ))}
      </div>
      
      {/* Rewards */}
      <div className="flex items-center gap-2 text-xs border-t border-border pt-2">
        <span className="text-muted-foreground">Récompenses:</span>
        {quest.rewards.xp && <span className="text-amber-400">+{quest.rewards.xp} XP</span>}
        {quest.rewards.money && <span className="text-success">+{quest.rewards.money.toLocaleString()}€</span>}
        {quest.rewards.skillPoints && <span className="text-primary">+{quest.rewards.skillPoints} ⭐</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="game-panel text-center">
          <Star className="w-6 h-6 mx-auto text-amber-400 mb-1" />
          <p className="text-2xl font-bold">{skillPoints}</p>
          <p className="text-xs text-muted-foreground">Points Compétence</p>
        </div>
        <div className="game-panel text-center">
          <Zap className="w-6 h-6 mx-auto text-purple-400 mb-1" />
          <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Expérience</p>
        </div>
        <div className="game-panel text-center">
          <Crown className="w-6 h-6 mx-auto text-primary mb-1" />
          <p className="text-2xl font-bold">{currentPrestige.icon} {currentPrestige.level}</p>
          <p className="text-xs text-muted-foreground">{currentPrestige.name}</p>
        </div>
        <div className="game-panel text-center">
          <Trophy className="w-6 h-6 mx-auto text-success mb-1" />
          <p className="text-2xl font-bold">{getTotalUnlocked()}</p>
          <p className="text-xs text-muted-foreground">Compétences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {[
          { id: 'skills', label: 'Arbres de Compétences', icon: Star },
          { id: 'quests', label: 'Quêtes', icon: Target },
          { id: 'prestige', label: 'Prestige', icon: Crown },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skill Trees Tab */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Tree Selector */}
          <div className="col-span-12 md:col-span-3 space-y-2">
            {skillTrees.map(tree => {
              const Icon = categoryIcons[tree.category];
              return (
                <button
                  key={tree.id}
                  onClick={() => setSelectedTree(tree.category)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                    selectedTree === tree.category ? 
                      `bg-gradient-to-r ${categoryColors[tree.category]} text-white` : 
                      "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">{tree.name}</p>
                    <p className="text-xs opacity-80">{tree.unlockedSkills}/{tree.skills.length}</p>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Skill Grid */}
          <div className="col-span-12 md:col-span-9">
            {currentTree && (
              <div className="game-panel">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  {(() => { const Icon = categoryIcons[currentTree.category]; return <Icon className="w-5 h-5" />; })()}
                  {currentTree.name}
                </h3>
                
                {/* Skills by Tier */}
                {[1, 2, 3, 4].map(tier => {
                  const tierSkills = currentTree.skills.filter(s => s.tier === tier);
                  if (tierSkills.length === 0) return null;
                  
                  return (
                    <div key={tier} className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Niveau {tier}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {tierSkills.map(skill => renderSkillNode(skill, currentTree))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quests Tab */}
      {activeTab === 'quests' && (
        <div className="space-y-6">
          {/* Daily Quests */}
          <div>
            <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Quêtes Journalières
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyQuests.map(renderQuest)}
            </div>
          </div>

          {/* Weekly Quests */}
          <div>
            <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Quêtes Hebdomadaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyQuests.map(renderQuest)}
            </div>
          </div>

          {/* Story Quests */}
          <div>
            <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Quêtes Histoire
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {storyQuests.slice(0, 8).map(renderQuest)}
            </div>
          </div>
        </div>
      )}

      {/* Prestige Tab */}
      {activeTab === 'prestige' && (
        <div className="space-y-6">
          {/* Current Prestige */}
          <div className="game-panel text-center py-8">
            <div className="text-6xl mb-4">{currentPrestige.icon}</div>
            <h3 className="font-display font-bold text-2xl mb-2">{currentPrestige.name}</h3>
            <p className="text-muted-foreground mb-4">Niveau de Prestige {currentPrestige.level}</p>
            
            {nextPrestige && (
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-1">
                  <span>{prestigePoints.toLocaleString()} pts</span>
                  <span>{nextPrestige.pointsRequired.toLocaleString()} pts</span>
                </div>
                <div className="bg-secondary rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (prestigePoints / nextPrestige.pointsRequired) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {(nextPrestige.pointsRequired - prestigePoints).toLocaleString()} points jusqu'à {nextPrestige.name}
                </p>
              </div>
            )}
          </div>

          {/* Prestige Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {prestigeLevels.map(level => {
              const isUnlocked = prestigePoints >= level.pointsRequired;
              const isCurrent = level.level === currentPrestige.level;
              
              return (
                <div
                  key={level.level}
                  className={cn(
                    "game-panel border-2 transition-all",
                    isCurrent ? "border-primary ring-2 ring-primary/20" :
                    isUnlocked ? "border-success/50" : "border-border opacity-60"
                  )}
                >
                  <div className="text-center mb-3">
                    <span className="text-4xl">{level.icon}</span>
                    <h4 className="font-bold mt-2">{level.name}</h4>
                    <p className="text-xs text-muted-foreground">{level.pointsRequired.toLocaleString()} pts</p>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    {level.permanentBonuses.map((bonus, i) => (
                      <div key={i} className="flex items-center gap-2 text-success">
                        <Gift className="w-3 h-3" />
                        {bonus.description}
                      </div>
                    ))}
                    {level.unlocks.map((unlock, i) => (
                      <div key={i} className="flex items-center gap-2 text-primary">
                        <Star className="w-3 h-3" />
                        {unlock}
                      </div>
                    ))}
                  </div>
                  
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Bonuses */}
          {activeEffects.length > 0 && (
            <div className="game-panel">
              <h3 className="font-display font-semibold mb-4">Bonus Actifs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {activeEffects.map((effect, i) => (
                  <div key={i} className="bg-success/10 border border-success/30 rounded-lg p-3 text-center">
                    <Zap className="w-5 h-5 mx-auto text-success mb-1" />
                    <p className="text-xs font-medium">{effect.type.replace(/_/g, ' ')}</p>
                    <p className="text-sm font-bold text-success">+{effect.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
