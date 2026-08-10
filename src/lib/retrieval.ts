import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";
import type { CorpusPassage } from "@prisma/client";

/**
 * Retrieval over CorpusPassage.
 *
 * Upgraded from plain ILIKE `contains` matching to Postgres full-text
 * search (`to_tsvector` / `plainto_tsquery` / `ts_rank`) via Prisma's
 * `$queryRaw`, so results are ranked by relevance rather than just
 * "first N matches". No new npm dependencies — this only uses Postgres
 * built-ins available on any standard Postgres instance.
 *
 * It also supports a lightweight tradition-tag bias: if the user's
 * question clearly names a tradition (e.g. "what does Advaita say about
 * X"), matching passages whose traditionTags include that tradition are
 * boosted to the top of the ranking.
 */

// Known tradition tags used across the corpus (see prisma/seed.ts). Kept
// as a flat list of aliases -> canonical tag so we can recognize a few
// common spellings/phrasings in a user's question.
const TRADITION_ALIASES: Record<string, string> = {
  advaita: "Advaita",
  "non-dual": "Advaita",
  nondual: "Advaita",
  vedanta: "Vedanta",
  vaishnavism: "Vaishnavism",
  vaishnava: "Vaishnavism",
  vishnu: "Vaishnavism",
  krishna: "Vaishnavism",
  shaivism: "Shaivism",
  shaiva: "Shaivism",
  shiva: "Shaivism",
  shaktism: "Shaktism",
  shakta: "Shaktism",
  devi: "Shaktism",
  goddess: "Shaktism",
  samkhya: "Samkhya",
  sankhya: "Samkhya",
  yoga: "Yoga",
  nyaya: "Nyaya",
  vaisheshika: "Vaisheshika",
  vaisheshik: "Vaisheshika",
  mimamsa: "Mimamsa",
};

function detectTraditionTag(question: string): string | null {
  const lower = question.toLowerCase();
  for (const alias of Object.keys(TRADITION_ALIASES)) {
    if (lower.includes(alias)) {
      return TRADITION_ALIASES[alias];
    }
  }
  return null;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "what", "who", "does",
  "do", "did", "how", "why", "of", "in", "on", "to", "and", "or", "for",
  "about", "tell", "me", "please", "can", "you", "explain", "with", "say",
  "says", "said",
]);

function buildPlainTsQueryInput(question: string): string {
  const cleaned = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return (cleaned.length > 0 ? cleaned : [question]).join(" ");
}

export async function retrievePassages(question: string, limit = 5): Promise<CorpusPassage[]> {
  const tsQueryInput = buildPlainTsQueryInput(question);
  const traditionTag = detectTraditionTag(question);

  try {
    const rows = await prisma.$queryRaw<CorpusPassage[]>(Prisma.sql`
      SELECT
        cp.*,
        ts_rank(
          to_tsvector('english', cp.title || ' ' || cp."translationText" || ' ' || cp."sourceWork"),
          plainto_tsquery('english', ${tsQueryInput})
        ) AS rank,
        (CASE WHEN ${traditionTag}::text IS NOT NULL AND ${traditionTag}::text = ANY(cp."traditionTags") THEN 1 ELSE 0 END) AS tag_boost
      FROM "CorpusPassage" cp
      WHERE
        to_tsvector('english', cp.title || ' ' || cp."translationText" || ' ' || cp."sourceWork")
          @@ plainto_tsquery('english', ${tsQueryInput})
        OR (${traditionTag}::text IS NOT NULL AND ${traditionTag}::text = ANY(cp."traditionTags"))
      ORDER BY tag_boost DESC, rank DESC
      LIMIT ${limit}
    `);

    if (rows.length > 0) return rows;
  } catch (err) {
    // Full-text search can fail if, e.g., the DB user lacks permission or
    // the columns/extension aren't as expected. Fall back to a simpler
    // keyword-hit-count scoring approach rather than hard-failing the
    // whole chat request.
    console.error("[retrieval] full-text search failed, falling back to keyword scoring", err);
    return retrievePassagesByKeywordScore(question, limit, traditionTag);
  }

  // Fallback: return a small general sample so the model still has some
  // grounded context to reason from (still requires it to say when nothing
  // strongly matches).
  return prisma.corpusPassage.findMany({ take: 3 });
}

/**
 * Dependency-free fallback scorer: counts keyword hits across
 * title/translationText/traditionTags rather than relying on Postgres
 * full-text search. Used only if the $queryRaw path throws.
 */
async function retrievePassagesByKeywordScore(
  question: string,
  limit: number,
  traditionTag: string | null
): Promise<CorpusPassage[]> {
  const keywords = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  const terms = keywords.length > 0 ? keywords : [question.toLowerCase()];

  const all = await prisma.corpusPassage.findMany();

  const scored = all.map((p) => {
    const haystack = `${p.title} ${p.translationText} ${p.sourceWork}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      const occurrences = haystack.split(term).length - 1;
      score += occurrences;
    }
    if (traditionTag && p.traditionTags.includes(traditionTag)) {
      score += 5; // strong boost so a named tradition biases results
    }
    return { p, score };
  });

  const matches = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.p);

  if (matches.length > 0) return matches;

  return prisma.corpusPassage.findMany({ take: 3 });
}
