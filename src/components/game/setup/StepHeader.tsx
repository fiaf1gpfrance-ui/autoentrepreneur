import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StepHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  step: number;
  totalSteps: number;
}

export function StepHeader({ icon: Icon, title, subtitle, step, totalSteps }: StepHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center pb-6 space-y-3"
    >
      {/* Step badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
      >
        <span className="text-xs font-medium text-primary">
          Étape {step}/{totalSteps}
        </span>
      </motion.div>

      {/* Icon */}
      {Icon && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10"
        >
          <Icon className="w-7 h-7 text-primary" />
        </motion.div>
      )}

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-2xl font-display font-bold text-foreground"
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground max-w-md mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
