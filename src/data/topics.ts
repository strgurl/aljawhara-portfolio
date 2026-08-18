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
    starterPrompt: L("Who are you?", "عرّفيني بنفسك"),
    rootNodeId: "me",
  },
  {
    id: "projects",
    label: L("Projects", "شغلي"),
    icon: "briefcase",
    starterPrompt: L("Show me your projects.", "ورّيني شغلك"),
    rootNodeId: "projects",
  },
  {
    id: "skills",
    label: L("Skills", "مهاراتي"),
    icon: "layers",
    starterPrompt: L("What do you work with?", "وش الأدوات اللي تشتغلين فيها؟"),
    rootNodeId: "skills",
  },
  {
    id: "journey",
    label: L("Journey", "مسيرتي"),
    icon: "compass",
    starterPrompt: L("What have you been up to?", "وش اللي مشغولة فيه؟"),
    rootNodeId: "journey",
  },
  {
    id: "fun",
    label: L("Fun", "خفيف"),
    icon: "spark",
    starterPrompt: L("Tell me something fun.", "قوليلي شي خفيف"),
    rootNodeId: "now",
  },
  {
    id: "contact",
    label: L("Contact", "تواصل"),
    icon: "mail",
    starterPrompt: L("How can I reach you?", "كيف أوصل لك؟"),
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
