import { motion } from "motion/react";
import { useLocale } from "@/lib/i18n";
import { TagList } from "@/components/TagList";
import { ProjectCardRow } from "@/components/ProjectCardRow";
import { JourneyList } from "@/components/JourneyList";
import { LinkRows } from "@/components/LinkRows";
import { CTAButtons } from "@/components/CTAButtons";
import { FollowUpChips } from "@/components/FollowUpChips";
import { ImageBlock, VideoBlock } from "@/components/MediaBlocks";
import { ui } from "@/data/identity";
import { mailtoHref, questionMailto } from "@/data/contact";
import { Icon } from "@/components/Icon";
import type { Localized } from "@/lib/i18n";
import type { ConversationNode, ProjectCard } from "@/types/conversation";

/** Suggestions settle in just after the answer they belong to. */
const FOLLOW_UP_GAP = 0.22;

/**
 * The one way out of an answer that missed: opens a mail composer already
 * carrying the visitor's own question. Until an address is configured it stays
 * visible but plainly inert, rather than looking like it worked.
 */
function AskDirectly({ href }: { href: string | null }) {
  const { t } = useLocale();
  const shape =
    "group inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-medium";

  if (!href) {
    return (
      <span
        aria-disabled
        className={`${shape} cursor-not-allowed border border-[var(--color-border)] text-[var(--color-ink-tertiary)]`}
      >
        {t(ui.askDirectly)}
      </span>
    );
  }

  return (
    <a
      href={href}
      style={{ backgroundColor: "var(--color-ink)", color: "var(--color-on-dark)" }}
      className={`${shape} transition-transform active:scale-[0.97]`}
    >
      {t(ui.askDirectly)}
      <Icon
        name="arrow-right"
        className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100"
      />
    </a>
  );
}

interface BotMessageProps {
  node: ConversationNode;
  showFollowUps: boolean;
  uncertain?: boolean;
  /** What the visitor typed, when this answer is replying to free text. */
  question?: string;
  animate?: boolean;
  delay?: number;
  onNavigate: (targetId: string, label: Localized) => void;
  onOpenProject: (project: ProjectCard) => void;
  onOpenExperience: (id: string) => void;
}

export function BotMessage({
  node,
  showFollowUps,
  uncertain = false,
  question,
  animate = true,
  delay = 0,
  onNavigate,
  onOpenProject,
  onOpenExperience,
}: BotMessageProps) {
  const { t, locale } = useLocale();
  // Built per message rather than stored on the node, because it carries this
  // visitor's own question. Null when no address is configured yet.
  const askHref = question ? questionMailto(question, locale) : mailtoHref;
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      {/* The answer arrives as one piece. Animating the block rather than each
          element inside it keeps the beat clean and avoids stacked fades. */}
      <motion.div
        initial={animate ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 lg:gap-5"
      >
        {uncertain && (
          <p className="text-[14px] italic leading-relaxed text-[var(--color-ink-secondary)] lg:max-w-[66ch] lg:text-[15px]">
            {t(ui.uncertain)}
          </p>
        )}

        {/* Prose keeps a readable measure even as the canvas widens; rich
            content below is free to use the full width. */}
        <div className="flex flex-col gap-2.5 lg:max-w-[66ch] lg:gap-3">
          {t(node.paragraphs).map((paragraph, index) => (
            <p
              key={index}
              className="text-[15.5px] leading-relaxed text-[var(--color-ink)] lg:text-[17px] lg:leading-[1.65]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {node.techTags?.length ? (
          <div className="lg:max-w-[66ch]">
            <TagList tags={node.techTags} />
          </div>
        ) : null}

        {node.skillClusters?.length ? (
          <div className="flex flex-col gap-4 lg:max-w-[66ch]">
            {node.skillClusters.map((cluster) => (
              <div key={cluster.heading.en}>
                <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-tertiary)]">
                  {t(cluster.heading)}
                </p>
                <TagList tags={cluster.tags} />
              </div>
            ))}
          </div>
        ) : null}

        {node.images?.map((image) => <ImageBlock key={image.src} image={image} />)}
        {node.video ? <VideoBlock video={node.video} /> : null}

        {node.projects?.length ? (
          <ProjectCardRow projects={node.projects} onOpen={onOpenProject} />
        ) : null}

        {node.experiences?.length ? (
          <JourneyList experiences={node.experiences} onOpen={onOpenExperience} />
        ) : null}

        {node.links?.length ? (
          <div className="lg:max-w-[560px]">
            <LinkRows items={node.links} />
          </div>
        ) : null}

        {node.contact?.length ? (
          <div className="lg:max-w-[560px]">
            <LinkRows items={node.contact} />
          </div>
        ) : null}

        {node.cta?.length ? <CTAButtons items={node.cta} onNavigate={onNavigate} /> : null}

        {/* Fallback: the unanswered question travels straight into an email,
            with no intervening "how do I reach you?" step. */}
        {node.id === "fallback" && <AskDirectly href={askHref} />}
      </motion.div>

      {showFollowUps && node.followUps?.length ? (
        <FollowUpChips
          items={node.followUps}
          animate={animate}
          baseDelay={animate ? delay + FOLLOW_UP_GAP : 0}
          onSelect={onNavigate}
        />
      ) : null}

      {/* Only after an approximate answer: acknowledge it may have missed, and
          give a real way through — the email itself, not another question. */}
      {uncertain && (
        <div className="flex flex-col items-start gap-2.5 border-t border-[var(--color-border)] pt-4 lg:max-w-[66ch]">
          <p className="text-[14px] leading-relaxed text-[var(--color-ink-secondary)] lg:text-[15px]">
            {t(ui.uncertainExit)}
          </p>
          <AskDirectly href={askHref} />
        </div>
      )}
    </div>
  );
}
