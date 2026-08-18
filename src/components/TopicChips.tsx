import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/Icon";
import { topics } from "@/data/topics";
import { useLocale } from "@/lib/i18n";
import { ui } from "@/data/identity";

interface TopicChipsProps {
  activeTopicId: string | null;
  /** Large stacked cards on the landing, compact pills once talking. */
  variant: "landing" | "compact";
  onSelect: (topicId: string) => void;
}

/** Per-topic icon tint — a small, restrained note of colour, as in the reference. */
const iconTone: Record<string, string> = {
  me: "--color-tone-education",
  projects: "--color-tone-program",
  skills: "--color-tone-hackathon",
  journey: "--color-tone-professional",
  fun: "--color-tone-community",
  contact: "--color-glow",
};

export function TopicChips({ activeTopicId, variant, onSelect }: TopicChipsProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(true);

  const chips = (
    <div
      className={
        variant === "landing"
          ? "flex flex-wrap justify-center gap-2"
          : "flex flex-wrap justify-center gap-2"
      }
    >
      {topics.map((topic) => {
        const isActive = topic.id === activeTopicId;
        return (
          <motion.button
            key={topic.id}
            type="button"
            onClick={() => onSelect(topic.id)}
            aria-current={isActive ? "true" : undefined}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={
              variant === "landing"
                ? `flex min-w-[104px] flex-col items-center gap-1.5 rounded-[var(--radius-md)] border bg-[var(--color-bg-elevated)] px-4 py-3 text-[13px] shadow-[var(--shadow-soft)] transition-colors ${
                    isActive
                      ? "border-[var(--color-border-strong)] bg-[var(--color-surface)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]"
                  }`
                : `flex items-center gap-2 rounded-full border bg-[var(--color-bg-elevated)] px-3.5 py-2 text-[13.5px] shadow-[var(--shadow-soft)] transition-colors ${
                    isActive
                      ? "border-[var(--color-border-strong)] bg-[var(--color-surface)] font-medium"
                      : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]"
                  }`
            }
          >
            <Icon name={topic.icon} className="shrink-0" style={{ color: `var(${iconTone[topic.id]})` }} />
            <span className="text-[var(--color-ink)]">{t(topic.label)}</span>
          </motion.button>
        );
      })}
    </div>
  );

  if (variant === "landing") return chips;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mx-auto mb-2.5 flex items-center gap-1 text-[12.5px] text-[var(--color-ink-tertiary)] transition-colors hover:text-[var(--color-ink-secondary)]"
      >
        {open ? t(ui.hideTopics) : t(ui.showTopics)}
        <motion.span
          animate={{ rotate: open ? 90 : -90 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex rtl:-scale-x-100"
        >
          <Icon name="chevron-right" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-1">{chips}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
