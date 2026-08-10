import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FAMILIES, familyMeta, listWorksInFamily, workSlug, type FamilyKey } from "@/lib/library";

export const dynamic = "force-dynamic";

function isFamilyKey(v: string): v is FamilyKey {
  return FAMILIES.some((f) => f.key === v);
}

export async function generateMetadata({ params }: { params: { family: string } }): Promise<Metadata> {
  if (!isFamilyKey(params.family)) return { title: "Library — VedVani" };
  const meta = familyMeta(params.family);
  return { title: `${meta.name} — VedVani Library`, description: meta.description };
}

export default async function FamilyPage({ params }: { params: { family: string } }) {
  if (!isFamilyKey(params.family)) return notFound();
  const meta = familyMeta(params.family);
  const works = await listWorksInFamily(params.family);

  return (
    <div>
      <div className="card">
        <p className="muted"><a href="/library">&larr; Hindu Scripture Library</a></p>
        <h1 style={{ marginTop: 0, color: "var(--vv-maroon)" }}>{meta.name}</h1>
        <p className="muted">{meta.description}</p>
      </div>

      {works.length === 0 && (
        <div className="vv-notice">No works ingested in this family yet. Check back soon, or ask VedVani directly — it will say honestly when it has no grounded source.</div>
      )}

      {works.map((w) => (
        <a key={w.sourceWork} href={`/library/work/${workSlug(w.sourceWork)}`} className="vv-work-row">
          <h3>{w.sourceWork}</h3>
          <span className="muted">{w.count} passages · {w.language} · {w.sourceTypes.join(", ")}</span>
          <span className={`vv-coverage-badge ${w.count > 0 && w.reviewedCount / w.count < 0.3 ? "low" : ""}`}>
            {w.reviewedCount}/{w.count} reviewed
          </span>
        </a>
      ))}
    </div>
  );
}
