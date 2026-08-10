import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { familyOf, familyMeta, workFromSlug, compareLocations } from "@/lib/library";

export const dynamic = "force-dynamic";
const PREVIEW_COUNT = 12;

export async function generateMetadata({ params }: { params: { work: string } }): Promise<Metadata> {
  const sourceWork = workFromSlug(params.work);
  return { title: `${sourceWork} — VedVani Library`, description: `Overview, structure and available text layers for ${sourceWork}.` };
}

export default async function WorkOverviewPage({ params }: { params: { work: string } }) {
  const sourceWork = workFromSlug(params.work);
  const family = familyOf(sourceWork);
  const meta = familyMeta(family);

  const passages = await prisma.corpusPassage.findMany({ where: { sourceWork } });
  if (passages.length === 0) {
    return (
      <div className="card">
        <p className="muted"><a href={`/library/${family}`}>&larr; {meta.name}</a></p>
        <p>No passages found for &ldquo;{sourceWork}&rdquo;.</p>
      </div>
    );
  }

  const sorted = [...passages].sort((a, b) => compareLocations(a.location, b.location));
  const preview = sorted.slice(0, PREVIEW_COUNT);
  const reviewedCount = passages.filter((p) => p.reviewStatus === "reviewed").length;
  const traditionTags = Array.from(new Set(passages.flatMap((p) => p.traditionTags)));
  const sourceTypes = Array.from(new Set(passages.map((p) => p.sourceType)));
  const hasScript = passages.some((p) => p.scriptText);
  const language = passages[0].language;
  const attribution = passages[0].attribution;

  return (
    <div>
      <div className="card">
        <p className="muted"><a href={`/library/${family}`}>&larr; {meta.name}</a></p>
        <h1 style={{ marginTop: 0, color: "var(--vv-maroon)" }}>{sourceWork}</h1>
        <p className="muted">
          Part of the {meta.name} family. {passages.length} passages currently in the VedVani corpus
          ({reviewedCount} editorially reviewed, {passages.length - reviewedCount} unreviewed/bulk-ingested).
        </p>
        <div className="muted">Traditions: {traditionTags.join(", ") || "general"}</div>
        <div className="muted">Text layers available: {sourceTypes.join(", ")}{hasScript ? ", original script" : ""}</div>
        <div className="muted">Language: {language} · Attribution: {attribution}</div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="vv-btn" href={`/read/${preview[0].id}`}>Continue Reading</a>
          <a className="vv-btn secondary" href={`/read/work/${encodeURIComponent(sourceWork)}`}>Full contents</a>
          <a className="vv-btn secondary" href={`/ask?about=${encodeURIComponent(sourceWork)}`}>Ask VedVani about this work</a>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Contents preview</h3>
        <div className="conversation-list">
          {preview.map((p) => (
            <a key={p.id} href={`/read/${p.id}`}>
              <div>{p.title}</div>
              <div className="muted">{p.location} · <span className={`badge ${p.sourceType}`}>{p.sourceType}</span></div>
            </a>
          ))}
        </div>
        {passages.length > PREVIEW_COUNT && (
          <p className="muted" style={{ marginTop: 10 }}>
            Showing first {PREVIEW_COUNT} of {passages.length} — <a href={`/read/work/${encodeURIComponent(sourceWork)}`}>see full contents tree</a>.
          </p>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Related learning paths</h3>
        <p className="muted">Guided sequences that reference this work are listed on the <a href="/learn">Learning Paths</a> page.</p>
      </div>
    </div>
  );
}
