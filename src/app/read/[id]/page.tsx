import { prisma } from "@/lib/prisma";
import BookmarkButton from "./BookmarkButton";

export const dynamic = "force-dynamic";

export default async function ReadPassagePage({ params }: { params: { id: string } }) {
  const passage = await prisma.corpusPassage.findUnique({ where: { id: params.id } });

  if (!passage) {
    return (
      <div className="card">
        <p>Passage not found.</p>
      </div>
    );
  }

  // Phase 8: does this verse have alternate interpretive layers? Only show
  // the "Compare interpretations" link when true siblings exist.
  const siblingCount = await prisma.corpusPassage.count({
    where: {
      sourceWork: passage.sourceWork,
      location: passage.location,
      id: { not: passage.id },
    },
  });

  // Phase 7: lightweight "related entities" mention — any KnowledgeEntity
  // whose name appears as a substring of this passage's title or
  // translationText.
  const allEntities = await prisma.knowledgeEntity.findMany();
  const haystack = `${passage.title} ${passage.translationText}`.toLowerCase();
  const relatedEntities = allEntities.filter((e) => haystack.includes(e.name.toLowerCase()));

  return (
    <div>
      <div className="card">
        <span className={`badge ${passage.sourceType}`}>{passage.sourceType}</span>
        <h2 style={{ marginTop: 8 }}>{passage.title}</h2>
        <div className="muted">{passage.sourceWork} · {passage.location}</div>
        <div className="muted" style={{ marginTop: 4 }}>
          Traditions: {passage.traditionTags.join(", ") || "general"}
        </div>

        {relatedEntities.length > 0 && (
          <div className="muted" style={{ marginTop: 4 }}>
            Related:{" "}
            {relatedEntities.map((e, i) => (
              <span key={e.id}>
                {i > 0 && ", "}
                <a href={`/entities/${e.slug}`}>{e.name}</a>
              </span>
            ))}
          </div>
        )}

        {siblingCount > 0 && (
          <div style={{ marginTop: 8 }}>
            <a href={`/read/${passage.id}/compare`}>Compare interpretations</a>
          </div>
        )}

        {passage.scriptText && (
          <div style={{ marginTop: 20 }}>
            <div className="muted">Original text</div>
            <div style={{ fontSize: "1.15rem", marginTop: 4 }}>{passage.scriptText}</div>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <div className="muted">Translation</div>
          <div style={{ marginTop: 4 }}>{passage.translationText}</div>
        </div>

        <div className="muted" style={{ marginTop: 20 }}>Attribution: {passage.attribution}</div>

        <div style={{ marginTop: 20 }}>
          <BookmarkButton corpusPassageId={passage.id} />
        </div>
      </div>
    </div>
  );
}
