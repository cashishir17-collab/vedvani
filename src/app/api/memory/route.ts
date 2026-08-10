import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, applyGuestCookieIfNeeded } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await resolveSession();

  const items = await prisma.memoryItem.findMany({
    where: session.type === "user" ? { userId: session.userId } : { guestSessionId: session.guestId },
    orderBy: { createdAt: "desc" },
  });

  const res = NextResponse.json({ items });
  applyGuestCookieIfNeeded(res, session);
  return res;
}

export async function POST(req: NextRequest) {
  const session = await resolveSession();
  const body = await req.json();
  const content: string = (body?.content ?? "").toString().trim();

  if (!content) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const item = await prisma.memoryItem.create({
    data:
      session.type === "user"
        ? { userId: session.userId, content }
        : { guestSessionId: session.guestId, content },
  });

  const res = NextResponse.json({ item });
  applyGuestCookieIfNeeded(res, session);
  return res;
}

export async function DELETE(req: NextRequest) {
  const session = await resolveSession();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query param is required" }, { status: 400 });
  }

  const item = await prisma.memoryItem.findUnique({ where: { id } });
  const owns =
    item &&
    ((session.type === "user" && item.userId === session.userId) ||
      (session.type === "guest" && item.guestSessionId === session.guestId));

  if (!owns) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await prisma.memoryItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
