import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withRequestLog } from "@/lib/requestLog";
import { resolveSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return withRequestLog({ path: "/api/reports", method: "POST" }, async () => {
    const session = await resolveSession();
    const body = await req.json().catch(() => ({}));
    const conversationId: string | undefined = body?.conversationId || undefined;
    const messageId: string | undefined = body?.messageId || undefined;
    const note: string = (body?.note ?? "").toString().trim();

    if (!note) {
      return NextResponse.json({ error: "note is required" }, { status: 400 });
    }

    const report = await prisma.userReport.create({
      data: {
        conversationId,
        messageId,
        note,
        userId: session.type === "user" ? session.userId : null,
      },
    });

    return NextResponse.json({ report });
  });
}
