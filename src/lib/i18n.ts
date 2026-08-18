import { createContext, useContext } from "react";

export type Locale = "en" | "ar";

/** Every user-facing string in the content layer is authored as one of these. */
export type Localized<T = string> = Record<Locale, T>;

export const LOCALES: Locale[] = ["en", "ar"];

export const localeDir: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const localeLabel: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Resolve a localized value for the active locale. */
  t: <T>(value: Localized<T>) => T;
  dir: "ltr" | "rtl";
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}

/** Shorthand for authoring content inline. */
export function L(en: string, ar: string): Localized {
  return { en, ar };
}
