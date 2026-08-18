import { Icon } from "@/components/Icon";
import { useLocale } from "@/lib/i18n";
import type { ContactAction, LinkItem } from "@/types/conversation";

const channelIcon: Record<ContactAction["channel"], LinkItem["icon"]> = {
  email: "mail",
  linkedin: "linkedin",
  github: "github",
  x: "x",
  calendar: "link",
};

interface LinkRowsProps {
  items: (LinkItem | ContactAction)[];
  heading?: string;
}

function isContactAction(item: LinkItem | ContactAction): item is ContactAction {
  return "channel" in item;
}

export function LinkRows({ items, heading }: LinkRowsProps) {
  const { t } = useLocale();
  if (!items.length) return null;

  return (
    <div>
      {heading && (
        <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-tertiary)]">
          {heading}
          <Icon name="link" className="opacity-60" />
        </div>
      )}
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        {items.map((item, index) => {
          const href = isContactAction(item) ? item.value : item.url;
          const icon = isContactAction(item) ? channelIcon[item.channel] : (item.icon ?? "link");
          return (
            <a
              key={t(item.label)}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className={`flex items-center justify-between gap-3 px-4 py-3.5 text-[14.5px] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface)] ${
                index !== items.length - 1 ? "border-b border-[var(--color-border)]" : ""
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon name={icon ?? "link"} className="text-[var(--color-ink-secondary)]" />
                {t(item.label)}
              </span>
              <Icon
                name="chevron-right"
                className="text-[var(--color-ink-tertiary)] rtl:-scale-x-100"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
