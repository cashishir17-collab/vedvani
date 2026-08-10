import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Read — VedVani",
  description: "Browse the VedVani scripture corpus: passages from the Bhagavad Gita, Upanishads, Rigveda, Puranas, and more, each with source attribution.",
};

export const dynamic = "force-dynamic";

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
