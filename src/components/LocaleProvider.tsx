import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { LocaleContext, localeDir, type Locale, type Localized } from "@/lib/i18n";

interface LocaleProviderProps {
  initial?: Locale;
  children: ReactNode;
}

export function LocaleProvider({ initial = "en", children }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initial);
  const dir = localeDir[locale];

  // Direction and language live on <html> so native text handling, form
  // controls and logical CSS properties all behave correctly.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
  }, [locale, dir]);

  const t = useCallback(
    <T,>(value: Localized<T>): T => value[locale],
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t, dir }), [locale, t, dir]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
