import { conversationNodes } from "@/data/conversation";
import { allProjects } from "@/data/projects";
import type { Locale } from "@/lib/i18n";

/**
 * Arabic harakat + tatweel only. Written as explicit code points: the literal
 * character range that reads as "diacritics" actually spans U+0610–U+064B,
 * which swallows every Arabic letter and normalises the whole string away.
 */
const AR_DIACRITICS = /[\u064B-\u065F\u0670\u0640]/g;

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(AR_DIACRITICS, "")
    // Unify alef/ya/ta-marbuta variants so spelling differences still match.
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Words that carry no intent on their own. */
const STOPWORDS = new Set([
  // English
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "you", "your",
  "yours", "me", "my", "i", "what", "whats", "which", "who", "how", "tell", "show",
  "about", "of", "for", "in", "on", "to", "and", "or", "can", "could", "would",
  "please", "some", "any", "it", "that", "this", "with", "have", "has",
  // Arabic
  "ما", "ماهي", "وش", "شنو", "هل", "كيف", "من", "في", "على", "عن", "الى", "لي",
  "هذا", "هذه", "هو", "هي", "انت", "انتي", "لك", "لكي", "الي", "التي", "الذي",
  "و", "او", "مع", "قد", "كان", "يا", "ايش", "وشو", "بس", "لو",
]);

/**
 * Broad category words. A query containing only these is a topic gesture, not a
 * specific question — it must never reach high confidence on its own.
 */
const BROAD_TERMS = new Set([
  "project", "projects", "work", "portfolio", "skill", "skills", "stack", "tools",
  "technology", "technologies", "experience", "journey", "contact", "about",
  "مشروع", "مشاريع", "اعمال", "شغل", "شغلك", "مهارة", "مهارات", "ادوات", "تقنيات",
  "خبرة", "خبرات", "مسيرة", "تواصل", "عني",
]);

/** Strip the definite article and common possessive/plural suffixes. */
function stem(word: string): string {
  let w = word;
  if (w.length > 4 && w.startsWith("ال")) w = w.slice(2);
  if (w.length > 4) {
    for (const suffix of ["كم", "هم", "نا", "ها", "ين", "ون", "ات", "ك", "ي", "ه"]) {
      if (w.endsWith(suffix) && w.length - suffix.length >= 3) {
        w = w.slice(0, -suffix.length);
        break;
      }
    }
  }
  return w;
}

function contentTokens(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

/** Named entities (project titles) are strong specificity signals. */
const ENTITY_TERMS: { id: string; terms: string[] }[] = allProjects.map((p) => ({
  id: p.id,
  terms: [normalize(p.title), normalize(p.id)],
}));

/** Rough Arabic renderings of the project names. */
const ENTITY_ALIASES: Record<string, string[]> = {
  aurora: ["اورورا"],
  lumen: ["لومن", "لومين"],
  relay: ["ريلاي", "ريلي"],
};

export type MatchConfidence = "high" | "medium" | "low";

export interface MatchResult {
  nodeId: string | null;
  confidence: MatchConfidence;
  /** Project referenced by name, when the query mentions one. */
  entityId: string | null;
}

interface Scored {
  nodeId: string;
  score: number;
  /** Longest trigger, in words, that matched. */
  specificity: number;
  exact: boolean;
  matchedTokens: Set<string>;
}

/**
 * Deterministic, confidence-aware matching — no model call, no quota.
 *
 * Beyond picking a best node it reports how much to trust that pick, so the
 * conversation can be honest when a match is only approximate rather than
 * answering a question the visitor did not ask.
 */
export function matchTrigger(input: string, locale: Locale = "en"): MatchResult {
  const normalized = normalize(input);
  const tokens = contentTokens(input);
  if (!normalized || tokens.length === 0) {
    return { nodeId: null, confidence: "low", entityId: null };
  }

  // Named project mentioned?
  let entityId: string | null = null;
  for (const entity of ENTITY_TERMS) {
    const aliases = ENTITY_ALIASES[entity.id] ?? [];
    if ([...entity.terms, ...aliases].some((term) => term && normalized.includes(term))) {
      entityId = entity.id;
      break;
    }
  }

  const scored: Scored[] = [];

  for (const node of Object.values(conversationNodes)) {
    if (!node.triggers) continue;

    const phrases =
      locale === "en" ? node.triggers.en : [...node.triggers[locale], ...node.triggers.en];

    let score = 0;
    let specificity = 0;
    let exact = false;
    const matchedTokens = new Set<string>();

    for (const raw of phrases) {
      const trigger = normalize(raw);
      if (!trigger) continue;
      const triggerWords = trigger.split(" ").filter(Boolean);

      if (normalized === trigger) {
        exact = true;
        score += 12;
        specificity = Math.max(specificity, triggerWords.length);
        triggerWords.forEach((w) => matchedTokens.add(w));
        continue;
      }

      // Multi-word trigger appearing verbatim is a strong, specific signal.
      if (triggerWords.length > 1 && normalized.includes(trigger)) {
        score += 4 + triggerWords.length;
        specificity = Math.max(specificity, triggerWords.length);
        triggerWords.forEach((w) => matchedTokens.add(w));
        continue;
      }

      // Otherwise fall back to token overlap, discounting broad category words.
      for (const word of triggerWords) {
        if (word.length < 2 || STOPWORDS.has(word)) continue;
        const stemmed = stem(word);
        const hit = tokens.some(
          (tok) =>
            tok === stemmed ||
            (stemmed.length >= 4 && (tok.startsWith(stemmed) || stemmed.startsWith(tok))),
        );
        if (hit) {
          score += BROAD_TERMS.has(stemmed) ? 1 : 2.5;
          matchedTokens.add(stemmed);
          specificity = Math.max(specificity, BROAD_TERMS.has(stemmed) ? 0 : 1);
        }
      }
    }

    if (score > 0) scored.push({ nodeId: node.id, score, specificity, exact, matchedTokens });
  }

  if (scored.length === 0) {
    return { nodeId: null, confidence: "low", entityId };
  }

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const runnerUp = scored[1];
  const margin = best.score - (runnerUp?.score ?? 0);

  // How much of what the visitor actually asked did we account for?
  const coverage = best.matchedTokens.size / tokens.length;

  // Only broad category words matched → a topic gesture, never a precise answer.
  const onlyBroad = [...best.matchedTokens].every((w) => BROAD_TERMS.has(w) || BROAD_TERMS.has(stem(w)));

  let confidence: MatchConfidence;

  if (best.exact) {
    confidence = "high";
  } else if (entityId && !hasEntityNode(entityId)) {
    // A named project we have no dedicated node for: we can offer something
    // related, but we cannot claim to have answered the specific question.
    confidence = "medium";
  } else if (onlyBroad) {
    // e.g. bare "projects" — enough to open a topic, not to claim precision.
    confidence = coverage >= 0.75 && tokens.length <= 2 ? "high" : "medium";
  } else if (best.specificity >= 2 && coverage >= 0.5 && margin >= 2) {
    confidence = "high";
  } else if (best.score >= 2.5 && coverage >= 0.34) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return {
    nodeId: confidence === "low" ? null : best.nodeId,
    confidence,
    entityId,
  };
}

/** No per-project nodes exist yet; kept as the hook for when they do. */
function hasEntityNode(entityId: string): boolean {
  return Boolean(conversationNodes[`project-${entityId}`]);
}
