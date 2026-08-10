import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, applyGuestCookieIfNeeded } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await resolveSession();

  const conversations = await prisma.conversation.findMany({
    where: session.type === "user" ? { userId: session.userId } : { guestSessionId: session.guestId },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 1 } },
  });

  const res = NextResponse.json({
    conversations: conversations.map((c) => ({
      id: c.id,
      title: c.title,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
  });

  applyGuestCookieIfNeeded(res, session);

  return res;
}
