import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateGuestSession, GUEST_COOKIE_NAME } from "@/lib/guestSession";

export const dynamic = "force-dynamic";

export async function GET() {
  const { guestSessionId, isNew } = await getOrCreateGuestSession();

  const conversations = await prisma.conversation.findMany({
    where: { guestSessionId },
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

  if (isNew) {
    res.cookies.set(GUEST_COOKIE_NAME, guestSessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return res;
}
