import { useLocale } from "@/lib/i18n";
import type { Localized } from "@/lib/i18n";
import type { CTAButton } from "@/types/conversation";

interface CTAButtonsProps {
  items: CTAButton[];
  onNavigate: (targetId: string, label: Localized) => void;
}

export function CTAButtons({ items, onNavigate }: CTAButtonsProps) {
  const { t } = useLocale();
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((cta) => {
        const isPrimary = cta.variant !== "secondary";
        const className = isPrimary
          ? "rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-[14px] font-medium text-[var(--color-on-dark)] transition-transform active:scale-[0.97]"
          : "rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-[14px] font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface)]";

        if (cta.url) {
          return (
            <a key={t(cta.label)} href={cta.url} className={className}>
              {t(cta.label)}
            </a>
          );
        }
        return (
          <button
            key={t(cta.label)}
            type="button"
            onClick={() => cta.targetId && onNavigate(cta.targetId, cta.label)}
            className={className}
          >
            {t(cta.label)}
          </button>
        );
      })}
    </div>
  );
}
