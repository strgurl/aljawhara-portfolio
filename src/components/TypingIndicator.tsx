import { motion, useReducedMotion } from "motion/react";
import { useLocale } from "@/lib/i18n";
import { ui } from "@/data/identity";

/**
 * The brief beat between a question landing and its answer. Choreography only —
 * the answers are predefined and local, so this never stands in for real work.
 */
export function TypingIndicator() {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="flex items-center gap-1.5 py-1"
      role="status"
      aria-label={t(ui.thinking)}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink-tertiary)]"
          animate={shouldReduceMotion ? { opacity: 0.7 } : { opacity: [0.25, 1, 0.25] }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }
          }
        />
      ))}
    </motion.div>
  );
}
