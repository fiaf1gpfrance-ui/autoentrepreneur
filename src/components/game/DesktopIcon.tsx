import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface DesktopIconProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  color?: string;
}

export function DesktopIcon({ id, label, icon: Icon, isActive, onClick, color = "text-primary" }: DesktopIconProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg transition-all duration-200 group w-[72px]",
        "hover:bg-white/10 hover:backdrop-blur-sm active:scale-95",
        isActive && "bg-white/15 ring-1 ring-primary/50 shadow-lg shadow-primary/20"
      )}
    >
      <div className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
        "bg-gradient-to-br from-secondary/80 to-secondary/40 border border-white/10",
        "group-hover:scale-110 group-hover:shadow-lg group-hover:border-white/20",
        "group-active:scale-95",
        isActive && "shadow-lg shadow-primary/30 border-primary/30"
      )}>
        <Icon className={cn(
          "w-5 h-5 transition-all duration-200",
          color,
          "group-hover:drop-shadow-[0_0_8px_currentColor]"
        )} />
      </div>
      <span className={cn(
        "text-[10px] font-medium text-center leading-tight truncate w-full px-1",
        "text-foreground/70 group-hover:text-foreground",
        isActive && "text-foreground"
      )}>
        {label}
      </span>
    </button>
  );
}
