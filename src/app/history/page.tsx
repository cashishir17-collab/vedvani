import { prisma } from "@/lib/prisma";
import { getOrCreateGuestSession } from "@/lib/guestSession";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { guestSessionId } = await getOrCreateGuestSession();

  const conversations = await prisma.conversation.findMany({
    where: { guestSessionId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>History</h2>
      {conversations.length === 0 && <p className="muted">No conversations yet. Ask VedVani a question to get started.</p>}
      <div className="conversation-list">
        {conversations.map((c) => (
          <a key={c.id} href={`/chat/${c.id}`}>
            <div>{c.title}</div>
            <div className="muted">{new Date(c.updatedAt).toLocaleString()}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
