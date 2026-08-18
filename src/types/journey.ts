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
  /** Dates stay numeric; only the surrounding words are localized. */
  startDate?: Localized;
  endDate?: Localized;
  location?: Localized;
  description: Localized;
  highlights?: Localized<string[]>;
  /** Skill names stay in Latin script by design. */
  skills?: string[];
  relatedProjectIds?: string[];
  links?: LinkItem[];
  media?: MediaImage | MediaVideo;
}
