import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Search — VedVani" };

export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (searchParams?.q ?? "").trim();
  const passages = q
    ? await prisma.corpusPassage.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { sourceWork: { contains: q, mode: "insensitive" } },
            { translationText: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 25,
      })
    : [];
  const entities = q
    ? await prisma.knowledgeEntity.findMany({ where: { name: { contains: q, mode: "insensitive" } }, take: 10 })
    : [];

  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Search chats, scriptures, saints and topics</h1>
        <form>
          <input type="text" name="q" defaultValue={q} placeholder="Search VedVani..." />
          <button type="submit" style={{ marginTop: 8 }}>Search</button>
        </form>
      </div>

      {q && entities.length > 0 && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Entities</h3>
          <div className="conversation-list">
            {entities.map((e) => (
              <a key={e.id} href={`/entities/${e.slug}`}>{e.name} <span className="muted">({e.entityType})</span></a>
            ))}
          </div>
        </div>
      )}

      {q && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Scripture passages ({passages.length})</h3>
          {passages.length === 0 ? (
            <p className="muted">No matching passages found. Try different words, or <a href={`/ask?about=${encodeURIComponent(q)}`}>ask VedVani directly</a>.</p>
          ) : (
            <div className="conversation-list">
              {passages.map((p) => (
                <a key={p.id} href={`/read/${p.id}`}>
                  <div>{p.title}</div>
                  <div className="muted">{p.sourceWork} · {p.location}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
