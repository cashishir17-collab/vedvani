import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReadIndexPage() {
  const passages = await prisma.corpusPassage.findMany({ orderBy: [{ sourceWork: "asc" }, { title: "asc" }] });

  const grouped = new Map<string, typeof passages>();
  for (const p of passages) {
    const list = grouped.get(p.sourceWork) ?? [];
    list.push(p);
    grouped.set(p.sourceWork, list);
  }

  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Read the Scripture Library</h2>
        <p className="muted">Browse all passages, grouped by source work.</p>
      </div>
      {Array.from(grouped.entries()).map(([sourceWork, list]) => (
        <div className="card" key={sourceWork}>
          <h3 style={{ marginTop: 0 }}>{sourceWork}</h3>
          <div className="conversation-list">
            {list.map((p: any) => (
              <a key={p.id} href={`/read/${p.id}`}>
                <div>{p.title}</div>
                <div className="muted">{p.location} · <span className={`badge ${p.sourceType}`}>{p.sourceType}</span></div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
