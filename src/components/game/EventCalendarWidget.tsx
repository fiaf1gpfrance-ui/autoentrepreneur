import { Calendar, AlertCircle, Bell, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameEvent {
  id: string;
  title: string;
  day: number;
  type: 'tax' | 'meeting' | 'deadline' | 'event';
  completed?: boolean;
}

interface EventCalendarWidgetProps {
  currentDay: number;
  currentMonth: number;
  events: GameEvent[];
}

export function EventCalendarWidget({ currentDay, currentMonth, events }: EventCalendarWidgetProps) {
  const daysInMonth = 30;
  const weeks: number[][] = [];
  
  for (let i = 0; i < daysInMonth; i += 7) {
    weeks.push(Array.from({ length: 7 }, (_, j) => i + j + 1).filter(d => d <= daysInMonth));
  }

  const getEventForDay = (day: number) => events.find(e => e.day === day);
  
  const getEventColor = (type: string) => {
    switch (type) {
      case 'tax': return 'bg-destructive/80';
      case 'meeting': return 'bg-primary/80';
      case 'deadline': return 'bg-warning/80';
      case 'event': return 'bg-success/80';
      default: return 'bg-muted';
    }
  };

  const upcomingEvents = events
    .filter(e => e.day >= currentDay && !e.completed)
    .sort((a, b) => a.day - b.day)
    .slice(0, 3);

  return (
    <div className="space-y-3">
      {/* Mini Calendar */}
      <div className="bg-background/30 rounded-lg p-2">
        <div className="grid grid-cols-7 gap-0.5 text-[10px] text-muted-foreground mb-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <div key={i} className="text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {weeks.flat().map(day => {
            const event = getEventForDay(day);
            return (
              <div
                key={day}
                className={cn(
                  "w-5 h-5 flex items-center justify-center rounded text-[10px] transition-all",
                  day === currentDay && "bg-primary text-primary-foreground font-bold ring-1 ring-primary",
                  day < currentDay && "text-muted-foreground/50",
                  event && !event.completed && day !== currentDay && getEventColor(event.type)
                )}
                title={event?.title}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-1.5">
        <div className="text-xs font-medium text-foreground/80 flex items-center gap-1">
          <Bell className="w-3 h-3" />
          Prochains événements
        </div>
        {upcomingEvents.length === 0 ? (
          <div className="text-[10px] text-muted-foreground text-center py-2">
            Aucun événement à venir
          </div>
        ) : (
          upcomingEvents.map(event => (
            <div
              key={event.id}
              className="flex items-center gap-2 bg-background/30 rounded px-2 py-1.5"
            >
              <div className={cn("w-1.5 h-1.5 rounded-full", getEventColor(event.type))} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{event.title}</div>
                <div className="text-[9px] text-muted-foreground">Jour {event.day}</div>
              </div>
              {event.completed ? (
                <CheckCircle2 className="w-3 h-3 text-success" />
              ) : (
                <AlertCircle className="w-3 h-3 text-warning" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
