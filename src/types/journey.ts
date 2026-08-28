import type { Localized } from "@/lib/i18n";
import type { IconName, LinkItem, MediaImage, MediaVideo } from "@/types/conversation";

export type ExperienceCategory =
  | "education"
  | "professional"
  | "program"
  | "community"
  | "hackathon";

export interface ExperienceCategoryMeta {
  label: Localized;
  icon: IconName;
  colorVar: string;
}

/** One contribution inside an experience. Media and link fill in later. */
export interface ExperienceHighlight {
  id: string;
  title: Localized;
  description?: Localized;
  date?: Localized;
  /** Screenshots and clips for this contribution. Absent until supplied. */
  media?: (MediaImage | MediaVideo)[];
  link?: LinkItem;
}

/**
 * One entry in the Journey graph. Relationships to projects are stored only
 * here (`relatedProjectIds`) — the reverse (project → experiences) is always
 * derived, never duplicated. See lib/relationships.ts.
 */
export interface ExperienceEntry {
  id: string;
  category: ExperienceCategory;
  organization: Localized;
  role: Localized;
  /**
   * Recognition attached to the entry (a placement, an award). Kept separate
   * from `role` so the UI can mark it rather than mistaking it for a title.
   */
  outcome?: Localized;
  /** Dates stay numeric; only the surrounding words are localized. */
  startDate?: Localized;
  endDate?: Localized;
  location?: Localized;
  /** One line, used in the list. Entries whose title says it all can omit it. */
  description?: Localized;
  /** Full text for the detail sheet; falls back to `description` when absent. */
  body?: Localized<string[]>;
  /**
   * Named contributions inside one experience. A club with three programmes
   * stays a single timeline entry rather than three, and an entry with none
   * renders nothing extra at all.
   */
  highlights?: ExperienceHighlight[];
  /** Skill names stay in Latin script by design. */
  skills?: string[];
  relatedProjectIds?: string[];
  links?: LinkItem[];
  media?: MediaImage | MediaVideo;
}
