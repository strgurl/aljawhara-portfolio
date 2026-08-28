import { useEffect, useRef } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { getNode } from "@/data/conversation";
import { UserMessage } from "@/components/UserMessage";
import { BotMessage } from "@/components/BotMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { userEntryText, type ThreadEntry } from "@/hooks/useConversation";
import { useLocale } from "@/lib/i18n";
import type { Localized } from "@/lib/i18n";
import type { ProjectCard } from "@/types/conversation";

interface MessageStreamProps {
  thread: ThreadEntry[];
  lastBotEntryId: string | null;
  isTyping: boolean;
  scrollRef: React.RefObject<HTMLElement | null>;
  onNavigate: (targetId: string, label: Localized) => void;
  onOpenProject: (project: ProjectCard) => void;
  onOpenExperience: (id: string) => void;
}

export function MessageStream({
  thread,
  lastBotEntryId,
  isTyping,
  scrollRef,
  onNavigate,
  onOpenProject,
  onOpenExperience,
}: MessageStreamProps) {
  const { locale } = useLocale();
  const endRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Entries already on screen when this conversation was restored are history
  // and appear at rest; only new arrivals animate.
  const baselineRef = useRef(thread.length);
  const prevLengthRef = useRef(thread.length);

  useEffect(() => {
    const grew = thread.length > prevLengthRef.current;
    prevLengthRef.current = thread.length;
    if (!grew && !isTyping) return;

    // Keep the newest exchange in view without yanking the page.
    const id = window.requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "end",
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [thread.length, isTyping, shouldReduceMotion]);

  // A restored conversation should show its tail immediately, no animation.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {thread.map((entry, index) => {
        const animate = index >= baselineRef.current;
        // The question this answer replies to, kept exactly as typed so the
        // fallback can carry it into an email instead of losing it.
        const asked =
          entry.role === "bot"
            ? thread
                .slice(0, index)
                .reverse()
                .find((item): item is Extract<ThreadEntry, { role: "user" }> => item.role === "user")
                ?.raw
            : undefined;

        return entry.role === "user" ? (
          <UserMessage key={entry.id} text={userEntryText(entry, locale)} animate={animate} />
        ) : (
          <BotMessage
            key={entry.id}
            node={getNode(entry.nodeId)}
            showFollowUps={entry.id === lastBotEntryId && !isTyping}
            uncertain={entry.uncertain}
            question={asked}
            animate={animate}
            onNavigate={onNavigate}
            onOpenProject={onOpenProject}
            onOpenExperience={onOpenExperience}
          />
        );
      })}

      <AnimatePresence>{isTyping && <TypingIndicator key="typing" />}</AnimatePresence>

      <div ref={endRef} />
    </div>
  );
}
