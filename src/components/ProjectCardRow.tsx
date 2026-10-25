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
        {projects.map((project) => {
          // `status` quiets the card so unfinished work doesn't compete with
          // shipped work. Whether it opens is a separate question: a project
          // can be mid-build and still have plenty to read.
          const inProgress = Boolean(project.status);
          const teaserOnly = Boolean(project.teaserOnly);

          // The hairline matters now that the cards are paper: without it a
          // cream card dissolves into the page behind it.
          const surface = `grain relative flex h-56 w-44 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] p-4 text-left shadow-[var(--shadow-lifted)] lg:h-[19rem] lg:w-[16.5rem] lg:p-6 xl:h-[20.5rem] xl:w-[18rem] ${groundClass[project.ground]}`;

          const body = (
            <>
              {project.cover ? (
                <>
                  {/* Decorative here: the title and hook beside it already name
                      the project, so the alt text would only repeat them. */}
                  <img
                    src={project.cover.src}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-center ${
                      inProgress ? "saturate-[0.45]" : ""
                    }`}
                  />
                  {/* Floods the two bands the text sits in back to bare paper.
                      The wash is the artwork's own stock, so over the covers'
                      own cream margins it is invisible and only shows where ink
                      actually reaches into a text band — which is exactly where
                      it is needed. That is why it can afford to be this opaque:
                      the measured worst case is a title crossing Ebr's dark
                      ribbon and a three-line eyebrow crossing its navy bubble,
                      and both bands are sized from the real text boxes. */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top," +
                        "rgba(var(--color-card-paper),0.97) 0%," +
                        "rgba(var(--color-card-paper),0.95) 32%," +
                        "rgba(var(--color-card-paper),0.86) 44%," +
                        "rgba(var(--color-card-paper),0.10) 54%," +
                        "rgba(var(--color-card-paper),0.10) 63%," +
                        "rgba(var(--color-card-paper),0.72) 73%," +
                        "rgba(var(--color-card-paper),0.94) 86%," +
                        "rgba(var(--color-card-paper),0.97) 100%)",
                    }}
                  />
                </>
              ) : (
                /* No artwork yet. Two soft blooms on the card's own stock, so
                   an uncovered card reads as a blank sheet from the same press
                   rather than as something unfinished. */
                <div
                  className="pointer-events-none absolute inset-0 opacity-80"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,0.75), transparent 55%)," +
                      "radial-gradient(90% 70% at 85% 80%, rgba(214,122,62,0.16), transparent 60%)",
                  }}
                />
              )}

              {/* A thin paper veil over the whole face, so the card reads as a
                  print pulled with too little ink — set aside, not merely
                  dimmer at the edges. Outside the cover branch, because a card
                  with no artwork still needs to quiet down; the desaturation
                  above only touches images. Kept light: the one card using it
                  is printed in a single grey ink while the rest of the series
                  is in colour, so the artwork already says "unfinished" and a
                  heavier veil would only erase it. */}
              {inProgress && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ backgroundColor: "rgba(var(--color-card-paper),0.2)" }}
                />
              )}
              <span className="relative flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-card-ink-secondary)] lg:text-[11.5px]">
                  {t(project.eyebrow)}
                </span>
                {/* Solid ink rather than a translucent fill: on paper a stamped
                    label stays legible over whatever the artwork does beneath
                    it, and a wash this light would not. */}
                {project.status && (
                  <span className="w-fit rounded-full bg-[var(--color-ink)] px-2.5 py-0.5 text-[10.5px] font-medium tracking-wide text-[var(--color-on-dark)]">
                    {t(project.status)}
                  </span>
                )}
              </span>
              <span className="relative">
                <span className="block text-[20px] font-semibold leading-tight text-[var(--color-ink)] lg:text-[26px] lg:tracking-tight">
                  {project.titleLocalized ? t(project.titleLocalized) : project.title}
                </span>
                {/* The one result worth seeing without opening the card. Same
                    stamped pill as the status badge, so nothing new is
                    introduced. */}
                {project.highlight && (
                  <span className="mt-2 block w-fit rounded-full bg-[var(--color-ink)] px-2.5 py-0.5 text-[10.5px] font-medium tracking-wide text-[var(--color-on-dark)]">
                    {t(project.highlight)}
                  </span>
                )}
                {/* What the project is about, so the row can be scanned for a
                    field rather than read project by project. One quiet line
                    rather than a row of chips: three stamped pills beside a
                    title would outweigh it, and this is meant to be glanced
                    at, not read. Always LTR — these are Latin terms, and in
                    an RTL card they would otherwise reorder around the
                    separators. */}
                {project.domains?.length ? (
                  <span
                    dir="ltr"
                    // Not uppercased, unlike the eyebrow above it: these terms
                    // carry their own casing (LLMs, NLP, UI), and forcing it
                    // would print "LLMS".
                    className="mt-1.5 block text-[10.5px] font-medium tracking-[0.06em] text-[var(--color-card-ink-secondary)] rtl:text-right"
                  >
                    {project.domains.join(" · ")}
                  </span>
                ) : null}
                <span className="mt-2 hidden text-[13.5px] leading-snug text-[var(--color-card-ink-secondary)] lg:block">
                  {t(project.summary)}
                </span>
              </span>
            </>
          );

          // Nothing to open: presented rather than offered — no button, no
          // cursor, no hover, no tap target.
          if (teaserOnly) {
            return (
              <div key={project.id} className={`${surface} cursor-default select-none`}>
                {body}
              </div>
            );
          }

          return (
            <motion.button
              key={project.id}
              type="button"
              onClick={() => onOpen(project)}
              whileTap={{ scale: 0.98 }}
              className={`${surface} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hover:-translate-y-1`}
            >
              {body}
            </motion.button>
          );
        })}
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
