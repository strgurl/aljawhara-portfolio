import { Icon } from "@/components/Icon";
import { useLocale } from "@/lib/i18n";
import type { ContactAction, LinkItem } from "@/types/conversation";

const channelIcon: Record<ContactAction["channel"], LinkItem["icon"]> = {
  email: "mail",
  linkedin: "linkedin",
  github: "github",
  x: "x",
  calendar: "link",
  cv: "link",
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
          const divider = index !== items.length - 1 ? "border-b border-[var(--color-border)]" : "";
          const row = "flex items-center justify-between gap-3 px-4 py-3.5 text-[14.5px]";

          // No value yet: the row still shows what will be here, but is inert
          // and visibly so. Nothing pretends to be a working link.
          if (!href) {
            return (
              <div
                key={t(item.label)}
                aria-disabled
                className={`${row} ${divider} cursor-default text-[var(--color-ink-tertiary)]`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon name={icon ?? "link"} className="opacity-50" />
                  {t(item.label)}
                </span>
              </div>
            );
          }

          // Anything that isn't a mail hand-off leaves the page, and leaving
          // the page would discard the conversation. New tab for those.
          const leavesPage = !href.startsWith("mailto:");

          return (
            <a
              key={t(item.label)}
              href={href}
              target={leavesPage ? "_blank" : undefined}
              rel={leavesPage ? "noopener noreferrer" : undefined}
              className={`${row} ${divider} text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface)]`}
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
