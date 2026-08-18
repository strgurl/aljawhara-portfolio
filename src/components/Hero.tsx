import { motion } from "motion/react";
import { Character } from "@/components/Character";
import { identity } from "@/data/identity";
import { useLocale } from "@/lib/i18n";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The landing identity block. It is the empty state of the conversation, not a
 * separate screen — once the visitor asks something it lifts away and the
 * character continues on as the small header avatar.
 */
export function Hero() {
  const { t } = useLocale();
  const name = t(identity.name);

  return (
    <div className="flex flex-col items-center text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
        className="text-[14.5px] text-[var(--color-ink-secondary)] lg:text-[15px]"
      >
        {t(identity.greeting)} <span aria-hidden>👋</span>
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        className="mt-1.5 text-[38px] font-semibold leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-[48px] lg:text-[58px]"
      >
        {t(identity.role)}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.16 }}
        className="mt-7 lg:mt-9"
      >
        <Character layoutId="character" size={168} pose="greeting" name={name} />
      </motion.div>
    </div>
  );
}

/** Oversized wordmark bleeding off the bottom edge of the landing. */
export function NameWatermark() {
  const { t } = useLocale();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden leading-none"
    >
      <p className="translate-y-[28%] text-center text-[22vw] font-semibold tracking-tight text-[var(--color-ink)] opacity-[0.045] lg:text-[17vw]">
        {t(identity.name)}
      </p>
    </div>
  );
}
