import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type TraditionScopedDescription = { tradition: string; description: string };

export default async function EntityDetailPage({ params }: { params: { slug: string } }) {
  const entity = await prisma.knowledgeEntity.findUnique({ where: { slug: params.slug } });

  if (!entity) {
    return (
      <div className="card">
        <p>Entity not found.</p>
      </div>
    );
  }

  const descriptions = (entity.traditionScopedDescriptions as unknown as TraditionScopedDescription[]) ?? [];

  // Related passages: same pragmatic substring-match pattern as
  // src/lib/learningPaths.ts — match any configured substring against
  // CorpusPassage.title or translationText.
  const orClauses = entity.relatedPassageTitleContains.flatMap((needle) => [
    { title: { contains: needle, mode: "insensitive" as const } },
    { translationText: { contains: needle, mode: "insensitive" as const } },
  ]);

  const relatedPassages =
    orClauses.length > 0
      ? await prisma.corpusPassage.findMany({
          where: { OR: orClauses },
          orderBy: { title: "asc" },
          take: 20,
        })
      : [];

  return (
    <div>
      <div className="card">
        <span className="muted">{entity.entityType}</span>
        <h2 style={{ marginTop: 8 }}>{entity.name}</h2>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Tradition-scoped descriptions</h3>
        <p className="muted">
          Hindu traditions describe this entity differently. VedVani presents these views side by side,
          without ranking one as more correct than another.
        </p>
        {descriptions.map((d, i) => (
          <div key={i} className="citation" style={{ marginTop: 12 }}>
            <strong>{d.tradition}</strong>
            <div style={{ marginTop: 4 }}>{d.description}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Related passages</h3>
        {relatedPassages.length === 0 && <p className="muted">No related passages found yet.</p>}
        <div className="conversation-list">
          {relatedPassages.map((p) => (
            <a key={p.id} href={`/read/${p.id}`}>
              <div>{p.title}</div>
              <div className="muted">{p.sourceWork} · {p.location}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
