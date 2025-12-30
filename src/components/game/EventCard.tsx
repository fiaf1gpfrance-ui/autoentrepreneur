import { GameEvent } from "@/types/game";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, XCircle, X } from "lucide-react";

interface EventCardProps {
  event: GameEvent;
  onDismiss: (id: string) => void;
}

export function EventCard({ event, onDismiss }: EventCardProps) {
  const severityConfig = {
    info: {
      icon: Info,
      borderColor: "border-l-primary",
      bgColor: "bg-primary/5",
    },
    warning: {
      icon: AlertTriangle,
      borderColor: "border-l-warning",
      bgColor: "bg-warning/5",
    },
    critical: {
      icon: XCircle,
      borderColor: "border-l-destructive",
      bgColor: "bg-destructive/5",
    },
  };

  const config = severityConfig[event.severity];
  const Icon = config.icon;

  return (
    <div className={cn("event-card", config.borderColor, config.bgColor)}>
      <div className="flex items-start justify-between gap-3">
        <Icon className={cn(
          "w-5 h-5 shrink-0 mt-0.5",
          event.severity === 'info' && "text-primary",
          event.severity === 'warning' && "text-warning",
          event.severity === 'critical' && "text-destructive"
        )} />
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-sm text-foreground">
            {event.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {event.description}
          </p>
          {event.effects && Object.keys(event.effects).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {event.effects.treasury && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  event.effects.treasury > 0 
                    ? "bg-success/20 text-success" 
                    : "bg-destructive/20 text-destructive"
                )}>
                  {event.effects.treasury > 0 ? '+' : ''}{event.effects.treasury}€
                </span>
              )}
              {event.effects.credibility && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  event.effects.credibility > 0 
                    ? "bg-primary/20 text-primary" 
                    : "bg-destructive/20 text-destructive"
                )}>
                  Créd. {event.effects.credibility > 0 ? '+' : ''}{event.effects.credibility}
                </span>
              )}
              {event.effects.moral && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  event.effects.moral > 0 
                    ? "bg-purple-500/20 text-purple-400" 
                    : "bg-destructive/20 text-destructive"
                )}>
                  Moral {event.effects.moral > 0 ? '+' : ''}{event.effects.moral}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => onDismiss(event.id)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
