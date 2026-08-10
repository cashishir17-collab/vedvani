import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveAdminSession } from "@/lib/adminAuth";
import PassageReviewRow from "./PassageReviewRow";
import ReportRow from "./ReportRow";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { isAdmin } = await resolveAdminSession();
  if (!isAdmin) {
    redirect("/");
  }

  const [passages, reports] = await Promise.all([
    prisma.corpusPassage.findMany({ orderBy: { title: "asc" } }),
    prisma.userReport.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Admin — Editorial Console</h2>
        <p className="muted">Review corpus passages and resolve user reports.</p>
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
