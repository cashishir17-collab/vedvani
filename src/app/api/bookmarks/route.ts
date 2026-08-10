import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, applyGuestCookieIfNeeded } from "@/lib/session";
import { withRequestLog } from "@/lib/requestLog";

export const dynamic = "force-dynamic";

export async function GET() {
  return withRequestLog({ path: "/api/bookmarks", method: "GET" }, async () => {
    const session = await resolveSession();

    const bookmarks = await prisma.bookmark.findMany({
      where: session.type === "user" ? { userId: session.userId } : { guestSessionId: session.guestId },
      orderBy: { createdAt: "desc" },
      include: { corpusPassage: true },
    });

    const res = NextResponse.json({
      bookmarks: bookmarks.map((b: any) => ({
        id: b.id,
        note: b.note,
        createdAt: b.createdAt,
        corpusPassage: {
          id: b.corpusPassage.id,
          title: b.corpusPassage.title,
          sourceWork: b.corpusPassage.sourceWork,
          location: b.corpusPassage.location,
          sourceType: b.corpusPassage.sourceType,
        },
      })),
    });

    applyGuestCookieIfNeeded(res, session);
    return res;
  });
}

export async function POST(req: NextRequest) {
  return withRequestLog({ path: "/api/bookmarks", method: "POST" }, async () => {
    const session = await resolveSession();
    const body = await req.json().catch(() => ({}));
    const corpusPassageId: string = (body?.corpusPassageId ?? "").toString();
    const note: string | undefined = body?.note ? body.note.toString() : undefined;

    if (!corpusPassageId) {
      return NextResponse.json({ error: "corpusPassageId is required" }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data:
        session.type === "user"
          ? { userId: session.userId, corpusPassageId, note }
          : { guestSessionId: session.guestId, corpusPassageId, note },
    });

    const res = NextResponse.json({ bookmark });
    applyGuestCookieIfNeeded(res, session);
    return res;
  });
}

export async function DELETE(req: NextRequest) {
  return withRequestLog({ path: "/api/bookmarks", method: "DELETE" }, async () => {
    const session = await resolveSession();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id query param is required" }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.findUnique({ where: { id } });
    const owns =
      bookmark &&
      ((session.type === "user" && bookmark.userId === session.userId) ||
        (session.type === "guest" && bookmark.guestSessionId === session.guestId));

    if (!owns) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    await prisma.bookmark.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  });
}
