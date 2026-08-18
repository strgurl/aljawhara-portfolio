import type { Localized } from "@/lib/i18n";
import type { ExperienceEntry } from "@/types/journey";

export type IconName =
  | "person"
  | "briefcase"
  | "layers"
  | "spark"
  | "mail"
  | "dots"
  | "arrow-left"
  | "arrow-right"
  | "chevron-right"
  | "close"
  | "send"
  | "link"
  | "play"
  | "github"
  | "linkedin"
  | "x"
  | "compass"
  | "cap"
  | "flag"
  | "users"
  | "refresh";

export interface FollowUp {
  /** Shown on the pill and echoed as the visitor's message. */
  label: Localized;
  targetId: string;
}

export interface LinkItem {
  label: Localized;
  url: string;
  icon?: IconName;
}

export interface MediaImage {
  src: string;
  alt: Localized;
  caption?: Localized;
}

export interface MediaVideo {
  src: string;
  poster?: string;
  caption?: Localized;
}

export interface CTAButton {
  label: Localized;
  targetId?: string;
  url?: string;
  variant?: "primary" | "secondary";
}

export type ContactChannel = "email" | "linkedin" | "github" | "x" | "calendar";

export interface ContactAction {
  channel: ContactChannel;
  label: Localized;
  value: string;
}

export interface ProjectCard {
  id: string;
  eyebrow: Localized;
  /** Product name — a proper noun, so it stays as authored. */
  title: string;
  ground: "graphite" | "plum" | "pine";
  year?: string;
  summary: Localized;
  description: Localized;
  /** Technology names stay in Latin script by design. */
  tags?: string[];
  links?: LinkItem[];
  image?: string;
  video?: MediaVideo;
  /** Source of truth for the project↔experience relationship. */
  experienceIds?: string[];
}

/**
 * One node = one topic in the conversation graph. A response can carry any
 * combination of rich content; the renderer draws only what is present.
 */
export interface ConversationNode {
  id: string;
  /** Keywords/phrases that let free-text input resolve to this node. */
  triggers?: Localized<string[]>;
  paragraphs: Localized<string[]>;
  projects?: ProjectCard[];
  experiences?: ExperienceEntry[];
  images?: MediaImage[];
  video?: MediaVideo;
  techTags?: string[];
  links?: LinkItem[];
  cta?: CTAButton[];
  contact?: ContactAction[];
  followUps?: FollowUp[];
}
