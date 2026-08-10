import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Read — VedVani",
  description: "Browse the VedVani scripture corpus: passages from the Bhagavad Gita, Upanishads, Rigveda, Puranas, and more, each with source attribution.",
};

export const dynamic = "force-dynamic";

// Bulk corpus ingestion (~5000 rows across a handful of sourceWork groups,
// e.g. the combined Four Vedas translation) means some groups are far too
// large to render in full on this index page. Each group now shows only
// its first PREVIEW_COUNT passages plus a link to a paginated "see all"
// page for that sourceWork when it has more.
const PREVIEW_COUNT = 20;

export default async function ReadIndexPage() {
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";
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
        <h2 style={{ marginTop: 0 }}>{t(locale, "readTitle")}</h2>
        <p className="muted">{t(locale, "readIntro")}</p>
      </div>
      {Array.from(grouped.entries()).map(([sourceWork, list]) => {
        const preview = list.slice(0, PREVIEW_COUNT);
        const remaining = list.length - preview.length;
        return (
          <div className="card" key={sourceWork}>
            <h3 style={{ marginTop: 0 }}>
              {sourceWork} <span className="muted">({list.length})</span>
            </h3>
            <div className="conversation-list">
              {preview.map((p: any) => (
                <a key={p.id} href={`/read/${p.id}`}>
                  <div>{p.title}</div>
                  <div className="muted">{p.location} · <span className={`badge ${p.sourceType}`}>{p.sourceType}</span></div>
                </a>
              ))}
            </div>
            {remaining > 0 && (
              <p style={{ marginBottom: 0 }}>
                <a href={`/read/work/${encodeURIComponent(sourceWork)}`}>
                  See all {list.length} passages for {sourceWork} &rarr;
                </a>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
