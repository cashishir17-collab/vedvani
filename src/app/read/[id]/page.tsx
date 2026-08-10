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

  return (
    <div>
      <div className="card">
        <span className={`badge ${passage.sourceType}`}>{passage.sourceType}</span>
        <h2 style={{ marginTop: 8 }}>{passage.title}</h2>
        <div className="muted">{passage.sourceWork} · {passage.location}</div>
        <div className="muted" style={{ marginTop: 4 }}>
          Traditions: {passage.traditionTags.join(", ") || "general"}
        </div>

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
