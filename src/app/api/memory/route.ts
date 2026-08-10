import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateGuestSession, GUEST_COOKIE_NAME } from "@/lib/guestSession";

export const dynamic = "force-dynamic";

export async function GET() {
  const { guestSessionId, isNew } = await getOrCreateGuestSession();

  const items = await prisma.memoryItem.findMany({
    where: { guestSessionId },
    orderBy: { createdAt: "desc" },
  });

  const res = NextResponse.json({ items });
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

export async function POST(req: NextRequest) {
  const { guestSessionId, isNew } = await getOrCreateGuestSession();
  const body = await req.json();
  const content: string = (body?.content ?? "").toString().trim();

  if (!content) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const item = await prisma.memoryItem.create({
    data: { guestSessionId, content },
  });

  const res = NextResponse.json({ item });
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

export async function DELETE(req: NextRequest) {
  const { guestSessionId } = await getOrCreateGuestSession();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query param is required" }, { status: 400 });
  }

  const item = await prisma.memoryItem.findUnique({ where: { id } });
  if (!item || item.guestSessionId !== guestSessionId) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await prisma.memoryItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
