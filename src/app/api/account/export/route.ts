import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * Phase 14: full data export for a logged-in user (BRD data-portability
 * requirement). Guests don't have a durable identity to export against,
 * so this requires an account — mirrors the pattern used elsewhere in the
 * app of gating account-only features on `session.type === "user"`.
 */
export async function GET() {
  const session = await resolveSession();

  if (session.type !== "user") {
    return NextResponse.json(
      { error: "Exporting your data requires a logged-in account. Please log in first." },
      { status: 401 }
    );
  }

  const [user, conversations, memoryItems, bookmarks, userReports] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId } }),
    prisma.conversation.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "asc" },
      include: { messages: { orderBy: { createdAt: "asc" }, include: { citations: true } } },
    }),
    prisma.memoryItem.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "asc" } }),
    prisma.bookmark.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "asc" },
      include: { corpusPassage: true },
    }),
    prisma.userReport.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "asc" } }),
  ]);

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    account: user ? { id: user.id, email: user.email, createdAt: user.createdAt } : null,
    conversations,
    memoryItems,
    bookmarks,
    userReports,
  };

  const res = new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="vedvani-export-${session.userId}.json"`,
    },
  });

  return res;
}
