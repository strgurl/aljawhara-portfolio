import type { Locale } from "@/lib/i18n";

/**
 * The single place every contact route reads from. Anything that depends on a
 * value renders only while that value is set, so clearing one back to null
 * removes its action everywhere rather than leaving a link that goes nowhere.
 *
 *   email    plain address; the mailto: is built from it automatically
 *   linkedin full profile URL
 *   cv       a path under public/
 *
 * No phone number is exposed anywhere by design.
 */
export const CONTACT: Record<"email" | "linkedin" | "cv", string | null> = {
  email: "almoikelja@gmail.com",
  linkedin: "https://www.linkedin.com/in/jawharaal",
  cv: "/cv.pdf",
};

/** Plain mailto, or null when no address is configured. */
export const mailtoHref = CONTACT.email ? `mailto:${CONTACT.email}` : null;

const SUBJECT: Record<Locale, string> = {
  en: "Portfolio question",
  ar: "سؤال من البورتفوليو",
};

const GREETING: Record<Locale, string> = {
  en: "Hi Aljawhara,\nI was looking through your portfolio and had a question:",
  ar: "السلام عليكم الجوهرة،\nكنت أتصفح بورتفوليوك وعندي سؤال:",
};

/**
 * A mailto carrying the visitor's own question, so the unanswered question
 * survives the fallback instead of having to be retyped.
 *
 * Returns null when there is no address yet, which is the signal to hide the
 * button entirely rather than render a dead link.
 */
export function questionMailto(question: string, locale: Locale): string | null {
  if (!CONTACT.email) return null;
  const body = `${GREETING[locale]}\n\n"${question.trim()}"`;
  const params = new URLSearchParams({ subject: SUBJECT[locale], body });
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${CONTACT.email}?${params.toString().replace(/\+/g, "%20")}`;
}
