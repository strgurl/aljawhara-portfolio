import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getNode } from "@/data/conversation";
import { matchTrigger } from "@/lib/matchTrigger";
import { LANDING_TOPIC_ID, topicByRootNode, topicById } from "@/data/topics";
import type { Locale, Localized } from "@/lib/i18n";

/**
 * A question the visitor "asked". Predefined prompts keep their localized
 * source so they re-render in the active language; text the visitor typed is
 * preserved exactly as written and never translated.
 */
export type UserEntry = {
  id: string;
  role: "user";
  label?: Localized;
  raw?: string;
};

export type BotEntry = {
  id: string;
  role: "bot";
  nodeId: string;
  /** Set when the match was only approximate, so the answer says so up front. */
  uncertain?: boolean;
};

export type ThreadEntry = UserEntry | BotEntry;

type ThreadMap = Record<string, ThreadEntry[]>;

/** Choreography only — answers are local, so this stays short on purpose. */
const TYPING_MS = 420;

let entryCounter = 0;
const nextId = () => `entry-${(entryCounter += 1)}`;

const botEntry = (nodeId: string, uncertain = false): ThreadEntry => ({
  id: nextId(),
  role: "bot",
  nodeId,
  uncertain,
});

/** Resolve a user entry for display in the active locale. */
export function userEntryText(entry: UserEntry, locale: Locale): string {
  return entry.label ? entry.label[locale] : (entry.raw ?? "");
}

/**
 * One independent conversation per topic. Switching topics swaps which thread
 * is on screen; returning restores it untouched. No visible chapter UI — the
 * topic chips are the only surface this state gets.
 */
export function useConversation() {
  const [threads, setThreads] = useState<ThreadMap>({});
  const [activeTopicId, setActiveTopicId] = useState<string>(LANDING_TOPIC_ID);
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  /** Push the question immediately, then let the answer land after a short beat. */
  const exchange = useCallback(
    (topicId: string, question: UserEntry, nodeId: string, uncertain = false) => {
    clearTimer();
    setThreads((prev) => ({
      ...prev,
      [topicId]: [...(prev[topicId] ?? []), question],
    }));
    setActiveTopicId(topicId);
    setIsTyping(true);

    timerRef.current = window.setTimeout(() => {
      setThreads((prev) => ({
        ...prev,
        [topicId]: [...(prev[topicId] ?? []), botEntry(nodeId, uncertain)],
      }));
      setIsTyping(false);
      timerRef.current = null;
    }, TYPING_MS);
    },
    [],
  );

  /** Chip press: resume an existing conversation, or open it with its starter. */
  const openTopic = useCallback(
    (topicId: string) => {
      const topic = topicById[topicId];
      if (!topic) return;

      if (threads[topicId]?.length) {
        clearTimer();
        setIsTyping(false);
        setActiveTopicId(topicId);
        return;
      }
      exchange(
        topicId,
        { id: nextId(), role: "user", label: topic.starterPrompt },
        topic.rootNodeId,
      );
    },
    [threads, exchange],
  );

  /** Follow-up suggestions. A target that opens a topic switches conversation. */
  const navigateTo = useCallback(
    (targetId: string, label: Localized) => {
      const topic = topicByRootNode[targetId];
      if (topic && topic.id !== activeTopicId) {
        openTopic(topic.id);
        return;
      }
      const destination = activeTopicId === LANDING_TOPIC_ID ? "me" : activeTopicId;
      exchange(destination, { id: nextId(), role: "user", label }, getNode(targetId).id);
    },
    [activeTopicId, exchange, openTopic],
  );

  const sendFreeText = useCallback(
    (raw: string, locale: Locale) => {
      const text = raw.trim();
      if (!text) return;

      const match = matchTrigger(text, locale);

      // Low confidence never guesses — it hands over to the contact fallback.
      const targetId = match.confidence === "low" ? "fallback" : (match.nodeId ?? "fallback");
      const uncertain = match.confidence === "medium";

      // Only a confident match moves the visitor to another topic; an
      // approximate one answers where they already are.
      const topic =
        match.confidence === "high" && match.nodeId ? topicByRootNode[match.nodeId] : undefined;
      const destination =
        topic?.id ?? (activeTopicId === LANDING_TOPIC_ID ? "me" : activeTopicId);

      exchange(
        destination,
        { id: nextId(), role: "user", raw: text },
        getNode(targetId).id,
        uncertain,
      );
    },
    [activeTopicId, exchange],
  );

  /**
   * Back to the landing. Purely a view change — threads, explored topics and
   * locale all stay exactly as they were, so resuming continues where the
   * visitor left off rather than restarting the portfolio.
   */
  const returnHome = useCallback(() => {
    clearTimer();
    setIsTyping(false);
    setActiveTopicId(LANDING_TOPIC_ID);
  }, []);

  const thread = useMemo(() => threads[activeTopicId] ?? [], [threads, activeTopicId]);

  const lastBotEntryId = useMemo(() => {
    for (let i = thread.length - 1; i >= 0; i -= 1) {
      if (thread[i].role === "bot") return thread[i].id;
    }
    return null;
  }, [thread]);

  return {
    thread,
    activeTopicId,
    isTyping,
    hasStarted: activeTopicId !== LANDING_TOPIC_ID,
    openTopic,
    returnHome,
    navigateTo,
    sendFreeText,
    lastBotEntryId,
  };
}
