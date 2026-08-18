import { motion } from "motion/react";

interface UserMessageProps {
  text: string;
  animate?: boolean;
}

/**
 * The visitor's question. Uses the same accent as the send button, so a sent
 * message reads as the direct result of pressing it.
 */
export function UserMessage({ text, animate = true }: UserMessageProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10, scale: 0.97 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-end"
    >
      <p className="max-w-[85%] rounded-full bg-[var(--color-accent)] px-4.5 py-2.5 text-[14.5px] leading-snug text-[var(--color-on-accent)] lg:max-w-[560px] lg:px-5 lg:text-[15px]">
        {text}
      </p>
    </motion.div>
  );
}
