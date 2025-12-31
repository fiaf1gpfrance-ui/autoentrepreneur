import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GripVertical, X, Minimize2, Maximize2 } from "lucide-react";

interface DesktopWidgetProps {
  id: string;
  title: string;
  children: ReactNode;
  initialPosition: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export function DesktopWidget({
  id,
  title,
  children,
  initialPosition,
  initialSize = { width: 280, height: 200 },
  onClose,
  onPositionChange,
  isMinimized = false,
  onToggleMinimize,
}: DesktopWidgetProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onPositionChange(position);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, position, onPositionChange]);

  return (
    <div
      ref={widgetRef}
      className={cn(
        "absolute z-30 rounded-xl overflow-hidden glass-effect border border-white/20 shadow-2xl transition-all duration-200",
        isDragging && "opacity-90 scale-[1.02] cursor-grabbing",
        isMinimized ? "h-10" : ""
      )}
      style={{
        left: position.x,
        top: position.y,
        width: initialSize.width,
        height: isMinimized ? 40 : initialSize.height,
      }}
    >
      {/* Widget Header */}
      <div
        className={cn(
          "flex items-center justify-between h-10 px-3 bg-gradient-to-r from-white/10 to-transparent cursor-grab",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground/80">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {onToggleMinimize && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMinimize();
              }}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-3 h-3 text-muted-foreground" />
              ) : (
                <Minimize2 className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/50 transition-colors"
          >
            <X className="w-3 h-3 text-muted-foreground hover:text-white" />
          </button>
        </div>
      </div>

      {/* Widget Content */}
      {!isMinimized && (
        <div className="p-3 overflow-auto" style={{ height: initialSize.height - 40 }}>
          {children}
        </div>
      )}
    </div>
  );
}
