/**
 * Hierarchy-derivation layer for the Scripture Library IA (spec section 6/13).
 *
 * CorpusPassage is a flat table keyed by (sourceWork, location) — there is
 * no Work -> Division -> Section -> Unit table in the schema. Adding that
 * hierarchy properly (a real Work/SourceNode model) is the spec's stated
 * ideal, but this sandbox cannot run `prisma migrate dev` / `prisma
 * generate` against binaries.prisma.sh (no network access to that host),
 * so a schema migration is not safely achievable here.
 *
 * Instead this module derives the family/work grouping and a lightweight
 * "ordinal" reading order from existing CorpusPassage rows at query time:
 *  - `familyOf(sourceWork)` buckets every distinct sourceWork string into
 *    one of the traditional corpus families (Vedas & Vedangas, Upanishads,
 *    Itihasa, Puranas & Upapuranas, Darshanas & Sutras, Agamas & Tantras,
 *    Dharma/Niti & Shastra, Bhakti & Regional Literature).
 *  - `parseLocation(location)` turns strings like "10.129.1-2" or "2.47"
 *    into a comparable ordinal tuple so passages can be sorted/traversed in
 *    canonical reading order instead of alphabetically; "chunk N" style
 *    locations (bulk-ingested books with no structured reference scheme
 *    yet) fall back to numeric chunk order.
 *
 * This is documented as a deliberate, pragmatic divergence from spec
 * section 13.1 in README.md ("UI/UX Redesign v1.0" section).
 */

import { prisma } from "./prisma";

export type FamilyKey =
  | "vedas"
  | "upanishads"
  | "itihasa"
  | "puranas"
  | "darshanas"
  | "agamas"
  | "dharma"
  | "bhakti";

export interface FamilyMeta {
  key: FamilyKey;
  name: string;
  description: string;
}

export const FAMILIES: FamilyMeta[] = [
  { key: "vedas", name: "Vedas & Vedangas", description: "Rigveda, Yajurveda, Samaveda, Atharvaveda and their ancillary sciences." },
  { key: "upanishads", name: "Upanishads", description: "The philosophical closing portions of the Vedas — enquiry into Self and Brahman." },
  { key: "itihasa", name: "Itihasa", description: "The great epics — Ramayana and Mahabharata (including the Bhagavad Gita)." },
  { key: "puranas", name: "Puranas & Upapuranas", description: "Cosmology, mythology and devotional narrative literature across traditions." },
  { key: "darshanas", name: "Darshanas & Sutras", description: "The classical schools of Hindu philosophy and their foundational sutras." },
  { key: "agamas", name: "Agamas & Tantras", description: "Temple, ritual and practice-oriented scripture across Shaiva, Vaishnava and Shakta lines." },
  { key: "dharma", name: "Dharma / Niti & Shastra", description: "Codes of conduct, law and social/ethical guidance texts." },
  { key: "bhakti", name: "Bhakti & Regional Literature", description: "Devotional and vernacular literature — stotras, chalisas, regional retellings." },
];

const FAMILY_BY_KEY = new Map(FAMILIES.map((f) => [f.key, f]));

const RULES: Array<{ test: RegExp; key: FamilyKey }> = [
  { test: /upanishad/i, key: "upanishads" },
  { test: /gita/i, key: "itihasa" },
  { test: /ramayan|ramcharitmanas|mahabharata|itihasa/i, key: "itihasa" },
  { test: /rigveda|yajurveda|samaveda|atharvaveda|\bvedas?\b|vedic literature|rudram|rudrashtadhyayi|rudripath/i, key: "vedas" },
  { test: /purana|bhagavata|devi mahatmya|durga saptashati|narayan kavach/i, key: "puranas" },
  { test: /darshana|nyaya|vaisheshika|samkhya|mimamsa|yoga sutra/i, key: "darshanas" },
  { test: /agama|tantra/i, key: "agamas" },
  { test: /manusmriti|dharmashastra|niti|shastra tradition/i, key: "dharma" },
  { test: /chalisa|stotra|kavach|festival tradition|devotional practice|saints and acharyas/i, key: "bhakti" },
];

