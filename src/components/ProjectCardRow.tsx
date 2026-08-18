import { useRef } from "react";
import { motion } from "motion/react";
import { Icon } from "@/components/Icon";
import { useLocale } from "@/lib/i18n";
import { ui } from "@/data/identity";
import type { ProjectCard } from "@/types/conversation";

const groundClass: Record<ProjectCard["ground"], string> = {
  graphite: "bg-[var(--color-card-graphite)]",
  plum: "bg-[var(--color-card-plum)]",
  pine: "bg-[var(--color-card-pine)]",
};

interface ProjectCardRowProps {
  projects: ProjectCard[];
  onOpen: (project: ProjectCard) => void;
}

export function ProjectCardRow({ projects, onOpen }: ProjectCardRowProps) {
  const { t } = useLocale();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 lg:gap-5"
      >
        {projects.map((project) => (
          <motion.button
            key={project.id}
            type="button"
            onClick={() => onOpen(project)}
            whileTap={{ scale: 0.98 }}
            className={`grain relative flex h-56 w-44 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] p-4 text-left shadow-[var(--shadow-lifted)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-[19rem] lg:w-[16.5rem] lg:p-6 lg:hover:-translate-y-1 xl:h-[20.5rem] xl:w-[18rem] ${groundClass[project.ground]}`}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,0.14), transparent 55%)",
              }}
            />
            <span className="relative text-[11px] font-medium uppercase tracking-wide text-[var(--color-on-dark-secondary)] lg:text-[11.5px]">
              {t(project.eyebrow)}
            </span>
            <span className="relative">
              <span className="block text-[20px] font-semibold leading-tight text-[var(--color-on-dark)] lg:text-[26px] lg:tracking-tight">
                {project.title}
              </span>
              <span className="mt-2 hidden text-[13.5px] leading-snug text-[var(--color-on-dark-secondary)] lg:block">
                {t(project.summary)}
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      {projects.length > 1 && (
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            aria-label={t(ui.scrollLeft)}
            onClick={() => scrollBy(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-ink-secondary)] transition-colors hover:bg-[var(--color-surface)]"
          >
            <Icon name="arrow-left" className="rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            aria-label={t(ui.scrollRight)}
            onClick={() => scrollBy(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-ink-secondary)] transition-colors hover:bg-[var(--color-surface)]"
          >
            <Icon name="arrow-right" className="rtl:-scale-x-100" />
          </button>
        </div>
      )}
    </div>
  );
}
