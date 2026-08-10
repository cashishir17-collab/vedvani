import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Phase 8 (BRD FR-READ-002): commentary comparison view. Given a passage,
 * show every OTHER CorpusPassage row sharing the same sourceWork+location
 * side by side (stacked on mobile via CSS), each clearly attribution- and
 * tradition-labeled, so a reader can see differing interpretive layers of
 * the same verse.
 */
export default async function ComparePage({ params }: { params: { id: string } }) {
  const passage = await prisma.corpusPassage.findUnique({ where: { id: params.id } });

  if (!passage) {
    return (
      <div className="card">
        <p>Passage not found.</p>
      </div>
    );
  }

  const siblings = await prisma.corpusPassage.findMany({
    where: { sourceWork: passage.sourceWork, location: passage.location },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Compare interpretations</h2>
        <div className="muted">{passage.sourceWork} · {passage.location}</div>
        <div style={{ marginTop: 8 }}>
          <a href={`/read/${passage.id}`}>&larr; Back to passage</a>
        </div>
      </div>

      {siblings.length <= 1 ? (
        <div className="card">
          <p className="muted">No alternate readings in our library yet for this verse.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {siblings.map((s) => (
            <div className="card" key={s.id} style={{ margin: 0 }}>
              <span className={`badge ${s.sourceType}`}>{s.sourceType}</span>
              <h3 style={{ marginTop: 8 }}>{s.title}</h3>
              <div className="muted">Traditions: {s.traditionTags.join(", ") || "general"}</div>
              <div style={{ marginTop: 12 }}>{s.translationText}</div>
              <div className="muted" style={{ marginTop: 12 }}>Attribution: {s.attribution}</div>
              <div style={{ marginTop: 12 }}>
                <a href={`/read/${s.id}`}>View full passage</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
