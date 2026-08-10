import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Saints & Acharyas — VedVani" };

export default async function SaintsPage() {
  const entities = await prisma.knowledgeEntity.findMany({ where: { entityType: "figure" }, take: 50 });
  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Saints & Acharyas</h1>
      {entities.length === 0 ? (
        <p className="muted">No saints/acharyas catalogued yet — see <a href="/entities">all entities</a> or <a href="/ask?about=Hindu saints">ask VedVani</a>.</p>
      ) : (
        <div className="conversation-list">
          {entities.map((e) => (
            <a key={e.id} href={`/saints/${e.slug}`}>{e.name}</a>
          ))}
        </div>
      )}
    </div>
  );
}
