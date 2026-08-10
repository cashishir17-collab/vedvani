import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { resolveAdminSession } from "@/lib/adminAuth";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";
import PassageReviewRow from "./PassageReviewRow";
import ReportRow from "./ReportRow";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { isAdmin } = await resolveAdminSession();
  if (!isAdmin) {
    redirect("/");
  }
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";

  const [passages, reports] = await Promise.all([
    prisma.corpusPassage.findMany({ orderBy: { title: "asc" } }),
    prisma.userReport.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

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
        <h3 style={{ marginTop: 0 }}>Corpus Passages ({passages.length})</h3>
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
