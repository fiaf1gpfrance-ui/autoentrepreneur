import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface OptionCardProps {
  value: string;
  label: string;
  description?: string;
  bonus?: string;
  icon?: LucideIcon;
  isSelected: boolean;
  onClick: () => void;
  index?: number;
  showConfetti?: boolean;
}

export function OptionCard({
  value,
  label,
  description,
  bonus,
  icon: Icon,
  isSelected,
  onClick,
  index = 0,
  showConfetti = false,
}: OptionCardProps) {
  const handleClick = () => {
    onClick();
    if (showConfetti && !isSelected) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#14b8a6", "#0ea5e9", "#8b5cf6"],
      });
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all duration-300 overflow-hidden",
        isSelected
          ? "border-primary bg-gradient-to-b from-primary/15 to-primary/5 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]"
          : "border-border/50 bg-card/30 hover:border-primary/40 hover:bg-card/60"
      )}
    >
      {/* Background gradient glow */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
        />
      )}

      {/* Floating particles effect when selected */}
      {isSelected && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              initial={{ 
                x: Math.random() * 100, 
                y: 100,
                opacity: 0 
              }}
              animate={{
                y: -20,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{ left: `${20 + i * 30}%` }}
            />
          ))}
        </div>
      )}

      {/* Icon */}
      {Icon && (
        <motion.div
          className={cn(
            "relative z-10 p-3 rounded-xl transition-all duration-300",
            isSelected
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
          )}
          animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10 space-y-1">
        <span className={cn(
          "font-display font-semibold text-sm block transition-colors",
          isSelected ? "text-primary" : "text-foreground"
        )}>
          {label}
        </span>
        
        {description && (
          <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </span>
        )}
        
        {bonus && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium",
              isSelected
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {bonus}
          </motion.span>
        )}
      </div>

      {/* Selected checkmark */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}

// List variant for legal structures
export function OptionListItem({
  label,
  description,
  isSelected,
  onClick,
  index = 0,
}: {
  label: string;
  description?: string;
  isSelected: boolean;
  onClick: () => void;
  index?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left",
        isSelected
          ? "border-primary bg-primary/10 shadow-[inset_0_0_20px_hsl(var(--primary)/0.1)]"
          : "border-transparent hover:border-border hover:bg-card/50"
      )}
    >
      <motion.div
        className={cn(
          "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
          isSelected ? "border-primary bg-primary" : "border-muted-foreground"
        )}
        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-1.5 h-1.5 bg-primary-foreground rounded-full"
          />
        )}
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <span className={cn(
          "font-medium text-sm block truncate",
          isSelected ? "text-primary" : "text-foreground"
        )}>
          {label}
        </span>
        {description && (
          <span className="text-xs text-muted-foreground line-clamp-1">{description}</span>
        )}
      </div>
    </motion.button>
  );
}
