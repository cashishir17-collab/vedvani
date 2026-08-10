import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { resolveAdminSession } from "@/lib/adminAuth";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";
import PassageReviewRow from "./PassageReviewRow";
import ReportRow from "./ReportRow";

export const dynamic = "force-dynamic";

const PASSAGES_PER_PAGE = 50;

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { page?: string; sourceWork?: string; reviewStatus?: string };
}) {
  const { isAdmin } = await resolveAdminSession();
  if (!isAdmin) {
    redirect("/");
  }
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";

  // Phase: bulk corpus ingestion added ~5000 rows to CorpusPassage, so the
  // passage-review table is now paginated (50/page) and filterable by
  // sourceWork/reviewStatus rather than rendering every row unbounded.
  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1);
  const sourceWorkFilter = searchParams?.sourceWork || undefined;
  const reviewStatusFilter = searchParams?.reviewStatus || undefined;

  const passageWhere = {
    ...(sourceWorkFilter ? { sourceWork: sourceWorkFilter } : {}),
    ...(reviewStatusFilter ? { reviewStatus: reviewStatusFilter } : {}),
  };

  const [passages, passageCount, sourceWorkRows, reports] = await Promise.all([
    prisma.corpusPassage.findMany({
      where: passageWhere,
      orderBy: { title: "asc" },
      skip: (page - 1) * PASSAGES_PER_PAGE,
      take: PASSAGES_PER_PAGE,
    }),
    prisma.corpusPassage.count({ where: passageWhere }),
    prisma.corpusPassage.findMany({
      distinct: ["sourceWork"],
      select: { sourceWork: true },
      orderBy: { sourceWork: "asc" },
    }),
    prisma.userReport.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(passageCount / PASSAGES_PER_PAGE));
  const sourceWorks = sourceWorkRows.map((r: any) => r.sourceWork);

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (sourceWorkFilter) params.set("sourceWork", sourceWorkFilter);
    if (reviewStatusFilter) params.set("reviewStatus", reviewStatusFilter);
    params.set("page", String(targetPage));
    return `/admin?${params.toString()}`;
  }

  // Phase 11: admin analytics. All plain Prisma count/groupBy aggregates —
  // no charting library, no new dependencies.
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [
    conversationCount,
    messageCount,
    userCount,
    bookmarkCount,
    openReportCount,
    resolvedReportCount,
    recentRequests,
  ] = await Promise.all([
    prisma.conversation.count(),
    prisma.message.count(),
    prisma.user.count(),
    prisma.bookmark.count(),
    prisma.userReport.count({ where: { status: "open" } }),
    prisma.userReport.count({ where: { status: "resolved" } }),
    prisma.requestLog.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since24h } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
    }),
  ]);

  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{t(locale, "adminTitle")}</h2>
        <p className="muted">Review corpus passages and resolve user reports.</p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Analytics</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
          <tbody>
            <tr>
              <td>Total conversations</td>
              <td>{conversationCount}</td>
            </tr>
            <tr>
              <td>Total messages</td>
              <td>{messageCount}</td>
            </tr>
            <tr>
              <td>Total users</td>
              <td>{userCount}</td>
            </tr>
            <tr>
              <td>Total bookmarks</td>
              <td>{bookmarkCount}</td>
            </tr>
            <tr>
              <td>Open reports</td>
              <td>{openReportCount}</td>
            </tr>
            <tr>
              <td>Resolved reports</td>
              <td>{resolvedReportCount}</td>
            </tr>
          </tbody>
        </table>

        <h4>Requests in last 24h by path</h4>
        {recentRequests.length === 0 && <p className="muted">No requests logged in the last 24 hours.</p>}
        {recentRequests.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Path</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((r: any) => (
                <tr key={r.path}>
                  <td>{r.path}</td>
                  <td>{r._count._all}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Corpus Passages ({passageCount})</h3>
        <form method="get" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <label>
            Source Work:{" "}
            <select name="sourceWork" defaultValue={sourceWorkFilter ?? ""}>
              <option value="">All</option>
              {sourceWorks.map((sw: string) => (
                <option key={sw} value={sw}>
                  {sw}
                </option>
              ))}
            </select>
          </label>
          <label>
            Review Status:{" "}
            <select name="reviewStatus" defaultValue={reviewStatusFilter ?? ""}>
              <option value="">All</option>
              <option value="unreviewed">unreviewed</option>
              <option value="reviewed">reviewed</option>
              <option value="flagged">flagged</option>
            </select>
          </label>
          <button type="submit">Filter</button>
        </form>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Title</th>
              <th>Source Work</th>
              <th>Source Type</th>
              <th>Tags</th>
              <th>Review Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {passages.map((p: any) => (
              <PassageReviewRow
                key={p.id}
                id={p.id}
                title={p.title}
                sourceWork={p.sourceWork}
                sourceType={p.sourceType}
                traditionTags={p.traditionTags}
                reviewStatus={p.reviewStatus}
              />
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
            <span className="muted">
              Page {page} of {totalPages}
            </span>
            {page > 1 && <a href={pageHref(page - 1)}>&larr; Prev</a>}
            {page < totalPages && <a href={pageHref(page + 1)}>Next &rarr;</a>}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>User Reports ({reports.length})</h3>
        {reports.length === 0 && <p className="muted">No reports yet.</p>}
        {reports.map((r: any) => (
          <ReportRow
            key={r.id}
            id={r.id}
            conversationId={r.conversationId}
            messageId={r.messageId}
            note={r.note}
            status={r.status}
            createdAt={r.createdAt.toString()}
          />
        ))}
      </div>
    </div>
  );
}
