import { motion } from "motion/react";
import { useLocale } from "@/lib/i18n";
import { TagList } from "@/components/TagList";
import { LinkRows } from "@/components/LinkRows";
import { ImageBlock, VideoBlock } from "@/components/MediaBlocks";
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
  const gallery = project.gallery ? t(project.gallery) : [];

  return (
    <motion.div {...fade}>
      <p className="text-[13px] font-medium text-[var(--color-ink-secondary)]">{t(project.eyebrow)}</p>
      <h2 className="mt-1 text-[34px] font-semibold leading-tight tracking-tight text-[var(--color-ink)] lg:text-[44px]">
        {project.titleLocalized ? t(project.titleLocalized) : project.title}
        {project.status && (
          <span className="ms-3 align-middle text-[13px] font-medium text-[var(--color-ink-tertiary)]">
            {t(project.status)}
          </span>
        )}
      </h2>

      {/* Every piece of media is optional and simply absent until supplied. */}
      {project.cover && (
        <div className="mt-6">
          <ImageBlock image={project.cover} />
        </div>
      )}

      <div className="mt-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-5">
        {project.year && (
          <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-tertiary)]">
            {project.year}
          </p>
        )}
        <div className="mt-2.5 flex flex-col gap-2.5">
          {t(project.body).map((paragraph, index) => (
            <p key={index} className="text-[15px] leading-relaxed text-[var(--color-ink)]">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Each remaining block keeps the same small-caps heading the
            technologies list already uses, so nothing new is introduced. */}
        {project.sections?.map((section) => (
          <div key={section.heading.en} className="mt-5">
            <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-tertiary)]">
              {t(section.heading)}
            </p>
            <div className="flex flex-col gap-2.5">
              {t(section.paragraphs).map((paragraph, index) => (
                <p key={index} className="text-[15px] leading-relaxed text-[var(--color-ink)]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}

      </div>

      {/* What it is, then where it came from, then where to go see it — all
          before the media walkthrough. Each block renders only when it has
          something in it, so a project with no links or no origin simply
          shows neither, never an empty heading. */}
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

      {project.tags?.length ? (
        <div className="mt-6">
          <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-tertiary)]">
            {t(sheet.technologies)}
          </p>
          <TagList tags={project.tags} />
        </div>
      ) : null}

      {project.video && (
        <div className="mt-6">
          <VideoBlock video={project.video} />
        </div>
      )}

      {gallery.length ? (
        <div className="mt-6 flex flex-col gap-3">
          {gallery.map((image) => (
            <ImageBlock key={image.src} image={image} />
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}
