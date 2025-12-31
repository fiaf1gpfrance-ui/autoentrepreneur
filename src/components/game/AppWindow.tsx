import { cn } from "@/lib/utils";
import { X, Minus, Square, LucideIcon } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

interface AppWindowProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  isMaximized?: boolean;
  color?: string;
}

export function AppWindow({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  onClose,
  onMinimize,
  isMaximized = true,
  color = "text-primary"
}: AppWindowProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Trigger open animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleMinimize = () => {
    if (onMinimize) {
      setIsClosing(true);
      setTimeout(() => {
        onMinimize();
      }, 300);
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col rounded-xl overflow-hidden glass-effect windows-shadow",
        isMaximized ? "w-full h-full" : "w-[900px] h-[700px]",
        isVisible && !isClosing && "animate-window-open",
        isClosing && "animate-window-close"
      )}
    >
      {/* Windows-style Title Bar */}
      <div className="flex items-center justify-between h-10 bg-gradient-to-b from-white/10 to-transparent border-b border-white/5 select-none">
        {/* Left side - Icon and Title */}
        <div className="flex items-center gap-3 px-3">
          <div className={cn(
            "w-6 h-6 rounded flex items-center justify-center",
            "bg-gradient-to-br from-white/10 to-white/5"
          )}>
            <Icon className={cn("w-4 h-4", color)} />
          </div>
          <span className="font-medium text-sm text-foreground/90">{title}</span>
        </div>
        
        {/* Right side - Window Controls */}
        <div className="flex items-center h-full">
          {/* Minimize */}
          <button 
            onClick={handleMinimize}
            className="h-full w-12 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Minus className="w-4 h-4 text-foreground/70" />
          </button>
          
          {/* Maximize */}
          <button className="h-full w-12 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Square className="w-3 h-3 text-foreground/70" />
          </button>
          
          {/* Close */}
          <button 
            onClick={handleClose}
            className="h-full w-12 flex items-center justify-center hover:bg-destructive transition-colors group"
          >
            <X className="w-4 h-4 text-foreground/70 group-hover:text-white" />
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 overflow-auto p-4 bg-background/50">
        {children}
      </div>
    </div>
  );
}
