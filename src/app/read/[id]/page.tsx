import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BookmarkButton from "./BookmarkButton";
import { familyOf, familyMeta, compareLocations, workSlug } from "@/lib/library";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const passage = await prisma.corpusPassage.findUnique({ where: { id: params.id } });
  if (!passage) return { title: "Passage not found — VedVani" };
  return {
    title: `${passage.title} — ${passage.sourceWork} — VedVani`,
    description: passage.translationText.slice(0, 155),
  };
}

export default async function ReadPassagePage({ params }: { params: { id: string } }) {
  const passage = await prisma.corpusPassage.findUnique({ where: { id: params.id } });

  if (!passage) {
    return (
      <div className="card" style={{ margin: 24 }}>
        <p>Passage not found. It may have been withdrawn or its reference changed.</p>
        <p className="muted">Reference ID: {params.id}</p>
        <a href="/library">Browse the library</a>
      </div>
    );
  }

  const family = familyOf(passage.sourceWork);
  const familyInfo = familyMeta(family);

  // TOC: sibling passages in the same work, in canonical reading order.
  const siblings = await prisma.corpusPassage.findMany({
    where: { sourceWork: passage.sourceWork },
    select: { id: true, title: true, location: true },
  });
  const sortedSiblings = [...siblings].sort((a, b) => compareLocations(a.location, b.location));
  const idx = sortedSiblings.findIndex((s) => s.id === passage.id);
  const prev = idx > 0 ? sortedSiblings[idx - 1] : null;
  const next = idx >= 0 && idx < sortedSiblings.length - 1 ? sortedSiblings[idx + 1] : null;
  const tocWindow = sortedSiblings.slice(Math.max(0, idx - 15), idx + 25);

  // Alternate interpretive layers (translation compare) at the same location.
  const siblingVariants = await prisma.corpusPassage.findMany({
    where: { sourceWork: passage.sourceWork, location: passage.location, id: { not: passage.id } },
  });

  const allEntities = await prisma.knowledgeEntity.findMany();
  const haystack = `${passage.title} ${passage.translationText}`.toLowerCase();
  const relatedEntities = allEntities.filter((e) => haystack.includes(e.name.toLowerCase()));

  return (
    <div className="vv-reader">
      <aside className="vv-reader-toc" aria-label="Contents">
        <div className="muted" style={{ fontSize: "0.8rem" }}>
          <a href={`/library/${family}`}>{familyInfo.name}</a> /{" "}
          <a href={`/library/work/${workSlug(passage.sourceWork)}`}>{passage.sourceWork}</a>
        </div>
        <h4 style={{ margin: "8px 0" }}>{passage.sourceWork}</h4>
        <form action={`/read/work/${encodeURIComponent(passage.sourceWork)}`} style={{ marginBottom: 10 }}>
          <input type="text" name="q" placeholder="Search this text..." style={{ width: "100%" }} disabled />
        </form>
        <nav aria-label="Table of contents">
          {tocWindow.map((s) => (
            <a key={s.id} href={`/read/${s.id}`} className={`vv-toc-item ${s.id === passage.id ? "active" : ""}`}>
              {s.location} — {s.title}
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          {prev ? <a href={`/read/${prev.id}`}>&larr; Prev</a> : <span />}
          {next ? <a href={`/read/${next.id}`}>Next &rarr;</a> : <span />}
        </div>
      </aside>

      <main className="vv-reader-main">
        <div className="vv-breadcrumb" style={{ marginBottom: 8 }}>
          <a href="/library">Library</a> / <a href={`/library/${family}`}>{familyInfo.name}</a> /{" "}
          <a href={`/library/work/${workSlug(passage.sourceWork)}`}>{passage.sourceWork}</a> / {passage.location}
        </div>

        <span className={`badge ${passage.sourceType}`}>{passage.sourceType}</span>
        <span className="vv-disclosure" style={{ marginLeft: 8 }}>
          {passage.reviewStatus === "reviewed" ? "Editorially reviewed" : "Unreviewed source text"}
        </span>

        <h1 style={{ margin: "10px 0 2px" }}>{passage.title}</h1>
        <div className="muted">{passage.sourceWork} · {passage.location}</div>

        {passage.scriptText && (
          <>
            <div className="vv-layer-label">Original</div>
            <div className="vv-verse-original vv-devanagari">{passage.scriptText}</div>
          </>
        )}

        <div className="vv-layer-label">Translation</div>
        <div className="vv-verse-translation">{passage.translationText}</div>

        {siblingVariants.length > 0 && (
          <>
            <div className="vv-layer-label">Additional translations</div>
            <p className="muted">
              {siblingVariants.length} alternate rendering{siblingVariants.length === 1 ? "" : "s"} available.{" "}
              <a href={`/read/${passage.id}/compare`}>Compare interpretations</a>
            </p>
          </>
        )}

        <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <BookmarkButton corpusPassageId={passage.id} />
          <a className="vv-btn secondary" href={`/ask?about=${encodeURIComponent(passage.sourceWork + " " + passage.location)}`}>
            Ask VedVani about this verse
          </a>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          {prev ? <a href={`/read/${prev.id}`}>&larr; Previous</a> : <span />}
          {next ? <a href={`/read/${next.id}`}>Next &rarr;</a> : <span />}
        </div>
      </main>

      <aside className="vv-reader-study" aria-label="Study panel">
        <div className="vv-study-tabs">
          <span className="vv-study-tab active">Sources</span>
          <span className="vv-study-tab">Related</span>
          <span className="vv-study-tab">Notes</span>
        </div>

        <div className="muted" style={{ fontSize: "0.85rem" }}>
          <strong>Attribution</strong>
          <div>{passage.attribution}</div>
        </div>

        <div className="muted" style={{ fontSize: "0.85rem", marginTop: 12 }}>
          <strong>Traditions</strong>
          <div>{passage.traditionTags.join(", ") || "general"}</div>
        </div>

        {relatedEntities.length > 0 && (
          <div className="muted" style={{ fontSize: "0.85rem", marginTop: 12 }}>
            <strong>Related</strong>
            <div>
              {relatedEntities.map((e, i) => (
                <span key={e.id}>
                  {i > 0 && ", "}
                  <a href={`/entities/${e.slug}`}>{e.name}</a>
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <a href="/api/reports" className="muted" style={{ fontSize: "0.8rem" }}>Report text error</a>
        </div>

        <div className="vv-donate-card" style={{ marginTop: 20 }}>
          <strong>Support VedVani</strong>
          <div className="muted" style={{ marginTop: 4 }}>Help fund review and digitisation of texts like this one.</div>
          <a href="/donate" className="vv-btn">Donate</a>
        </div>
      </aside>
    </div>
  );
}
