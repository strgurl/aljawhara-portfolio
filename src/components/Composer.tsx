import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Icon } from "@/components/Icon";
import { useLocale } from "@/lib/i18n";
import { ui } from "@/data/identity";

interface ComposerProps {
  onSend: (text: string) => void;
  /** Narrow pill on the landing, full-width once the conversation is running. */
  variant: "landing" | "compact";
}

export function Composer({ onSend, variant }: ComposerProps) {
  const { t } = useLocale();
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 rounded-full bg-[var(--color-surface)] p-1.5 ps-5 ${
        variant === "landing" ? "shadow-[var(--shadow-soft)]" : ""
      }`}
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        type="text"
        placeholder={t(ui.inputPlaceholder)}
        aria-label={t(ui.askLabel)}
        className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-tertiary)] focus:outline-none lg:text-[16px]"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        aria-label={t(ui.send)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] transition-all duration-300 disabled:opacity-30 enabled:active:scale-95 lg:h-10 lg:w-10"
      >
        <Icon name="send" />
      </button>
    </form>
  );
}
