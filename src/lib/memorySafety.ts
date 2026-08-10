/**
 * Phase 13 (BRD FR-MEM): sensitive-data denylist for MemoryItem writes.
 *
 * This is a deliberately simple, best-effort regex/keyword screen — not a
 * PII-detection ML model. It is meant to catch obvious cases before any
 * text is ever persisted to MemoryItem, per the BRD's requirement that
 * memory never store health conditions, caste terms, precise
 * birth date+time+location combinations, political party names, or
 * intimate/sexual content. False negatives are expected; the goal is a
 * cheap, explainable first line of defense, not perfect coverage.
 */

const HEALTH_CONDITION_KEYWORDS =
  /(diabet|cancer|hiv|aids\b|depression|anxiety disorder|schizophreni|epileps|hypertension|heart condition|bipolar|pregnan|std\b|sexually transmitted|mental illness|chronic illness)/i;

const CASTE_KEYWORDS =
  /\b(brahmin|kshatriya|vaishya|shudra|dalit|scheduled caste|scheduled tribe|\bobc\b|untouchable|jati\b)\b/i;

// Rough clustering check: date-like + time-like + place-like all present in
// the same text is treated as a precise birth date+time+location combo.
const DATE_LIKE = /\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|\d{4}-\d{2}-\d{2}|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}\b)/i;
const TIME_LIKE = /\b(\d{1,2}[:.]\d{2}\s*(am|pm)?|\d{1,2}\s*(am|pm))\b/i;
const PLACE_LIKE = /\b(born in|birthplace|hospital|city of|town of|village of)\b/i;

const POLITICAL_PARTY_KEYWORDS =
  /\b(bjp|indian national congress|\bcongress party\b|aam aadmi party|\baap\b|shiv sena|dmk|aidmk|trinamool|nationalist congress party|communist party of india|rashtriya swayamsevak sangh)\b/i;

const INTIMATE_SEXUAL_KEYWORDS =
  /\b(sex life|sexual (activity|orientation|partner)|masturbat|orgasm|erectile|libido|intimate relationship details|nude|porn)\b/i;

export function containsSensitiveContent(text: string): boolean {
  if (!text) return false;

  if (HEALTH_CONDITION_KEYWORDS.test(text)) return true;
  if (CASTE_KEYWORDS.test(text)) return true;
  if (POLITICAL_PARTY_KEYWORDS.test(text)) return true;
  if (INTIMATE_SEXUAL_KEYWORDS.test(text)) return true;

  // Birth date + time + place clustering.
  if (DATE_LIKE.test(text) && TIME_LIKE.test(text) && PLACE_LIKE.test(text)) return true;

  return false;
}
