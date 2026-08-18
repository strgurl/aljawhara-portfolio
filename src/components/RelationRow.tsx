import { Icon } from "@/components/Icon";
import type { IconName } from "@/types/conversation";

export interface RelationItem {
  id: string;
  title: string;
  subtitle?: string;
  colorVar?: string;
  icon: IconName;
  onSelect: () => void;
}

function RelationRow({ title, subtitle, colorVar, icon, onSelect }: RelationItem) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3.5 text-start transition-colors hover:bg-[var(--color-surface)]"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={
            colorVar
              ? {
                  backgroundColor: `color-mix(in srgb, var(${colorVar}) 16%, transparent)`,
                  color: `var(${colorVar})`,
                }
              : undefined
          }
        >
          <Icon name={icon} className={colorVar ? undefined : "text-[var(--color-ink-secondary)]"} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14.5px] font-medium text-[var(--color-ink)]">
            {title}
          </span>
          {subtitle && (
            <span className="block truncate text-[13px] text-[var(--color-ink-secondary)]">
              {subtitle}
            </span>
          )}
        </span>
      </span>
      <Icon name="chevron-right" className="shrink-0 text-[var(--color-ink-tertiary)] rtl:-scale-x-100" />
    </button>
  );
}

interface RelationListProps {
  eyebrow: string;
  items: RelationItem[];
}

export function RelationList({ eyebrow, items }: RelationListProps) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-tertiary)]">
        {eyebrow}
      </p>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <RelationRow key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
