import { prisma } from "./prisma";
import type { CorpusPassage } from "@prisma/client";

/**
 * Simple keyword retrieval over CorpusPassage using case-insensitive
 * `contains` matching across title, translationText, sourceWork, and
 * traditionTags. No vector DB in this slice.
 */
export async function retrievePassages(question: string, limit = 5): Promise<CorpusPassage[]> {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "what", "who", "does",
    "do", "did", "how", "why", "of", "in", "on", "to", "and", "or", "for",
    "about", "tell", "me", "please", "can", "you", "explain", "with",
  ]);

  const keywords = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  const terms = keywords.length > 0 ? keywords : [question];

  const orConditions = terms.flatMap((term) => [
    { title: { contains: term, mode: "insensitive" as const } },
    { translationText: { contains: term, mode: "insensitive" as const } },
    { sourceWork: { contains: term, mode: "insensitive" as const } },
    { traditionTags: { has: term } },
  ]);

  const matches = await prisma.corpusPassage.findMany({
    where: { OR: orConditions },
    take: limit,
  });

  if (matches.length > 0) return matches;

  // Fallback: return a small general sample so the model still has some
  // grounded context to reason from (still requires it to say when nothing
  // strongly matches).
  return prisma.corpusPassage.findMany({ take: 3 });
}
