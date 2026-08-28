import { conversationNodes } from "@/data/conversation";
import { allProjects } from "@/data/projects";
import type { Locale } from "@/lib/i18n";

/**
 * Arabic harakat + tatweel only. Written as explicit code points: the literal
 * character range that reads as "diacritics" actually spans U+0610–U+064B,
 * which swallows every Arabic letter and normalises the whole string away.
 */
const AR_DIACRITICS = /[\u064B-\u065F\u0670\u0640]/g;

/**
 * Canonical form used on both sides of every comparison — the visitor's text
 * and the authored triggers alike. Anything folded away here stops being a
 * difference the matcher can trip over.
 *
 * Notably it collapses repeated letters, so "تااازر" and "تآزر" both land on
 * "تازر", and "umbraa" lands on "umbra". Because triggers go through the same
 * fold, doing this cannot create a mismatch of its own.
 */
export function normalize(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(AR_DIACRITICS, "")
      // Alef, ya, waw and ta-marbuta variants are spelling noise, not meaning.
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ئ/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ة/g, "ه")
      // Punctuation (both scripts) and stray combining marks become spaces.
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/(.)\1+/gu, "$1")
      .replace(/\s+/g, " ")
      .trim()
  );
}

const set = (words: string[]) => new Set(words.map(normalize).filter(Boolean));

/**
 * Words that carry no intent on their own, including the polite framing people
 * put around a question ("tell me about…", "كلميني عن…").
 */
const STOPWORDS = set([
  // English
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "you", "your",
  "yours", "me", "my", "i", "what", "whats", "which", "who", "how", "tell", "show",
  "about", "of", "for", "in", "on", "to", "and", "or", "can", "could", "would",
  "please", "some", "any", "it", "that", "this", "with", "have", "has", "want",
  // Arabic
  "ما", "ماهي", "وش", "شنو", "هل", "كيف", "من", "في", "على", "عن", "الى", "لي",
  "هذا", "هذه", "هو", "هي", "انت", "انتي", "لك", "لكي", "الي", "التي", "الذي",
  "و", "او", "مع", "قد", "كان", "يا", "ايش", "وشو", "بس", "لو", "طيب", "ممكن",
  "ابي", "ابغى", "كلميني", "احكي", "اخبريني", "قوليلي", "عطيني", "ورني", "وريني",
  "شلون", "معك", "معاك", "منك", "اقدر",
]);

/**
 * Broad category words. A query containing only these is a topic gesture, not a
 * specific question — it must never reach high confidence on its own.
 */
