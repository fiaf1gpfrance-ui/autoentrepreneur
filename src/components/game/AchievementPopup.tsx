import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Trophy, Star, Sparkles, X } from "lucide-react";
import { playSound } from "@/utils/soundEngine";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward?: { coins?: number; gems?: number };
}

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const rarityConfig = {
  common: { 
    bg: 'from-gray-500/30 to-gray-600/30',
    border: 'border-gray-500/50',
    glow: 'shadow-gray-500/20',
    text: 'text-gray-300'
  },
  rare: { 
    bg: 'from-blue-500/30 to-cyan-500/30',
    border: 'border-blue-500/50',
    glow: 'shadow-blue-500/30',
    text: 'text-blue-400'
  },
  epic: { 
    bg: 'from-purple-500/30 to-pink-500/30',
    border: 'border-purple-500/50',
    glow: 'shadow-purple-500/30',
    text: 'text-purple-400'
  },
  legendary: { 
    bg: 'from-amber-500/30 to-orange-500/30',
    border: 'border-amber-500/50',
    glow: 'shadow-amber-500/40',
    text: 'text-amber-400'
  },
};

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      setIsClosing(false);
      playSound('achievement');
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!achievement || !isVisible) return null;

  const config = rarityConfig[achievement.rarity];

  return (
    <div className="fixed top-4 right-4 z-[200] pointer-events-auto">
      <div 
        className={cn(
          "w-80 rounded-xl border-2 overflow-hidden transition-all duration-300",
          "bg-gradient-to-br backdrop-blur-xl",
          config.bg, config.border,
          "shadow-2xl", config.glow,
          isClosing ? "animate-slide-out-right opacity-0" : "animate-slide-in-right"
        )}
      >
        {/* Sparkle effect for legendary */}
        {achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Sparkles className="absolute top-2 right-2 w-4 h-4 text-amber-400 animate-pulse" />
            <Sparkles className="absolute bottom-2 left-2 w-3 h-3 text-orange-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Trophy className={cn("w-5 h-5", config.text)} />
            <span className="text-xs font-bold uppercase tracking-wider">Succès débloqué!</span>
          </div>
          <button onClick={handleClose} className="p-1 rounded hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-2xl",
              "bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
            )}>
              {achievement.icon || '🏆'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">{achievement.title}</h3>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </div>
          </div>

          {/* Rewards */}
          {achievement.reward && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
              <span className="text-xs text-muted-foreground">Récompenses:</span>
              {achievement.reward.coins && (
                <span className="text-xs font-bold text-amber-400">+{achievement.reward.coins} 🪙</span>
              )}
              {achievement.reward.gems && (
                <span className="text-xs font-bold text-purple-400">+{achievement.reward.gems} 💎</span>
              )}
            </div>
          )}
        </div>

        {/* Progress bar (auto-close indicator) */}
        <div className="h-1 bg-white/10">
          <div 
            className={cn("h-full bg-gradient-to-r", config.bg.replace('/30', ''))}
            style={{ 
              animation: 'shrink 5s linear forwards',
              width: '100%'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
