import { motion } from "motion/react";
import { useLocale } from "@/lib/i18n";
import { TagList } from "@/components/TagList";
import { LinkRows } from "@/components/LinkRows";
import { RelationList } from "@/components/RelationRow";
import { experienceCategoryMeta } from "@/data/journey";
import { sheet } from "@/data/identity";
import { getExperiencesForProject } from "@/lib/relationships";
import type { ProjectCard } from "@/types/conversation";

interface ProjectDetailContentProps {
  project: ProjectCard;
  onOpenExperience: (id: string) => void;
}

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

export function ProjectDetailContent({ project, onOpenExperience }: ProjectDetailContentProps) {
  const { t } = useLocale();
  const contexts = getExperiencesForProject(project);

  return (
    <motion.div {...fade}>
      <p className="text-[13px] font-medium text-[var(--color-ink-secondary)]">{t(project.eyebrow)}</p>
      <h2 className="mt-1 text-[34px] font-semibold leading-tight tracking-tight text-[var(--color-ink)] lg:text-[44px]">
        {project.title}
      </h2>

      <div className="mt-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-5">
        {project.year && (
          <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-tertiary)]">
            {project.year}
          </p>
        )}
        <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--color-ink)]">
          {t(project.description)}
        </p>

        {project.tags?.length ? (
          <div className="mt-5">
            <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-tertiary)]">
              {t(sheet.technologies)}
            </p>
            <TagList tags={project.tags} />
          </div>
        ) : null}
      </div>

      {contexts.length ? (
        <div className="mt-6">
          <RelationList
            eyebrow={t(sheet.builtAt)}
            items={contexts.map((experience) => ({
              id: experience.id,
              title: t(experience.organization),
              subtitle: t(experience.role),
              icon: experienceCategoryMeta[experience.category].icon,
              colorVar: experienceCategoryMeta[experience.category].colorVar,
              onSelect: () => onOpenExperience(experience.id),
            }))}
          />
        </div>
      ) : null}

      {project.links?.length ? (
        <div className="mt-6">
          <LinkRows items={project.links} heading={t(sheet.links)} />
        </div>
      ) : null}
    </motion.div>
  );
}
