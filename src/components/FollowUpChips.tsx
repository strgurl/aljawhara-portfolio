import { motion } from "motion/react";
import { useLocale } from "@/lib/i18n";
import type { Localized } from "@/lib/i18n";
import type { FollowUp } from "@/types/conversation";

interface FollowUpChipsProps {
  items: FollowUp[];
  animate?: boolean;
  baseDelay?: number;
  onSelect: (targetId: string, label: Localized) => void;
}

export function FollowUpChips({
  items,
  animate = true,
  baseDelay = 0,
  onSelect,
}: FollowUpChipsProps) {
  const { t } = useLocale();
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <motion.button
          key={item.targetId + t(item.label)}
          type="button"
          onClick={() => onSelect(item.targetId, item.label)}
          initial={animate ? { opacity: 0, y: 6 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: animate ? baseDelay + 0.07 * index : 0,
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2 text-start text-[13.5px] text-[var(--color-ink)] shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] lg:px-4 lg:py-2.5 lg:text-[14.5px]"
        >
          {t(item.label)}
        </motion.button>
      ))}
    </div>
  );
}
