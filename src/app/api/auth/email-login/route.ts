import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateGuestSession, GUEST_COOKIE_NAME } from "@/lib/guestSession";

export const dynamic = "force-dynamic";

/**
 * Stub email login. Real magic-link / password auth is out of scope for
 * this slice. We loosely associate the provided email with the current
 * guest session so a returning-email flow is at least plausible later,
 * but this does NOT constitute real authentication.
 */
export async function POST(req: NextRequest) {
  const { guestSessionId, isNew } = await getOrCreateGuestSession();
  const body = await req.json().catch(() => ({}));
  const email: string | undefined = body?.email;

  if (email) {
    await prisma.guestSession.update({
      where: { id: guestSessionId },
      data: { email },
    });
  }

  const res = NextResponse.json({
    ok: true,
    implemented: false,
    message:
      "Email login is not implemented in this slice. Your email has been loosely associated with your current guest session; guest mode remains the fully working path.",
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
