import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ReactNode, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SetupCarouselProps {
  children: ReactNode;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  canProgress: boolean;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function SetupCarousel({
  children,
  step,
  totalSteps,
  onNext,
  onPrev,
  canProgress,
}: SetupCarouselProps) {
  const [[page, direction], setPage] = useState([step, 0]);

  const paginate = (newDirection: number) => {
    if (newDirection > 0 && canProgress) {
      onNext();
    } else if (newDirection < 0 && step > 1) {
      onPrev();
    }
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Swipe hint indicators */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: step > 1 ? 0.3 : 0, x: 0 }}
          className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-transparent"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </motion.div>
      </div>
      
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: canProgress && step < totalSteps ? 0.3 : 0, x: 0 }}
          className="p-2 rounded-full bg-gradient-to-l from-primary/20 to-transparent"
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </motion.div>
      </div>

      {/* Content with swipe */}
      <AnimatePresence initial={false} custom={step - page} mode="wait">
        <motion.div
          key={step}
          custom={step - page}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className="flex-1 flex flex-col cursor-grab active:cursor-grabbing"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Animated step indicator
export function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <motion.button
          key={s}
          onClick={() => s < currentStep && onStepClick(s)}
          className={cn(
            "relative h-1.5 rounded-full transition-all duration-300",
            s === currentStep ? "w-8 bg-primary" : s < currentStep ? "w-3 bg-primary/50 hover:bg-primary/70 cursor-pointer" : "w-2 bg-muted"
          )}
          whileHover={s < currentStep ? { scale: 1.2 } : undefined}
          whileTap={s < currentStep ? { scale: 0.9 } : undefined}
        >
          {s === currentStep && (
            <motion.div
              layoutId="stepGlow"
              className="absolute inset-0 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
