import { motion } from "motion/react";
import { LOCALES, localeLabel, useLocale } from "@/lib/i18n";
import { ui } from "@/data/identity";

/**
 * Quiet EN/AR switch. A sliding pill marks the active language so the control
 * reads as part of the interface rather than a browser setting.
 */
export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t(ui.language)}
      className="relative flex items-center gap-0.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 p-0.5 shadow-[var(--shadow-soft)] backdrop-blur-sm"
    >
      {LOCALES.map((code) => {
        const isActive = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={isActive}
            className="relative rounded-full px-2.5 py-1 text-[11.5px] font-medium tracking-wide transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="locale-pill"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-full bg-[var(--color-ink)]"
              />
            )}
            <span
              className={`relative ${
                isActive ? "text-[var(--color-on-dark)]" : "text-[var(--color-ink-tertiary)]"
              }`}
            >
              {localeLabel[code]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
