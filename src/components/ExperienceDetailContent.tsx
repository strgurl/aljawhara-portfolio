import { motion } from "motion/react";
import { useLocale } from "@/lib/i18n";
import { TagList } from "@/components/TagList";
import { LinkRows } from "@/components/LinkRows";
import { RelationList } from "@/components/RelationRow";
import { experienceCategoryMeta, formatDateRange } from "@/data/journey";
import { sheet } from "@/data/identity";
import { getProjectsForExperience } from "@/lib/relationships";
import type { ExperienceEntry } from "@/types/journey";

interface ExperienceDetailContentProps {
  experience: ExperienceEntry;
  onOpenProject: (id: string) => void;
}

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

export function ExperienceDetailContent({
  experience,
  onOpenProject,
}: ExperienceDetailContentProps) {
  const { t, locale } = useLocale();
  const meta = experienceCategoryMeta[experience.category];
  const relatedProjects = getProjectsForExperience(experience.id);
  const dateLabel = formatDateRange(experience, locale);

  return (
    <motion.div {...fade}>
      <p
        className="text-[13px] font-medium"
        style={{ color: `var(${meta.colorVar})` }}
      >
        {t(meta.label)}
      </p>
      <h2 className="mt-1 text-[30px] font-semibold leading-tight tracking-tight text-[var(--color-ink)] lg:text-[38px]">
        {t(experience.role)}
      </h2>
      <p className="mt-1.5 text-[15px] text-[var(--color-ink-secondary)] lg:mt-2 lg:text-[16px]">
        {t(experience.organization)}
        {experience.location ? ` · ${t(experience.location)}` : ""}
      </p>

      <div className="mt-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-5">
        {dateLabel && (
          <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-tertiary)]">
            {dateLabel}
          </p>
        )}
        <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--color-ink)]">
          {t(experience.description)}
        </p>

        {t(experience.highlights ?? { en: [], ar: [] }).length ? (
          <ul className="mt-4 flex flex-col gap-2">
            {t(experience.highlights ?? { en: [], ar: [] }).map((highlight) => (
              <li
                key={highlight}
                className="flex gap-2.5 text-[14.5px] leading-relaxed text-[var(--color-ink)]"
              >
                <span
                  className="mt-[9px] h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(${meta.colorVar})` }}
                />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        {experience.skills?.length ? (
          <div className="mt-5">
            <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-tertiary)]">
              {t(sheet.skills)}
            </p>
            <TagList tags={experience.skills} />
          </div>
        ) : null}
      </div>

      {relatedProjects.length ? (
        <div className="mt-6">
          <RelationList
            eyebrow={t(sheet.workFrom)}
            items={relatedProjects.map((project) => ({
              id: project.id,
              title: project.title,
              subtitle: t(project.summary),
              icon: "briefcase",
              onSelect: () => onOpenProject(project.id),
            }))}
          />
        </div>
      ) : null}

      {experience.links?.length ? (
        <div className="mt-6">
          <LinkRows items={experience.links} heading={t(sheet.links)} />
        </div>
      ) : null}
    </motion.div>
  );
}
