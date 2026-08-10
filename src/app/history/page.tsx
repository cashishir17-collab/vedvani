import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { resolveSession } from "@/lib/session";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const session = await resolveSession();
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";

  const conversations = await prisma.conversation.findMany({
    where: session.type === "user" ? { userId: session.userId } : { guestSessionId: session.guestId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{t(locale, "historyTitle")}</h2>
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
