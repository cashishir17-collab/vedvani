import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, applyGuestCookieIfNeeded } from "@/lib/session";

export const dynamic = "force-dynamic";

async function ownsItem(session: Awaited<ReturnType<typeof resolveSession>>, id: string) {
  const item = await prisma.memoryItem.findUnique({ where: { id } });
  const owns =
    item &&
    ((session.type === "user" && item.userId === session.userId) ||
      (session.type === "guest" && item.guestSessionId === session.guestId));
  return owns ? item : null;
}

/** Phase 13: per-item pause/resume (and content edit) for a MemoryItem. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await resolveSession();
  const item = await ownsItem(session, params.id);
  if (!item) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const data: { paused?: boolean; content?: string } = {};

  if (typeof body?.paused === "boolean") {
    data.paused = body.paused;
  }
  if (typeof body?.content === "string" && body.content.trim()) {
    data.content = body.content.trim();
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  }

  const updated = await prisma.memoryItem.update({ where: { id: params.id }, data });
  const res = NextResponse.json({ item: updated });
  applyGuestCookieIfNeeded(res, session);
  return res;
}

/** Phase 13: per-item delete for a MemoryItem, ownership-checked. */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await resolveSession();
  const item = await ownsItem(session, params.id);
  if (!item) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await prisma.memoryItem.delete({ where: { id: params.id } });
  const res = NextResponse.json({ ok: true });
  applyGuestCookieIfNeeded(res, session);
  return res;
}
