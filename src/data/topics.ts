import { L, type Localized } from "@/lib/i18n";
import type { IconName } from "@/types/conversation";

/**
 * A topic is one independent conversation. It is *not* a chapter with visible
 * chrome — the chips beside the composer are the only surface it gets. State is
 * kept per topic so returning to one restores its history.
 */
export interface Topic {
  id: string;
  label: Localized;
  icon: IconName;
  /** Becomes the visitor's outgoing message when the chip is pressed. */
  starterPrompt: Localized;
  rootNodeId: string;
}

export const LANDING_TOPIC_ID = "landing";

export const topics: Topic[] = [
  {
    id: "me",
    label: L("Me", "عني"),
    icon: "person",
    starterPrompt: L("Tell me a bit about yourself", "عرّفيني عنك شوي؟"),
    rootNodeId: "me",
  },
  {
    id: "work",
    label: L("Work", "أعمالي"),
    icon: "briefcase",
    starterPrompt: L("What have you worked on?", "وش مشاريعك؟"),
    rootNodeId: "work",
  },
  {
    id: "journey",
    label: L("Journey", "مسيرتي"),
    icon: "compass",
    starterPrompt: L("What are your main milestones?", "وش أبرز محطاتك؟"),
    rootNodeId: "journey",
  },
  {
    id: "skills",
    label: L("Skills", "مهاراتي"),
    icon: "layers",
    starterPrompt: L("What skills do you work with?", "وش المهارات اللي تشتغلين فيها؟"),
    rootNodeId: "skills",
  },
  {
    id: "now",
    label: L("Now", "حاليًا"),
    icon: "spark",
    starterPrompt: L("What are you working on right now?", "وش شغّالة عليه حاليًا؟"),
    rootNodeId: "now",
  },
  {
    id: "contact",
    label: L("Contact", "تواصل"),
    icon: "mail",
    starterPrompt: L("How do I reach you?", "كيف أوصلك؟"),
    rootNodeId: "contact",
  },
];

export const topicById: Record<string, Topic> = Object.fromEntries(
  topics.map((topic) => [topic.id, topic]),
);

/** Lets the engine tell "this opens a topic" from "this is a follow-up". */
export const topicByRootNode: Record<string, Topic> = Object.fromEntries(
  topics.map((topic) => [topic.rootNodeId, topic]),
);
