import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/Icon";
import { useLocale } from "@/lib/i18n";
import { ui } from "@/data/identity";

interface DetailSheetShellProps {
  open: boolean;
  onClose: () => void;
  /** Changes whenever the displayed content changes, so the sheet can reset scroll. */
  contentKey?: string;
  children: ReactNode;
}

/**
 * Shared chrome for full-screen detail sheets (backdrop, slide-up panel,
 * close button, scroll container). Content is passed as children so the
 * same shell can host either a project or an experience, and swapping
 * between them can crossfade without the shell itself remounting.
 */
export function DetailSheetShell({ open, onClose, contentKey, children }: DetailSheetShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<Element | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  /**
   * Move focus into the sheet when it opens and hand it back to whatever
   * opened it on close. Without this a keyboard visitor stays on the card
   * behind the backdrop, tabbing through content they can no longer see.
   */
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement;
    closeRef.current?.focus();
    return () => {
      const target = returnFocusRef.current;
      if (target instanceof HTMLElement && document.contains(target)) target.focus();
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [contentKey]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            // A click-catcher, not content: the close button is the labelled
            // way out, so screen readers should not meet this at all.
            aria-hidden
            className="absolute inset-0 bg-[rgba(20,19,15,0.42)] backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t(ui.detailsLabel)}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="relative flex max-h-[88vh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[var(--radius-xl)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sheet)] sm:max-h-[85vh] sm:rounded-[var(--radius-xl)] lg:max-h-[82vh] lg:max-w-[720px] xl:max-w-[780px]"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t(ui.closeDetails)}
              className="absolute end-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-strong)] lg:end-7 lg:top-7 lg:h-10 lg:w-10"
            >
              <Icon name="close" />
            </button>

            <div
              ref={scrollRef}
              className="overflow-y-auto px-6 pb-8 pt-8 sm:px-8 lg:px-12 lg:pb-12 lg:pt-12"
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
