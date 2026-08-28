import { motion } from "motion/react";
import { useLocale } from "@/lib/i18n";
import { Icon } from "@/components/Icon";
import { TagList } from "@/components/TagList";
import { LinkRows } from "@/components/LinkRows";
import { ImageBlock, VideoBlock } from "@/components/MediaBlocks";
import { RelationList } from "@/components/RelationRow";
import { experienceCategoryMeta, formatDateRange } from "@/data/journey";
import { sheet } from "@/data/identity";
import { getProjectsForExperience } from "@/lib/relationships";
import type { ExperienceEntry } from "@/types/journey";

interface ExperienceDetailContentProps {
  experience: ExperienceEntry;
  onOpenProject: (id: string) => void;
}

/** Full text where it exists, otherwise the list line, otherwise nothing. */
function resolveBody(
  experience: ExperienceEntry,
  t: <T>(value: Record<"en" | "ar", T>) => T,
): string[] {
  if (experience.body) return t(experience.body);
  return experience.description ? [t(experience.description)] : [];
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
      {experience.outcome && (
        <p
          className="mt-2 inline-flex rounded-full px-2.5 py-1 text-[12.5px] font-medium"
          style={{ color: `var(${meta.colorVar})`, backgroundColor: "var(--color-surface)" }}
        >
          {t(experience.outcome)}
        </p>
      )}
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
        <div className="mt-2.5 flex flex-col gap-2.5">
          {resolveBody(experience, t).map((paragraph, index) => (
            <p key={index} className="text-[15px] leading-relaxed text-[var(--color-ink)]">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Contributions inside this one experience. Absent for entries that
            have none, which renders nothing rather than an empty section. */}
        {experience.highlights?.length ? (
          <ul className="mt-5 flex flex-col gap-4">
            {experience.highlights.map((highlight) => (
              <li key={highlight.id} className="flex gap-2.5">
                <span
                  className="mt-[9px] h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(${meta.colorVar})` }}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <p className="text-[14.5px] font-medium leading-relaxed text-[var(--color-ink)]">
                    {t(highlight.title)}
                    {highlight.date && (
                      <span className="font-normal text-[var(--color-ink-tertiary)]">
                        {" · "}
                        {t(highlight.date)}
                      </span>
                    )}
                  </p>

                  {highlight.description && (
                    <p className="text-[14px] leading-relaxed text-[var(--color-ink-secondary)]">
                      {t(highlight.description)}
                    </p>
                  )}

                  {highlight.media?.map((item) =>
                    "alt" in item ? (
                      <ImageBlock key={item.src} image={item} />
                    ) : (
                      <VideoBlock key={item.src} video={item} />
                    ),
                  )}

                  {/* A highlight is one bullet inside an entry, so its link is
                      a quiet inline action rather than a bordered row. Always
                      external, so it opens in a new tab and never hands the
                      referrer or a window handle to the destination. */}
                  {highlight.link && (
                    <a
                      href={highlight.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      // Vertical padding is for the thumb, not the eye: the
                      // negative margin cancels most of it so the link keeps
                      // its quiet size while staying comfortably tappable.
                      className="-my-1.5 inline-flex w-fit items-center gap-1.5 py-2 text-[13px] font-medium text-[var(--color-ink-secondary)] underline decoration-[var(--color-border)] decoration-1 underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:decoration-[var(--color-ink-tertiary)]"
                    >
                      <Icon
                        name={highlight.link.icon ?? "link"}
                        className="shrink-0 opacity-70"
                      />
                      {t(highlight.link.label)}
                    </a>
                  )}
                </div>
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
              title: project.titleLocalized ? t(project.titleLocalized) : project.title,
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
