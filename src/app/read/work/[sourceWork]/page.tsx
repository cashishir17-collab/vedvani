import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const PER_PAGE = 50;

export async function generateMetadata({
  params,
}: {
  params: { sourceWork: string };
}): Promise<Metadata> {
  const sourceWork = decodeURIComponent(params.sourceWork);
  return {
    title: `${sourceWork} — VedVani`,
    description: `All passages from ${sourceWork} in the VedVani scripture corpus.`,
  };
}

export default async function ReadWorkPage({
  params,
  searchParams,
}: {
  params: { sourceWork: string };
  searchParams?: { page?: string };
}) {
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";
  const sourceWork = decodeURIComponent(params.sourceWork);

  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1);

  const [passages, total] = await Promise.all([
    prisma.corpusPassage.findMany({
      where: { sourceWork },
      orderBy: { title: "asc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.corpusPassage.count({ where: { sourceWork } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div>
      <div className="card">
        <p className="muted">
          <a href="/read">&larr; {t(locale, "readTitle")}</a>
        </p>
        <h2 style={{ marginTop: 0 }}>
          {sourceWork} <span className="muted">({total})</span>
        </h2>
      </div>
      <div className="card">
        <div className="conversation-list">
          {passages.map((p: any) => (
            <a key={p.id} href={`/read/${p.id}`}>
              <div>{p.title}</div>
              <div className="muted">
                {p.location} · <span className={`badge ${p.sourceType}`}>{p.sourceType}</span>
              </div>
            </a>
          ))}
        </div>
        {totalPages > 1 && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
            <span className="muted">
              Page {page} of {totalPages}
            </span>
            {page > 1 && (
              <a href={`/read/work/${encodeURIComponent(sourceWork)}?page=${page - 1}`}>&larr; Prev</a>
            )}
            {page < totalPages && (
              <a href={`/read/work/${encodeURIComponent(sourceWork)}?page=${page + 1}`}>Next &rarr;</a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
