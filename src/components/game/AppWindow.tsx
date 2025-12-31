import { cn } from "@/lib/utils";
import { X, Minus, Square, Copy, LucideIcon } from "lucide-react";
import { ReactNode, useState, useEffect, useRef, useCallback } from "react";

type SnapPosition = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' | 'maximized';

interface WindowPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AppWindowProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  isMaximized?: boolean;
  color?: string;
  zIndex?: number;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

export function AppWindow({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  onClose,
  onMinimize,
  onFocus,
  isMaximized: initialMaximized = true,
  color = "text-primary",
  zIndex = 1,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 900, height: 600 }
}: AppWindowProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(initialMaximized);
  const [snapPosition, setSnapPosition] = useState<SnapPosition>('none');
  const [showSnapPreview, setShowSnapPreview] = useState<SnapPosition>('none');
  const [position, setPosition] = useState<WindowPosition>({
    x: initialPosition.x,
    y: initialPosition.y,
    width: initialSize.width,
    height: initialSize.height
  });
  const [preMaximizePosition, setPreMaximizePosition] = useState<WindowPosition | null>(null);
  
  const windowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const resizeDirection = useRef<string>('');
  const dragOffset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
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

  const handleMaximize = () => {
    if (isMaximized || snapPosition !== 'none') {
      // Restore
      if (preMaximizePosition) {
        setPosition(preMaximizePosition);
      }
      setIsMaximized(false);
      setSnapPosition('none');
    } else {
      // Maximize
      setPreMaximizePosition(position);
      setIsMaximized(true);
      setSnapPosition('maximized');
    }
  };

  const getSnapZone = useCallback((x: number, y: number): SnapPosition => {
    const threshold = 20;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 48; // Taskbar height

    const isLeft = x < threshold;
    const isRight = x > screenWidth - threshold;
    const isTop = y < threshold;
    const isBottom = y > screenHeight - threshold;

    if (isTop && isLeft) return 'topleft';
    if (isTop && isRight) return 'topright';
    if (isBottom && isLeft) return 'bottomleft';
    if (isBottom && isRight) return 'bottomright';
    if (isLeft) return 'left';
    if (isRight) return 'right';
    if (isTop) return 'maximized';

    return 'none';
  }, []);

  const applySnap = useCallback((snap: SnapPosition) => {
    const screenWidth = window.innerWidth - 80; // Sidebar width
    const screenHeight = window.innerHeight - 48 - 12; // Taskbar + padding

    switch (snap) {
      case 'left':
        setPosition({ x: 0, y: 0, width: screenWidth / 2, height: screenHeight });
        break;
      case 'right':
        setPosition({ x: screenWidth / 2, y: 0, width: screenWidth / 2, height: screenHeight });
        break;
      case 'topleft':
        setPosition({ x: 0, y: 0, width: screenWidth / 2, height: screenHeight / 2 });
        break;
      case 'topright':
        setPosition({ x: screenWidth / 2, y: 0, width: screenWidth / 2, height: screenHeight / 2 });
        break;
      case 'bottomleft':
        setPosition({ x: 0, y: screenHeight / 2, width: screenWidth / 2, height: screenHeight / 2 });
        break;
      case 'bottomright':
        setPosition({ x: screenWidth / 2, y: screenHeight / 2, width: screenWidth / 2, height: screenHeight / 2 });
        break;
      case 'maximized':
        setPosition({ x: 0, y: 0, width: screenWidth, height: screenHeight });
        setIsMaximized(true);
        break;
    }
    setSnapPosition(snap);
  }, []);

  // Drag handlers
  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    if (isMaximized || snapPosition !== 'none') {
      setPreMaximizePosition(position);
      const newWidth = 800;
      const newHeight = 500;
      setPosition({
        x: e.clientX - newWidth / 2,
        y: e.clientY - 20,
        width: newWidth,
        height: newHeight
      });
      dragOffset.current = { x: newWidth / 2, y: 20 };
      setIsMaximized(false);
      setSnapPosition('none');
    }

    onFocus?.();
  }, [position, isMaximized, snapPosition, onFocus]);

  // Resize handlers
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    isResizing.current = true;
    resizeDirection.current = direction;
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: position.width,
      height: position.height
    };
    onFocus?.();
  }, [position, onFocus]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        
        setPosition(prev => ({
          ...prev,
          x: Math.max(0, newX),
          y: Math.max(0, newY)
        }));

        // Check for snap zones
        const snap = getSnapZone(e.clientX, e.clientY);
        setShowSnapPreview(snap);
      }

      if (isResizing.current) {
        const deltaX = e.clientX - startPos.current.x;
        const deltaY = e.clientY - startPos.current.y;
        const dir = resizeDirection.current;
        
        setPosition(prev => {
          const newPos = { ...prev };
          const minWidth = 400;
          const minHeight = 300;

          if (dir.includes('e')) {
            newPos.width = Math.max(minWidth, startPos.current.width + deltaX);
          }
          if (dir.includes('w')) {
            const newWidth = Math.max(minWidth, startPos.current.width - deltaX);
            if (newWidth !== prev.width) {
              newPos.x = prev.x + (startPos.current.width - newWidth);
              newPos.width = newWidth;
            }
          }
          if (dir.includes('s')) {
            newPos.height = Math.max(minHeight, startPos.current.height + deltaY);
          }
          if (dir.includes('n')) {
            const newHeight = Math.max(minHeight, startPos.current.height - deltaY);
            if (newHeight !== prev.height) {
              newPos.y = prev.y + (startPos.current.height - newHeight);
              newPos.height = newHeight;
            }
          }

          return newPos;
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging.current) {
        const snap = getSnapZone(e.clientX, e.clientY);
        if (snap !== 'none') {
          applySnap(snap);
        }
        setShowSnapPreview('none');
      }
      isDragging.current = false;
      isResizing.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [getSnapZone, applySnap]);

  const getSnapPreviewStyle = () => {
    const screenWidth = window.innerWidth - 80;
    const screenHeight = window.innerHeight - 48 - 12;

    switch (showSnapPreview) {
      case 'left':
        return { left: 0, top: 0, width: screenWidth / 2, height: screenHeight };
      case 'right':
        return { left: screenWidth / 2, top: 0, width: screenWidth / 2, height: screenHeight };
      case 'topleft':
        return { left: 0, top: 0, width: screenWidth / 2, height: screenHeight / 2 };
      case 'topright':
        return { left: screenWidth / 2, top: 0, width: screenWidth / 2, height: screenHeight / 2 };
      case 'bottomleft':
        return { left: 0, top: screenHeight / 2, width: screenWidth / 2, height: screenHeight / 2 };
      case 'bottomright':
        return { left: screenWidth / 2, top: screenHeight / 2, width: screenWidth / 2, height: screenHeight / 2 };
      case 'maximized':
        return { left: 0, top: 0, width: screenWidth, height: screenHeight };
      default:
        return null;
    }
  };

  const windowStyle = isMaximized || snapPosition !== 'none' 
    ? { width: '100%', height: '100%', left: 0, top: 0 }
    : { 
        width: position.width, 
        height: position.height,
        left: position.x,
        top: position.y,
        position: 'absolute' as const
      };

  return (
    <>
      {/* Snap Preview */}
      {showSnapPreview !== 'none' && (
        <div
          className="absolute bg-primary/20 border-2 border-primary/50 rounded-xl pointer-events-none z-[100] transition-all duration-150"
          style={getSnapPreviewStyle() || {}}
        />
      )}

      <div 
        ref={windowRef}
        className={cn(
          "flex flex-col rounded-xl overflow-hidden glass-effect windows-shadow",
          isMaximized || snapPosition !== 'none' ? "w-full h-full" : "",
          isVisible && !isClosing && "animate-window-open",
          isClosing && "animate-window-close",
          !isMaximized && snapPosition === 'none' && "absolute"
        )}
        style={{
          ...windowStyle,
          zIndex
        }}
        onClick={onFocus}
      >
        {/* Windows-style Title Bar */}
        <div 
          className="flex items-center justify-between h-10 bg-gradient-to-b from-white/10 to-transparent border-b border-white/5 select-none cursor-move"
          onMouseDown={handleTitleBarMouseDown}
          onDoubleClick={handleMaximize}
        >
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
              className="h-full w-12 flex items-center justify-center hover:bg-white/10 transition-colors cursor-default"
            >
              <Minus className="w-4 h-4 text-foreground/70" />
            </button>
            
            {/* Maximize/Restore */}
            <button 
              onClick={handleMaximize}
              className="h-full w-12 flex items-center justify-center hover:bg-white/10 transition-colors cursor-default"
            >
              {isMaximized || snapPosition !== 'none' ? (
                <Copy className="w-3 h-3 text-foreground/70" />
              ) : (
                <Square className="w-3 h-3 text-foreground/70" />
              )}
            </button>
            
            {/* Close */}
            <button 
              onClick={handleClose}
              className="h-full w-12 flex items-center justify-center hover:bg-destructive transition-colors group cursor-default"
            >
              <X className="w-4 h-4 text-foreground/70 group-hover:text-white" />
            </button>
          </div>
        </div>
        
        {/* Window Content */}
        <div className="flex-1 overflow-auto p-4 bg-background/50">
          {children}
        </div>

        {/* Resize Handles */}
        {!isMaximized && snapPosition === 'none' && (
          <>
            {/* Edges */}
            <div 
              className="absolute top-0 left-2 right-2 h-1 cursor-n-resize" 
              onMouseDown={(e) => handleResizeMouseDown(e, 'n')} 
            />
            <div 
              className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize" 
              onMouseDown={(e) => handleResizeMouseDown(e, 's')} 
            />
            <div 
              className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize" 
              onMouseDown={(e) => handleResizeMouseDown(e, 'w')} 
            />
            <div 
              className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize" 
              onMouseDown={(e) => handleResizeMouseDown(e, 'e')} 
            />
            
            {/* Corners */}
            <div 
              className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" 
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} 
            />
            <div 
              className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" 
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} 
            />
            <div 
              className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" 
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} 
            />
            <div 
              className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" 
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')} 
            />
          </>
        )}
      </div>
    </>
  );
}
