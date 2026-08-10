import type { Metadata } from "next";
import { listFamilies } from "@/lib/library";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hindu Scripture Library — VedVani",
  description: "Browse the Hindu scripture corpus by family: Vedas, Upanishads, Itihasa, Puranas and more.",
};

export default async function LibraryPage() {
  const families = await listFamilies();

  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0, color: "var(--vv-maroon)" }}>Hindu Scripture Library</h1>
        <p className="muted">
          A source-grounded, cited corpus organised by family, not a flat book list. Every row shows how many
          works and passages VedVani currently has, and how much of that material has been editorially reviewed.
        </p>
      </div>

      {families.map((f) => (
        <a key={f.key} id={f.key} href={`/library/${f.key}`} className="vv-family-row">
          <h3>{f.name}</h3>
          <p className="muted" style={{ margin: "0 0 6px" }}>{f.description}</p>
          <span className="muted">{f.workCount} work{f.workCount === 1 ? "" : "s"} · {f.passageCount} passages</span>
          <span className={`vv-coverage-badge ${f.passageCount > 0 && f.reviewedCount / Math.max(1, f.passageCount) < 0.3 ? "low" : ""}`}>
            {f.passageCount === 0 ? "no material yet" : `${f.reviewedCount}/${f.passageCount} reviewed`}
          </span>
        </a>
      ))}
    </div>
  );
}