const BROAD_TERMS = set([
  "project", "projects", "work", "portfolio", "skill", "skills", "stack", "tools",
  "technology", "technologies", "experience", "journey", "contact", "about",
  "مشروع", "مشاريع", "اعمال", "شغل", "شغلك", "مهارة", "مهارات", "ادوات", "تقنيات",
  "خبرة", "خبرات", "مسيرة", "تواصل", "عني", "محطات", "ايميل", "بريد", "email",
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

function allTokens(text: string): string[] {
  return normalize(text).split(" ").filter(Boolean);
}

function contentTokens(text: string): string[] {
  return allTokens(text)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

/**
 * How many single-character edits a word of this length may absorb. Short words
 * get none: at four characters "work" and "worm" are one edit apart and mean
 * entirely different things.
 */
function budgetFor(length: number): number {
  if (length < 5) return 0;
  if (length < 8) return 1;
  return 2;
}

/** Levenshtein, abandoned as soon as it cannot come in under budget. */
function editDistance(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      row.push(value);
      if (value < rowMin) rowMin = value;
    }
    if (rowMin > max) return max + 1;
    prev = row;
  }
  return prev[b.length];
}

/** Same word, allowing for a small typo. Deterministic, no model involved. */
function fuzzyEqual(a: string, b: string): boolean {
  if (a === b) return true;
  const budget = budgetFor(Math.max(a.length, b.length));
  if (budget === 0) return false;
  return editDistance(a, b, budget) <= budget;
}

/**
 * Rough Arabic renderings and common misspellings of the project names.
 * Deliberately no bare "portfolio" / "بورتفوليو": that word is a topic gesture
 * toward Work, not a request for the card about this site.
 */
const ENTITY_ALIASES: Record<string, string[]> = {
  umbra: ["امبرا", "أمبرا", "عمبرا", "امبرة"],
  taazur: ["تآزر", "تازر", "تاازر", "taazor", "tazur"],
  vrlingo: ["في ار لينقو", "في آر لينقو", "في ار لينجو", "فيار لينقو", "vr lingo"],
  portfolio: ["هذا الموقع", "الموقع نفسه", "هذا البورتفوليو"],
  "fan-al-kabsa": ["فن الكبسة", "فن الكبسه", "الكبسة", "الكبسه", "fan alkabsa"],
  "ar-recipe": ["ايه ار ريسيبي", "وصفة الواقع المعزز"],
};

/**
 * Named entities are the strongest signal a visitor can give. Built from the
 * display names rather than the ids, so an id that doubles as a common word
 * cannot capture unrelated questions.
 */
const ENTITY_TERMS: { id: string; terms: string[] }[] = allProjects.map((project) => ({
  id: project.id,
  terms: [
    normalize(project.title),
    ...(project.titleLocalized ? [normalize(project.titleLocalized.ar)] : []),
    ...(ENTITY_ALIASES[project.id] ?? []).map(normalize),
  ].filter(Boolean),
}));

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

const entityNodeId = (entityId: string) => `project-${entityId}`;

/** True when a named project has a conversation node of its own to answer from. */
function hasEntityNode(entityId: string): boolean {
  return Boolean(conversationNodes[entityNodeId(entityId)]);
}

/** Does this node belong to the named project — its card, or one of its questions? */
function inEntityFamily(nodeId: string, entityId: string): boolean {
  return nodeId === entityNodeId(entityId) || nodeId.startsWith(`${entityId}-`);
}

/** A project named outright, allowing for spelling and small typos. */
function findEntity(normalized: string, tokens: string[]): string | null {
  // Exact first: a full name appearing verbatim beats any fuzzy reading.
  for (const entity of ENTITY_TERMS) {
    if (entity.terms.some((term) => normalized.includes(term))) return entity.id;
  }
  // Then single-word names within a typo of something the visitor typed.
  for (const entity of ENTITY_TERMS) {
    for (const term of entity.terms) {
      if (term.includes(" ")) continue;
      if (tokens.some((token) => fuzzyEqual(token, term))) return entity.id;
    }
  }
  return null;
}

/**
 * Deterministic, confidence-aware matching — no model call, no quota.
 *
 * Beyond picking a best node it reports how much to trust that pick, so the
 * conversation can be honest when a match is only approximate rather than
 * answering a question the visitor did not ask.
 *
 * Order of authority: an exact trigger, then a full phrase appearing inside the
 * question, then a named project, then token overlap, then nothing.
 */
export function matchTrigger(input: string, locale: Locale = "en"): MatchResult {
  const normalized = normalize(input);
  const raw = allTokens(input);
  const tokens = contentTokens(input);
  // "who are you" is entirely stopwords, yet it is one of the most likely
  // questions asked. Phrase matching below still resolves it, so an empty token
  // list is not on its own a reason to give up.
  if (!normalized) {
    return { nodeId: null, confidence: "low", entityId: null };
  }

  const entityId = findEntity(normalized, raw);

  const scored: Scored[] = [];

  for (const node of Object.values(conversationNodes)) {
    if (!node.triggers) continue;

    const phrases =
      locale === "en" ? node.triggers.en : [...node.triggers[locale], ...node.triggers.en];

    let score = 0;
    let specificity = 0;
    let exact = false;
    const matchedTokens = new Set<string>();

    for (const phrase of phrases) {
      const trigger = normalize(phrase);
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

      // Otherwise fall back to token overlap, discounting broad category words
      // and scoring a typo slightly below a clean hit.
      for (const word of triggerWords) {
        if (word.length < 2 || STOPWORDS.has(word)) continue;
        const stemmed = stem(word);
        const broad = BROAD_TERMS.has(stemmed) || BROAD_TERMS.has(word);

        const clean = tokens.some(
          (tok) =>
            tok === stemmed ||
            (stemmed.length >= 4 && (tok.startsWith(stemmed) || stemmed.startsWith(tok))),
        );
        const fuzzy = !clean && tokens.some((tok) => fuzzyEqual(tok, stemmed));
        if (!clean && !fuzzy) continue;

        score += broad ? 1 : clean ? 2.5 : 2;
        matchedTokens.add(stemmed);
        specificity = Math.max(specificity, broad ? 0 : 1);
      }
    }

    if (score > 0) scored.push({ nodeId: node.id, score, specificity, exact, matchedTokens });
  }

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const runnerUp = scored[1];

  // A project named outright, that we have a card for, is as specific as a
  // visitor gets. It wins unless something stronger and unrelated matched —
  // "what's your email" mentioning a project shouldn't open that project.
  if (entityId && hasEntityNode(entityId)) {
    if (!best || best.score < 4) {
      return { nodeId: entityNodeId(entityId), confidence: "high", entityId };
    }
    if (inEntityFamily(best.nodeId, entityId)) {
      return { nodeId: best.nodeId, confidence: "high", entityId };
    }
  }

  if (!best) {
    return { nodeId: null, confidence: "low", entityId };
  }

  const margin = best.score - (runnerUp?.score ?? 0);

  // How much of what the visitor actually asked did we account for? A question
  // made only of stopwords has nothing to cover, so a phrase hit is all of it.
  const coverage = tokens.length ? best.matchedTokens.size / tokens.length : best.exact ? 1 : 0;

  // Only broad category words matched → a topic gesture, never a precise answer.
  const onlyBroad = [...best.matchedTokens].every(
    (w) => BROAD_TERMS.has(w) || BROAD_TERMS.has(stem(w)),
  );

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
