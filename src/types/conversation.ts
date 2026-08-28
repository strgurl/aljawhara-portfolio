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

export interface SkillCluster {
  heading: Localized;
  tags: string[];
}

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

export type ContactChannel = "email" | "linkedin" | "github" | "x" | "calendar" | "cv";

export interface ContactAction {
  channel: ContactChannel;
  label: Localized;
  /**
   * null while the real value is still missing. The row renders in a plainly
   * inert state rather than as a link that goes nowhere.
   */
  value: string | null;
}

/** A headed block inside a project detail sheet. */
export interface ProjectSection {
  heading: Localized;
  paragraphs: Localized<string[]>;
}

export interface ProjectCard {
  id: string;
  eyebrow: Localized;
  /** Canonical product name. Also what free-text matching resolves against. */
  title: string;
  /** Set only where the name has a real form in the other script (تآزر). */
  titleLocalized?: Localized;
  ground: "graphite" | "plum" | "pine";
  year?: string;
  /** One-line hook, shown on the card. */
  summary: Localized;
  /** Opening of the detail sheet. */
  body: Localized<string[]>;
  /** Everything after the opening, each block under its own small heading. */
  sections?: ProjectSection[];
  /**
   * Shown when the project isn't finished ("In progress"). Its presence also
   * quiets the card, so unfinished work doesn't compete with shipped work.
   */
  status?: Localized;
  /** Technology names stay in Latin script by design. */
  tags?: string[];
  /** One unified section. Live demo, GitHub, SideQuest, anything external. */
  links?: LinkItem[];
  /**
   * Media is entirely optional and each piece renders only when supplied, so a
   * project with no assets yet simply shows none rather than a gap.
   */
  cover?: MediaImage;
  /**
   * Per language, because a screenshot of an interface is language-specific:
   * the Arabic sheet should show the Arabic build. A project whose shots carry
   * no interface text can simply pass the same array to both.
   */
  gallery?: Localized<MediaImage[]>;
  video?: MediaVideo;
  /** Source of truth for the project↔experience relationship. */
  experienceIds?: string[];
  /**
   * Work-grid visibility. Absent means shown. Set false for work that belongs
   * to a Journey entry but isn't a portfolio piece in its own right.
   */
  showInWork?: boolean;
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
  /** Skills grouped by what they're used for, rather than one flat list. */
  skillClusters?: SkillCluster[];
  links?: LinkItem[];
  cta?: CTAButton[];
  contact?: ContactAction[];
  followUps?: FollowUp[];
}
