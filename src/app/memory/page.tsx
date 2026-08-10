import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { resolveSession } from "@/lib/session";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";
import MemoryList from "./MemoryList";

export const dynamic = "force-dynamic";

export default async function MemoryPage() {
  const session = await resolveSession();
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";

  const items = await prisma.memoryItem.findMany({
    where: session.type === "user" ? { userId: session.userId } : { guestSessionId: session.guestId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{t(locale, "memoryTitle")}</h2>
      <p className="muted">
        This is basic, stub-level memory for this slice: opt-in notes tied to your{" "}
        {session.type === "user" ? "account" : "guest session"}, fully viewable and deletable here.
        VedVani does not use this memory for anything beyond this page yet.
      </p>
      <MemoryList
        initialItems={items.map((i) => ({ id: i.id, content: i.content, createdAt: i.createdAt.toISOString() }))}
      />
    </div>
  );
}
