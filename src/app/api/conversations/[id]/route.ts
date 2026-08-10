import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, applyGuestCookieIfNeeded } from "@/lib/session";
import { withRequestLog } from "@/lib/requestLog";

export const dynamic = "force-dynamic";

/**
 * Phase 12: rename/pin a conversation. Ownership is checked via
 * resolveSession() the same way every other route in this app scopes
 * data — by matching either userId (logged-in) or guestSessionId (guest)
 * on the existing row before allowing the update.
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return withRequestLog({ path: "/api/conversations/[id]", method: "PATCH" }, async () => {
    const session = await resolveSession();
    const conversation = await prisma.conversation.findUnique({ where: { id: params.id } });

    const owns =
      conversation &&
      ((session.type === "user" && conversation.userId === session.userId) ||
        (session.type === "guest" && conversation.guestSessionId === session.guestId));

    if (!owns) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const data: { title?: string; pinned?: boolean } = {};

    if (typeof body?.title === "string" && body.title.trim()) {
      data.title = body.title.trim().slice(0, 200);
    }
    if (typeof body?.pinned === "boolean") {
      data.pinned = body.pinned;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "nothing to update" }, { status: 400 });
    }

    const updated = await prisma.conversation.update({ where: { id: params.id }, data });

    const res = NextResponse.json({
      conversation: { id: updated.id, title: updated.title, pinned: updated.pinned },
    });
    applyGuestCookieIfNeeded(res, session);
    return res;
  });
}
