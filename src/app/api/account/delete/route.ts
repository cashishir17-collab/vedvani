import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, SESSION_COOKIE_NAME } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * Phase 14: account deletion. Requires a logged-in user and an explicit
 * `{ confirm: "DELETE" }` body field as a guard against accidental calls
 * (the /account page also requires the user to type "DELETE" client-side
 * before the button is enabled, but the real enforcement is this check).
 *
 * The schema doesn't have onDelete: Cascade wired up for user-owned rows
 * (avoided touching prisma/schema.prisma foreign keys to keep this a
 * low-risk, additive change), so this does the cascade manually inside a
 * single $transaction: delete Citations -> Messages -> Conversations,
 * MemoryItems, Bookmarks, then anonymize (not delete) UserReports by
 * nulling their userId so admins can still review report content, then
 * finally delete the User row itself.
 */
export async function POST(req: NextRequest) {
  const session = await resolveSession();

  if (session.type !== "user") {
    return NextResponse.json(
      { error: "Deleting your account requires a logged-in account." },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  if (body?.confirm !== "DELETE") {
    return NextResponse.json(
      { error: 'Confirmation required: send { "confirm": "DELETE" } to proceed.' },
      { status: 400 }
    );
  }

  const userId = session.userId;

  const conversations = await prisma.conversation.findMany({ where: { userId }, select: { id: true } });
  const conversationIds = conversations.map((c: { id: string }) => c.id);

  await prisma.$transaction([
    prisma.citation.deleteMany({
      where: { message: { conversationId: { in: conversationIds } } },
    }),
    prisma.message.deleteMany({ where: { conversationId: { in: conversationIds } } }),
    prisma.conversation.deleteMany({ where: { userId } }),
    prisma.memoryItem.deleteMany({ where: { userId } }),
    prisma.bookmark.deleteMany({ where: { userId } }),
    // Anonymize rather than delete: keep report content for admin review,
    // just remove the link back to this user.
    prisma.userReport.updateMany({ where: { userId }, data: { userId: null } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
