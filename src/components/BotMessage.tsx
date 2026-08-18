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
import { Icon } from "@/components/Icon";
import type { Localized } from "@/lib/i18n";
import type { ConversationNode, ProjectCard } from "@/types/conversation";

/** Suggestions settle in just after the answer they belong to. */
const FOLLOW_UP_GAP = 0.22;

interface BotMessageProps {
  node: ConversationNode;
  showFollowUps: boolean;
  uncertain?: boolean;
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
  animate = true,
  delay = 0,
  onNavigate,
  onOpenProject,
  onOpenExperience,
}: BotMessageProps) {
  const { t } = useLocale();
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
          give a real way through. Never shown on a confident answer. */}
      {uncertain && (
        <div className="flex flex-col items-start gap-2.5 border-t border-[var(--color-border)] pt-4 lg:max-w-[66ch]">
          <p className="text-[14px] leading-relaxed text-[var(--color-ink-secondary)] lg:text-[15px]">
            {t(ui.uncertainExit)}
          </p>
          <button
            type="button"
            onClick={() => onNavigate("contact", ui.askDirectly)}
            style={{
              backgroundColor: "var(--color-ink)",
              color: "var(--color-on-dark)",
            }}
            className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-medium transition-transform active:scale-[0.97]"
          >
            {t(ui.askDirectly)}
            <Icon
              name="arrow-right"
              className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100"
            />
          </button>
        </div>
      )}
    </div>
  );
}
