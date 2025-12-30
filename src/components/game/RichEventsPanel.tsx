import { useState } from "react";
import { Company, GameState } from "@/types/game";
import { 
  RichEvent, 
  EconomicNews,
  EVENT_TEMPLATES,
} from "@/types/events";
import { 
  checkMilestones,
  getEventSeverityBg,
  getEventSeverityColor,
} from "@/utils/richEventsEngine";
import { formatCurrency } from "@/utils/gameEngine";
import { 
  AlertTriangle, 
  Zap, 
  Gift,
  Clock,
  ChevronRight,
  Newspaper,
  Trophy,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RichEventsPanelProps {
  company: Company;
  gameState: GameState;
  activeEvents: RichEvent[];
  economicNews: EconomicNews[];
  onEventChoice: (eventId: string, choiceId: string, effects: any) => void;
  onDismissEvent: (eventId: string) => void;
}

export function RichEventsPanel({ 
  company, 
  gameState,
  activeEvents,
  economicNews,
  onEventChoice,
  onDismissEvent,
}: RichEventsPanelProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showNews, setShowNews] = useState(true);

  const handleChoice = (eventId: string, choiceId: string) => {
    const event = activeEvents.find(e => e.id === eventId);
    if (!event || !event.choices) return;

    const choice = event.choices.find(c => c.id === choiceId);
    if (!choice) return;

    // Check requirements
    if (choice.requirements) {
      if (choice.requirements.treasury && company.treasury < choice.requirements.treasury) {
        toast.error(`Trésorerie insuffisante (${formatCurrency(choice.requirements.treasury)} requis)`);
        return;
      }
      if (choice.requirements.credibility && company.credibility < choice.requirements.credibility) {
        toast.error(`Crédibilité insuffisante (${choice.requirements.credibility} requis)`);
        return;
      }
      if (choice.requirements.employees && company.employees.length < choice.requirements.employees) {
        toast.error(`Nombre d'employés insuffisant (${choice.requirements.employees} requis)`);
        return;
      }
    }

    onEventChoice(eventId, choiceId, choice.effects);
    toast.success('Choix effectué !');
  };

  const getSeverityIcon = (severity: RichEvent['severity']) => {
    switch (severity) {
      case 'positive': return Sparkles;
      case 'neutral': return Info;
      case 'negative': return AlertTriangle;
      case 'critical': return AlertCircle;
      default: return Info;
    }
  };

  const milestone = checkMilestones(company, gameState);

  return (
    <div className="space-y-6">
      {/* Milestones */}
      {milestone && (
        <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/30 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-500">{milestone.title}</h4>
              <p className="text-sm text-muted-foreground">{milestone.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Événements actifs
          </h3>
          
          <div className="space-y-3">
            {activeEvents.map(event => {
              const SeverityIcon = getSeverityIcon(event.severity);
              const bgStyle = getEventSeverityBg(event.severity);
              const textStyle = getEventSeverityColor(event.severity);
              const isSelected = selectedEventId === event.id;
              const isExpired = event.expiresAt && gameState.day > event.expiresAt;
              
              return (
                <div
                  key={event.id}
                  className={cn(
                    "game-panel p-4 transition-all cursor-pointer border",
                    bgStyle,
                    isSelected && "ring-2 ring-primary",
                    isExpired && "opacity-50"
                  )}
                  onClick={() => setSelectedEventId(isSelected ? null : event.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center shrink-0">
                      <span className="text-xl">{event.icon}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold truncate">{event.title}</h4>
                        {event.expiresAt && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.expiresAt - gameState.day} jours
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

                      {/* Immediate effects display */}
                      {event.immediateEffects && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {event.immediateEffects.treasury && (
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              event.immediateEffects.treasury > 0 
                                ? "bg-success/20 text-success" 
                                : "bg-destructive/20 text-destructive"
                            )}>
                              {event.immediateEffects.treasury > 0 ? '+' : ''}
                              {formatCurrency(event.immediateEffects.treasury)}
                            </span>
                          )}
                          {event.immediateEffects.credibility && (
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              event.immediateEffects.credibility > 0 
                                ? "bg-success/20 text-success" 
                                : "bg-destructive/20 text-destructive"
                            )}>
                              Crédibilité {event.immediateEffects.credibility > 0 ? '+' : ''}
                              {event.immediateEffects.credibility}
                            </span>
                          )}
                          {event.immediateEffects.moralAll && (
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              event.immediateEffects.moralAll > 0 
                                ? "bg-success/20 text-success" 
                                : "bg-destructive/20 text-destructive"
                            )}>
                              Moral {event.immediateEffects.moralAll > 0 ? '+' : ''}
                              {event.immediateEffects.moralAll}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Choices */}
                      {isSelected && event.choices && event.choices.length > 0 && (
                        <div className="space-y-2 mt-4 pt-4 border-t border-border">
                          <h5 className="text-sm font-semibold mb-2">Vos options:</h5>
                          {event.choices.map(choice => {
                            const meetsRequirements = !choice.requirements || (
                              (!choice.requirements.treasury || company.treasury >= choice.requirements.treasury) &&
                              (!choice.requirements.credibility || company.credibility >= choice.requirements.credibility) &&
                              (!choice.requirements.employees || company.employees.length >= choice.requirements.employees)
                            );
                            
                            return (
                              <button
                                key={choice.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChoice(event.id, choice.id);
                                }}
                                disabled={!meetsRequirements || isExpired}
                                className={cn(
                                  "w-full text-left p-3 rounded-lg border transition-all",
                                  meetsRequirements
                                    ? "border-border hover:border-primary hover:bg-primary/5"
                                    : "border-border/50 opacity-60 cursor-not-allowed"
                                )}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">{choice.label}</span>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                                {choice.description && (
                                  <p className="text-xs text-muted-foreground mb-2">{choice.description}</p>
                                )}
                                <div className="flex flex-wrap gap-1">
                                  {choice.effects.treasury && (
                                    <span className={cn(
                                      "text-xs px-1.5 py-0.5 rounded",
                                      choice.effects.treasury > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                                    )}>
                                      {choice.effects.treasury > 0 ? '+' : ''}{formatCurrency(choice.effects.treasury)}
                                    </span>
                                  )}
                                  {choice.effects.credibility && (
                                    <span className={cn(
                                      "text-xs px-1.5 py-0.5 rounded",
                                      choice.effects.credibility > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                                    )}>
                                      Créd. {choice.effects.credibility > 0 ? '+' : ''}{choice.effects.credibility}
                                    </span>
                                  )}
                                  {choice.effects.moralAll && (
                                    <span className={cn(
                                      "text-xs px-1.5 py-0.5 rounded",
                                      choice.effects.moralAll > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                                    )}>
                                      Moral {choice.effects.moralAll > 0 ? '+' : ''}{choice.effects.moralAll}
                                    </span>
                                  )}
                                </div>
                                {!meetsRequirements && choice.requirements && (
                                  <div className="text-xs text-destructive mt-1">
                                    Requis: {choice.requirements.treasury && `${formatCurrency(choice.requirements.treasury)} `}
                                    {choice.requirements.credibility && `${choice.requirements.credibility} crédibilité `}
                                    {choice.requirements.employees && `${choice.requirements.employees} employés`}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Dismiss button for events without choices */}
                      {(!event.choices || event.choices.length === 0) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDismissEvent(event.id);
                          }}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Fermer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Economic News */}
      {economicNews.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setShowNews(!showNews)}
            className="w-full flex items-center justify-between font-display font-semibold"
          >
            <span className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" />
              Actualités économiques
            </span>
            <ChevronRight className={cn(
              "w-5 h-5 transition-transform",
              showNews && "rotate-90"
            )} />
          </button>
          
          {showNews && (
            <div className="space-y-2">
              {economicNews.slice(0, 5).map(news => (
                <div
                  key={news.id}
                  className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    news.sentiment === 'bullish' ? "bg-success/20" :
                    news.sentiment === 'bearish' ? "bg-destructive/20" :
                    "bg-muted"
                  )}>
                    {news.sentiment === 'bullish' ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : news.sentiment === 'bearish' ? (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    ) : (
                      <Info className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm">{news.headline}</h5>
                    <p className="text-xs text-muted-foreground">{news.content}</p>
                    <span className="text-xs text-muted-foreground">{news.source} - Jour {news.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No events */}
      {activeEvents.length === 0 && !milestone && (
        <div className="text-center py-8 text-muted-foreground">
          <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun événement actif</p>
          <p className="text-sm mt-2">Les événements apparaîtront au fil du jeu</p>
        </div>
      )}
    </div>
  );
}
