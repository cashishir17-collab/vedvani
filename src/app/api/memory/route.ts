import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, applyGuestCookieIfNeeded } from "@/lib/session";
import { containsSensitiveContent } from "@/lib/memorySafety";

const VALID_CATEGORIES = ["explicit_fact", "inferred_preference", "summary", "learning_progress"];

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
  const category: string = VALID_CATEGORIES.includes(body?.category) ? body.category : "inferred_preference";

  if (!content) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  // Phase 13 (BRD FR-MEM): never persist obviously sensitive content
  // (health conditions, caste terms, precise birth date+time+place combos,
  // political party names, intimate/sexual content). Log that a write was
  // blocked without logging the flagged content itself.
  if (containsSensitiveContent(content)) {
    console.warn("[memory] blocked memory write for policy reasons (sensitive content pattern matched)");
    return NextResponse.json(
      { error: "This note looks like it may contain sensitive personal information, so it wasn't saved." },
      { status: 422 }
    );
  }

  const item = await prisma.memoryItem.create({
    data:
      session.type === "user"
        ? { userId: session.userId, content, category }
        : { guestSessionId: session.guestId, content, category },
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
