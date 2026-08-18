import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Hero, NameWatermark } from "@/components/Hero";
import { Character } from "@/components/Character";
import { MessageStream } from "@/components/MessageStream";
import { TopicChips } from "@/components/TopicChips";
import { Composer } from "@/components/Composer";
import { AmbientField } from "@/components/AmbientField";
import { DetailSheetShell } from "@/components/DetailSheetShell";
import { ProjectDetailContent } from "@/components/ProjectDetailContent";
import { ExperienceDetailContent } from "@/components/ExperienceDetailContent";
import { useConversation } from "@/hooks/useConversation";
import { projectsById } from "@/data/projects";
import { experiencesById } from "@/data/journey";
import { identity, ui } from "@/data/identity";
import { useLocale } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { ProjectCard } from "@/types/conversation";

type ActiveDetail = { type: "project"; id: string } | { type: "experience"; id: string } | null;

const EASE = [0.22, 1, 0.36, 1] as const;

function App() {
  const { locale, t } = useLocale();
  const {
    thread,
    activeTopicId,
    isTyping,
    hasStarted,
    openTopic,
    returnHome,
    navigateTo,
    sendFreeText,
    lastBotEntryId,
  } = useConversation();

  const [activeDetail, setActiveDetail] = useState<ActiveDetail>(null);
  const scrollRef = useRef<HTMLElement>(null);

  const openProject = (id: string) => setActiveDetail({ type: "project", id });
  const openExperience = (id: string) => setActiveDetail({ type: "experience", id });

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      {/* Landing only: the field fades out and the simulation unmounts once the
          conversation begins, so the chat sits on a plain background. */}
      <AnimatePresence>{!hasStarted && <AmbientField key="fluid" />}</AnimatePresence>
      {!hasStarted && <NameWatermark />}

      <div className="pointer-events-auto absolute end-5 top-5 z-30 lg:end-7 lg:top-6">
        <LanguageToggle />
      </div>

      <div
        inert={activeDetail !== null}
        className="relative z-10 mx-auto flex h-full w-full max-w-[680px] flex-col px-5 lg:max-w-[760px]"
      >
        {hasStarted ? (
          <>
            <header className="flex shrink-0 justify-center pb-3 pt-6 lg:pt-8">
              <Character
                layoutId="character"
                size={44}
                pose="neutral"
                name={t(identity.name)}
                label={t(ui.backHome)}
                onActivate={returnHome}
              />
            </header>

            <main ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto pb-4">
              {/* Keyed on topic: switching conversations replaces the thread
                  rather than cross-fading two histories over each other. */}
              <motion.div
                key={activeTopicId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, ease: EASE }}
              >
                <MessageStream
                  thread={thread}
                  lastBotEntryId={lastBotEntryId}
                  isTyping={isTyping}
                  scrollRef={scrollRef}
                  onNavigate={navigateTo}
                  onOpenProject={(project: ProjectCard) => openProject(project.id)}
                  onOpenExperience={openExperience}
                />
              </motion.div>
            </main>
          </>
        ) : (
          /* Landing reads as one grouped composition — identity, character,
             composer and topics belong together, not split to opposite edges. */
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center pb-10 lg:pb-16">
            <Hero />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.22 }}
              className="mt-9 flex w-full flex-col items-center gap-3.5 lg:mt-11"
            >
              <div className="w-full max-w-[400px] lg:max-w-[440px]">
                <Composer variant="landing" onSend={(text) => sendFreeText(text, locale)} />
              </div>
              <TopicChips activeTopicId={null} variant="landing" onSelect={openTopic} />
            </motion.div>
          </div>
        )}

        {hasStarted && (
          <div className="shrink-0 pb-7 pt-2 lg:pb-9">
            <div className="flex flex-col gap-3">
              <TopicChips activeTopicId={activeTopicId} variant="compact" onSelect={openTopic} />
              <Composer variant="compact" onSend={(text) => sendFreeText(text, locale)} />
            </div>
          </div>
        )}
      </div>

      <DetailSheetShell
        open={activeDetail !== null}
        onClose={() => setActiveDetail(null)}
        contentKey={activeDetail ? `${activeDetail.type}-${activeDetail.id}` : undefined}
      >
        <AnimatePresence mode="wait">
          {activeDetail?.type === "project" && projectsById[activeDetail.id] && (
            <ProjectDetailContent
              key={`project-${activeDetail.id}`}
              project={projectsById[activeDetail.id]}
              onOpenExperience={openExperience}
            />
          )}
          {activeDetail?.type === "experience" && experiencesById[activeDetail.id] && (
            <ExperienceDetailContent
              key={`experience-${activeDetail.id}`}
              experience={experiencesById[activeDetail.id]}
              onOpenProject={openProject}
            />
          )}
        </AnimatePresence>
      </DetailSheetShell>
    </div>
  );
}

export default App;
