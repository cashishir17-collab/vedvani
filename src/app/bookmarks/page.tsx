import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { resolveSession } from "@/lib/session";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";
import BookmarkList from "./BookmarkList";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const session = await resolveSession();
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";

  const bookmarks = await prisma.bookmark.findMany({
    where: session.type === "user" ? { userId: session.userId } : { guestSessionId: session.guestId },
    orderBy: { createdAt: "desc" },
    include: { corpusPassage: true },
  });

  const initial = bookmarks.map((b: any) => ({
    id: b.id,
    note: b.note,
    createdAt: b.createdAt.toString(),
    corpusPassage: {
      id: b.corpusPassage.id,
      title: b.corpusPassage.title,
      sourceWork: b.corpusPassage.sourceWork,
      location: b.corpusPassage.location,
    },
  }));

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{t(locale, "bookmarksTitle")}</h2>
      {initial.length === 0 && <p className="muted">No bookmarks yet. Save passages from the Read library.</p>}
      <BookmarkList initial={initial} />
    </div>
  );
}
