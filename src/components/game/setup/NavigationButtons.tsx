import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface NavigationButtonsProps {
  step: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  canProgress: boolean;
}

export function NavigationButtons({
  step,
  totalSteps,
  onPrev,
  onNext,
  onComplete,
  canProgress,
}: NavigationButtonsProps) {
  const handleComplete = () => {
    // Epic confetti celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#14b8a6", "#0ea5e9", "#8b5cf6", "#f59e0b"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#14b8a6", "#0ea5e9", "#8b5cf6", "#f59e0b"],
      });
    }, 250);

    setTimeout(onComplete, 500);
  };

  return (
    <div className="flex items-center gap-3 pt-6">
      {/* Previous button */}
      {step > 1 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary/80 text-secondary-foreground font-medium transition-all hover:bg-secondary"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </motion.button>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Next/Complete button */}
      {step < totalSteps ? (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={canProgress ? { scale: 1.02 } : undefined}
          whileTap={canProgress ? { scale: 0.98 } : undefined}
          onClick={onNext}
          disabled={!canProgress}
          className={cn(
            "group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
            canProgress
              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Continuer
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform",
            canProgress && "group-hover:translate-x-1"
          )} />
        </motion.button>
      ) : (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          className="group relative flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary via-primary/90 to-accent/50 text-primary-foreground shadow-xl shadow-primary/30 overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          
          <Rocket className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
          <span className="relative z-10">Lancer l'entreprise !</span>
        </motion.button>
      )}
    </div>
  );
}
