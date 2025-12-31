import { cn } from "@/lib/utils";
import { X, Minus, Maximize2, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface AppWindowProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  onClose: () => void;
  isMaximized?: boolean;
  color?: string;
}

export function AppWindow({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  onClose,
  isMaximized = true,
  color = "text-primary"
}: AppWindowProps) {
  return (
    <div className={cn(
      "flex flex-col bg-card/95 backdrop-blur-xl rounded-xl border border-border/50 shadow-2xl overflow-hidden animate-fade-in",
      isMaximized ? "w-full h-full" : "w-[800px] h-[600px]"
    )}>
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "bg-gradient-to-br from-primary/20 to-primary/10"
          )}>
            <Icon className={cn("w-4 h-4", color)} />
          </div>
          <span className="font-display font-semibold text-sm">{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors">
            <Minus className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors">
            <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-destructive/20 transition-colors group"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive" />
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}
