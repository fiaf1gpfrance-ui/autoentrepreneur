import { Achievement, Mission } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { Trophy, Target, Star, Lock, CheckCircle2, Clock, Gift, Medal, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementsPanelProps {
  achievements: Achievement[];
  missions: Mission[];
  onClaimMissionReward?: (missionId: string) => void;
}

const categoryIcons: Record<string, any> = {
  finance: Trophy,
  rh: Target,
  production: Star,
  commercial: Medal,
  legal: Crown,
  international: Gift,
};

const categoryColors: Record<string, string> = {
  finance: "text-yellow-500",
  rh: "text-blue-500",
  production: "text-green-500",
  commercial: "text-purple-500",
  legal: "text-orange-500",
  international: "text-cyan-500",
};

export function AchievementsPanel({ achievements, missions, onClaimMissionReward }: AchievementsPanelProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completedMissions = missions.filter(m => m.completed).length;
  const activeMissions = missions.filter(m => !m.completed && !m.failed);
  
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const category = achievement.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="game-panel text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{unlockedCount}/{totalCount}</p>
          <p className="text-xs text-muted-foreground">Achievements</p>
        </div>
        <div className="game-panel text-center">
          <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{completedMissions}</p>
          <p className="text-xs text-muted-foreground">Missions Complétées</p>
        </div>
        <div className="game-panel text-center">
          <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{activeMissions.length}</p>
          <p className="text-xs text-muted-foreground">Missions Actives</p>
        </div>
        <div className="game-panel text-center">
          <Gift className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{Math.round((unlockedCount / totalCount) * 100)}%</p>
          <p className="text-xs text-muted-foreground">Complétion</p>
        </div>
      </div>

      {/* Active Missions */}
      <div className="game-panel">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Missions en Cours
        </h3>
        {activeMissions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Aucune mission active</p>
        ) : (
          <div className="space-y-3">
            {activeMissions.slice(0, 5).map(mission => (
              <div key={mission.id} className="bg-secondary/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{mission.title}</h4>
                    <p className="text-xs text-muted-foreground">{mission.description}</p>
                  </div>
                  {mission.deadline && (
                    <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">
                      <Clock className="w-3 h-3 inline mr-1" />
                      J-{mission.deadline}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {mission.objectives.map(obj => (
                    <div key={obj.id} className="flex items-center gap-2">
                      {obj.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between text-xs">
                          <span className={obj.completed ? "line-through text-muted-foreground" : ""}>
                            {obj.description}
                          </span>
                          <span className="font-mono">{obj.current}/{obj.target}</span>
                        </div>
                        <div className="h-1 bg-secondary rounded-full mt-1">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${Math.min(100, (obj.current / obj.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-border flex justify-between items-center">
                  <div className="flex gap-2 text-xs">
                    {mission.reward.treasury && (
                      <span className="text-success">+{formatCurrency(mission.reward.treasury)}</span>
                    )}
                    {mission.reward.credibility && (
                      <span className="text-primary">+{mission.reward.credibility} crédibilité</span>
                    )}
                  </div>
                  {mission.completed && onClaimMissionReward && (
                    <button 
                      onClick={() => onClaimMissionReward(mission.id)}
                      className="btn-game-primary text-xs px-3 py-1"
                    >
                      Réclamer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements by Category */}
      <div className="game-panel">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Trophées
        </h3>
        <div className="space-y-6">
          {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
            const CategoryIcon = categoryIcons[category] || Trophy;
            const unlocked = categoryAchievements.filter(a => a.unlocked).length;
            
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <CategoryIcon className={cn("w-5 h-5", categoryColors[category])} />
                  <span className="font-medium capitalize">{category}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {unlocked}/{categoryAchievements.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {categoryAchievements.map(achievement => (
                    <div 
                      key={achievement.id}
                      className={cn(
                        "relative p-3 rounded-lg border text-center transition-all",
                        achievement.unlocked 
                          ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30" 
                          : "bg-secondary/30 border-border opacity-60"
                      )}
                    >
                      {!achievement.unlocked && (
                        <Lock className="absolute top-2 right-2 w-3 h-3 text-muted-foreground" />
                      )}
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <p className="text-xs font-medium truncate">{achievement.name}</p>
                      {achievement.unlocked ? (
                        <CheckCircle2 className="w-4 h-4 text-success mx-auto mt-1" />
                      ) : achievement.progress !== undefined && achievement.target ? (
                        <div className="mt-2">
                          <div className="h-1 bg-secondary rounded-full">
                            <div 
                              className="h-full bg-primary/50 rounded-full"
                              style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {Math.round((achievement.progress / achievement.target) * 100)}%
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
