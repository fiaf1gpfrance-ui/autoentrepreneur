import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DesktopIconProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  color?: string;
}

export function DesktopIcon({ id, label, icon: Icon, isActive, onClick, color = "text-primary" }: DesktopIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-200 group w-20",
        "hover:bg-white/10 hover:backdrop-blur-sm",
        isActive && "bg-white/15 ring-1 ring-white/20"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
        "bg-gradient-to-br from-card to-card/80 border border-border/50"
      )}>
        <Icon className={cn("w-6 h-6", color)} />
      </div>
      <span className="text-[10px] font-medium text-center leading-tight text-foreground/80 truncate w-full">
        {label}
      </span>
    </button>
  );
}
