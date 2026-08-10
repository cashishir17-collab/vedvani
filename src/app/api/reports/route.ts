import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const conversationId: string | undefined = body?.conversationId || undefined;
  const messageId: string | undefined = body?.messageId || undefined;
  const note: string = (body?.note ?? "").toString().trim();

  if (!note) {
    return NextResponse.json({ error: "note is required" }, { status: 400 });
  }

  const report = await prisma.userReport.create({
    data: { conversationId, messageId, note },
  });

  return NextResponse.json({ report });
}
