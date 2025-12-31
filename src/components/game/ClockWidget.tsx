import { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";

interface ClockWidgetProps {
  gameDay: number;
  gameMonth: number;
  gameYear: number;
  isPaused: boolean;
}

export function ClockWidget({ gameDay, gameMonth, gameYear, isPaused }: ClockWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const dayOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const realDayOfWeek = dayOfWeek[currentTime.getDay()];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Real Time */}
      <div className="text-center">
        <p className="text-3xl font-bold font-display tracking-wider text-foreground">
          {formatTime(currentTime)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{realDayOfWeek}</p>
      </div>

      <div className="h-px bg-white/10" />

      {/* Game Time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Jour de jeu</span>
        </div>
        <div className="text-right">
          <p className="font-semibold text-sm">{gameDay}</p>
          <p className="text-xs text-muted-foreground">
            {monthNames[gameMonth - 1]} {gameYear}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-center gap-2 mt-1">
        <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-warning animate-pulse' : 'bg-success'}`} />
        <span className="text-xs text-muted-foreground">
          {isPaused ? 'En pause' : 'En cours'}
        </span>
      </div>
    </div>
  );
}
