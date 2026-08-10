import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { GUEST_COOKIE_NAME, getOrCreateGuestSession } from "./guestSession";
import { verifySessionToken } from "./authToken";

export const SESSION_COOKIE_NAME = "vv_session";

export type ResolvedSession =
  | { type: "guest"; guestId: string; isNewGuestCookie: boolean }
  | { type: "user"; userId: string; email: string };

/**
 * Unified session resolver used across the app. If a valid signed user
 * session cookie is present, the caller is treated as a logged-in user
 * (identified by User id + email). Otherwise, falls back to the existing
 * guest-cookie behavior unchanged.
 *
 * Everywhere the app previously threaded a bare `guestSessionId` through
 * to Prisma queries, it should now branch on this union type and filter
 * by either `guestSessionId` or `userId` accordingly.
 */
export async function resolveSession(): Promise<ResolvedSession> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionCookie) {
    const payload = verifySessionToken(sessionCookie);
    if (payload) {
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (user) {
        return { type: "user", userId: user.id, email: user.email };
      }
    }
  }

  const { guestSessionId, isNew } = await getOrCreateGuestSession();
  return { type: "guest", guestId: guestSessionId, isNewGuestCookie: isNew };
}

/** Helper to set the guest cookie on a response when a new guest session was created. */
export function applyGuestCookieIfNeeded(res: import("next/server").NextResponse, session: ResolvedSession) {
  if (session.type === "guest" && session.isNewGuestCookie) {
    res.cookies.set(GUEST_COOKIE_NAME, session.guestId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
}
