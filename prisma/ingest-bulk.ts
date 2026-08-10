/**
 * VedVani bulk corpus ingestion
 * ====================================================================
 * Reads every `*.chunks.json.gz` file under prisma/bulk-data/, gunzips it
 * (Node's built-in zlib — no new dependency), parses the JSON array, and
 * inserts the entries into CorpusPassage via createMany() in batches.
 *
 * These files hold bulk-digitized public-domain 19th/early-20th-century
 * translations (Griffith's Rigveda, the combined Four Vedas translation,
 * Buhler's Manusmriti, Max Muller's Upanishads, and the Hanuman Chalisa).
 * Unlike prisma/seed.ts — where every entry is hand-picked/spot-checked —
 * these were verified public-domain at the book/title-page level only, not
 * line-by-line. So every row inserted here is explicitly stamped
 * reviewStatus: "unreviewed", distinguishing it from the hand-curated seed
 * set so admins can review/flag it over time via the /admin passage table.
 *
 * Idempotency: for each file, we derive the sourceWork value from its
 * first entry and count existing CorpusPassage rows with that sourceWork.
 * If that count is already >= the number of chunks in the file, we assume
 * it was already ingested and skip re-inserting it. This makes the script
 * safe to run on every deploy (see package.json `start`).
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";

const prisma = new PrismaClient();

const BULK_DATA_DIR = path.join(__dirname, "bulk-data");
const BATCH_SIZE = 500;

interface BulkChunk {
  title: string;
  sourceWork: string;
  location: string;
  language: string;
  translationText: string;
  sourceType: string;
  attribution: string;
  traditionTags: string[];
  scriptText?: string | null;
}

function readChunksFile(filePath: string): BulkChunk[] {
  const gzipped = fs.readFileSync(filePath);
  const json = zlib.gunzipSync(gzipped).toString("utf-8");
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) {
    throw new Error(`${filePath}: expected a JSON array of chunk objects`);
  }
  return parsed as BulkChunk[];
}

async function ingestFile(filePath: string) {
  const fileName = path.basename(filePath);
  const chunks = readChunksFile(filePath);

  if (chunks.length === 0) {
    console.log(`[ingest-bulk] ${fileName}: 0 chunks, skipping.`);
    return;
  }

  const sourceWork = chunks[0].sourceWork;
  const existingCount = await prisma.corpusPassage.count({ where: { sourceWork } });

  // Consider it already ingested if we already have at least as many rows
  // for this sourceWork as this file's chunk count.
  if (existingCount >= chunks.length) {
    console.log(
      `[ingest-bulk] ${fileName}: sourceWork "${sourceWork}" already has ${existingCount} rows (expected ${chunks.length}) — already ingested, skipping.`
    );
    return;
  }

  if (existingCount > 0) {
    console.log(
      `[ingest-bulk] ${fileName}: sourceWork "${sourceWork}" has ${existingCount} rows, expected ${chunks.length} — appears partially ingested; inserting the full set anyway (no unique key to dedupe rows on).`
    );
  }

  console.log(`[ingest-bulk] ${fileName}: inserting ${chunks.length} passages (sourceWork "${sourceWork}")...`);

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE).map((c) => ({
      title: c.title,
      sourceWork: c.sourceWork,
      location: c.location,
      language: c.language,
      scriptText: c.scriptText ?? null,
      translationText: c.translationText,
      sourceType: c.sourceType,
      attribution: c.attribution,
      traditionTags: c.traditionTags ?? [],
      reviewStatus: "unreviewed",
    }));

    await prisma.corpusPassage.createMany({ data: batch });
    console.log(`[ingest-bulk]   ...inserted ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length}`);
  }

  console.log(`[ingest-bulk] ${fileName}: done.`);
}

async function main() {
  if (!fs.existsSync(BULK_DATA_DIR)) {
    console.log(`[ingest-bulk] No bulk-data directory at ${BULK_DATA_DIR}, nothing to do.`);
    return;
  }

  const files = fs
    .readdirSync(BULK_DATA_DIR)
    .filter((f) => f.endsWith(".chunks.json.gz"))
    .sort();

  if (files.length === 0) {
    console.log(`[ingest-bulk] No *.chunks.json.gz files found in ${BULK_DATA_DIR}, nothing to do.`);
    return;
  }

  console.log(`[ingest-bulk] Found ${files.length} bulk data file(s) in ${BULK_DATA_DIR}.`);

  for (const file of files) {
    await ingestFile(path.join(BULK_DATA_DIR, file));
  }

  console.log("[ingest-bulk] Bulk ingestion complete.");
}

main()
  .catch((err) => {
    console.error("[ingest-bulk] Fatal error:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