export function familyOf(sourceWork: string): FamilyKey {
  for (const rule of RULES) {
    if (rule.test.test(sourceWork)) return rule.key;
  }
  return "puranas";
}

export function familyMeta(key: FamilyKey): FamilyMeta {
  return FAMILY_BY_KEY.get(key) ?? FAMILIES[0];
}

export function workSlug(sourceWork: string): string {
  return encodeURIComponent(sourceWork);
}

export function workFromSlug(slug: string): string {
  return decodeURIComponent(slug);
}

export function parseLocation(location: string): number[] {
  const chunkMatch = location.match(/^chunk\s+(\d+)/i);
  if (chunkMatch) return [Number.MAX_SAFE_INTEGER / 2, parseInt(chunkMatch[1], 10)];

  const parts = location
    .split(/[.\-–\s]+/)
    .map((p) => parseInt(p, 10))
    .filter((n) => !Number.isNaN(n));

  return parts.length > 0 ? parts : [0];
}

export function compareLocations(a: string, b: string): number {
  const pa = parseLocation(a);
  const pb = parseLocation(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export interface WorkSummary {
  sourceWork: string;
  family: FamilyKey;
  count: number;
  reviewedCount: number;
  language: string;
  sourceTypes: string[];
}

export async function listFamilies(): Promise<Array<FamilyMeta & { workCount: number; passageCount: number; reviewedCount: number }>> {
  const rows = await prisma.corpusPassage.groupBy({ by: ["sourceWork"], _count: { _all: true } });

  const reviewedRows = await prisma.corpusPassage.groupBy({
    by: ["sourceWork"],
    where: { reviewStatus: "reviewed" },
    _count: { _all: true },
  });
  const reviewedMap = new Map(reviewedRows.map((r) => [r.sourceWork, r._count._all]));

  const buckets = new Map<FamilyKey, { workCount: number; passageCount: number; reviewedCount: number }>();
  for (const f of FAMILIES) buckets.set(f.key, { workCount: 0, passageCount: 0, reviewedCount: 0 });

  for (const row of rows) {
    const key = familyOf(row.sourceWork);
    const bucket = buckets.get(key)!;
    bucket.workCount += 1;
    bucket.passageCount += row._count._all;
    bucket.reviewedCount += reviewedMap.get(row.sourceWork) ?? 0;
  }

  return FAMILIES.map((f) => ({ ...f, ...buckets.get(f.key)! }));
}

export async function listWorksInFamily(key: FamilyKey): Promise<WorkSummary[]> {
  const rows = await prisma.corpusPassage.groupBy({ by: ["sourceWork", "language"], _count: { _all: true } });

  const reviewedRows = await prisma.corpusPassage.groupBy({
    by: ["sourceWork"],
    where: { reviewStatus: "reviewed" },
    _count: { _all: true },
  });
  const reviewedMap = new Map(reviewedRows.map((r) => [r.sourceWork, r._count._all]));

  const typeRows = await prisma.corpusPassage.groupBy({ by: ["sourceWork", "sourceType"] });
  const typesMap = new Map<string, string[]>();
  for (const r of typeRows) {
    const list = typesMap.get(r.sourceWork) ?? [];
    list.push(r.sourceType);
    typesMap.set(r.sourceWork, list);
  }

  return rows
    .filter((r) => familyOf(r.sourceWork) === key)
    .map((r) => ({
      sourceWork: r.sourceWork,
      family: key,
      count: r._count._all,
      reviewedCount: reviewedMap.get(r.sourceWork) ?? 0,
      language: r.language,
      sourceTypes: typesMap.get(r.sourceWork) ?? [],
    }))
    .sort((a, b) => b.count - a.count);
}

export async function listAllWorks(): Promise<WorkSummary[]> {
  const all = await Promise.all(FAMILIES.map((f) => listWorksInFamily(f.key)));
  return all.flat();
}
