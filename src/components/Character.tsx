import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Slot for the personal character illustration (Memoji).
 *
 * Built for a *set* of poses rather than one image: drop matching transparent
 * squares into `public/character/` and they are picked up automatically, with a
 * graceful chain down to whatever exists. Until any are supplied a neutral
 * monogram stands in, so the composition can be judged at the right size.
 *
 *   public/character/greeting.png   landing
 *   public/character/neutral.png    conversation
 *   public/character/smiling.png    hover / press
 *   public/character/thinking.png   while an answer is arriving
 *
 * Only `neutral` is required; missing poses silently fall back to it.
 */

export type CharacterPose = "greeting" | "neutral" | "smiling" | "thinking";

/** Order to try when a pose has no asset of its own. */
const POSE_FALLBACK: Record<CharacterPose, CharacterPose[]> = {
  greeting: ["greeting", "smiling", "neutral"],
  neutral: ["neutral"],
  smiling: ["smiling", "neutral"],
  thinking: ["thinking", "neutral"],
};

const srcFor = (pose: CharacterPose) => `/character/${pose}.png`;

interface CharacterProps {
  /** Rendered size in px. The hero uses a large value, the header a small one. */
  size: number;
  name: string;
  pose?: CharacterPose;
  className?: string;
  /** Shared id so the character morphs between hero and header rather than cutting. */
  layoutId?: string;
  /** When set the character becomes an activator (returning home). */
  onActivate?: () => void;
  label?: string;
}

export function Character({
  size,
  name,
  pose = "neutral",
  className,
  layoutId,
  onActivate,
  label,
}: CharacterProps) {
  const shouldReduceMotion = useReducedMotion();
  // Walk the fallback chain as assets fail to load.
  const [attempt, setAttempt] = useState(0);
  const [exhausted, setExhausted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const chain = POSE_FALLBACK[pose];
  // Hover swaps to the friendlier pose when one exists.
  const effective = hovered && onActivate ? POSE_FALLBACK.smiling : chain;
  const current = effective[Math.min(attempt, effective.length - 1)];

  const interactive = Boolean(onActivate);

  const content = (
    <>
      {!exhausted && (
        <img
          key={current}
          src={srcFor(current)}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full select-none object-contain"
          draggable={false}
          onError={() => {
            if (attempt < effective.length - 1) setAttempt(attempt + 1);
            else setExhausted(true);
          }}
        />
      )}

      {exhausted && (
        /* Neutral stand-in — light enough to read as a reserved slot rather than
           a design choice, so it doesn't distort the composition's weight. */
        <div
          style={{ fontSize: size * 0.3 }}
          aria-hidden
          className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]/60 font-medium tracking-tight text-[var(--color-ink-tertiary)]"
        >
          {name.trim().charAt(0)}
        </div>
      )}
    </>
  );

  const shared = {
    layoutId,
    className,
    style: { width: size, height: size },
    transition: { type: "spring" as const, stiffness: 220, damping: 30 },
  };

  if (!interactive) {
    return <motion.div {...shared}>{content}</motion.div>;
  }

  return (
    <motion.button
      {...shared}
      type="button"
      aria-label={label}
      title={label}
      onClick={onActivate}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      // Restrained: a small lift and settle, never a bounce.
      whileHover={shouldReduceMotion ? undefined : { scale: 1.06, y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      className={`${className ?? ""} relative cursor-pointer rounded-full outline-offset-4`}
    >
      {content}
      {/* Quiet affordance: a ring that only surfaces on hover/focus. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-6px] rounded-full border border-[var(--color-border-strong)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ opacity: hovered ? 0.7 : 0 }}
      />
    </motion.button>
  );
}
