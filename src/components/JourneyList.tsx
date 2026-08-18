import { Icon } from "@/components/Icon";
import { experienceCategoryMeta, formatDateRange } from "@/data/journey";
import { useLocale } from "@/lib/i18n";
import type { ExperienceEntry } from "@/types/journey";

interface JourneyListProps {
  experiences: ExperienceEntry[];
  onOpen: (id: string) => void;
}

export function JourneyList({ experiences, onOpen }: JourneyListProps) {
  const { t, locale } = useLocale();
  if (!experiences.length) return null;

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      {experiences.map((experience, index) => {
        const meta = experienceCategoryMeta[experience.category];
        const dateLabel = formatDateRange(experience, locale);

        return (
          <button
            key={experience.id}
            type="button"
            onClick={() => onOpen(experience.id)}
            className={`group flex w-full flex-col gap-1.5 px-5 py-4 text-start transition-colors hover:bg-[var(--color-surface)] lg:grid lg:grid-cols-[190px_minmax(0,1fr)_1.75rem] lg:gap-x-8 lg:gap-y-0 lg:px-7 lg:py-6 ${
              index !== experiences.length - 1 ? "border-b border-[var(--color-border)]" : ""
            }`}
          >
            {/* Meta column — inline on mobile, stacked at the start on desktop */}
            <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start lg:gap-2">
              <span className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(${meta.colorVar})` }}
                />
                <span
                  className="text-[11.5px] font-medium uppercase tracking-wide"
                  style={{ color: `var(${meta.colorVar})` }}
                >
                  {t(meta.label)}
                </span>
              </span>
              {dateLabel && (
                <span
                  dir="ltr"
                  className="shrink-0 text-[12.5px] text-[var(--color-ink-tertiary)] lg:ps-3 lg:text-[13px]"
                >
                  {dateLabel}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 lg:gap-2">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-[15px] font-medium text-[var(--color-ink)] lg:overflow-visible lg:whitespace-normal lg:text-[17px] lg:tracking-tight">
                  {t(experience.role)}
                  <span className="font-normal text-[var(--color-ink-secondary)]">
                    {" · "}
                    {t(experience.organization)}
                  </span>
                </p>
                <Icon
                  name="chevron-right"
                  className="shrink-0 text-[var(--color-ink-tertiary)] rtl:-scale-x-100 lg:hidden"
                />
              </div>

              <p className="text-[13.5px] leading-snug text-[var(--color-ink-secondary)] lg:max-w-[62ch] lg:text-[14.5px] lg:leading-relaxed">
                {t(experience.description)}
              </p>
            </div>

            <div className="hidden lg:flex lg:items-center lg:justify-end lg:self-center">
              <Icon
                name="chevron-right"
                className="text-[var(--color-ink-tertiary)] transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
