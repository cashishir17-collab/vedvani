import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LEARNING_PATHS } from "@/lib/learningPaths";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const path = LEARNING_PATHS.find((p) => p.slug === params.slug);
  if (!path) {
    return { title: "Learning path not found — VedVani" };
  }
  return {
    title: `${path.title} — VedVani`,
    description: path.description.slice(0, 155),
  };
}

export default async function LearningPathPage({ params }: { params: { slug: string } }) {
  const path = LEARNING_PATHS.find((p) => p.slug === params.slug);

  if (!path) {
    return (
      <div className="card">
        <p>Learning path not found.</p>
      </div>
    );
  }

  const matchedLists = await Promise.all(
    path.titleMatches.map((titleMatch) =>
      prisma.corpusPassage.findMany({
        where: { title: { contains: titleMatch, mode: "insensitive" } },
        take: 1,
      })
    )
  );

  const passages = matchedLists.flat();

  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{path.title}</h2>
        <p className="muted">{path.description}</p>
      </div>
      <div className="card">
        <div className="conversation-list">
          {passages.map((p, i) => (
            <a key={p.id} href={`/read/${p.id}`}>
              <div>{i + 1}. {p.title}</div>
              <div className="muted">{p.sourceWork} · {p.location} · <span className={`badge ${p.sourceType}`}>{p.sourceType}</span></div>
            </a>
          ))}
          {passages.length === 0 && <p className="muted">No matching passages found.</p>}
        </div>
      </div>
    </div>
  );
}
