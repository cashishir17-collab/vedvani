import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const GUEST_COOKIE_NAME = "guest_session_id";

/**
 * Resolve (or create) the GuestSession for the current request based on the
 * guest_session_id httpOnly cookie. Returns the GuestSession row and a flag
 * indicating whether a new cookie value needs to be set on the response.
 */
export async function getOrCreateGuestSession(): Promise<{
  guestSessionId: string;
  isNew: boolean;
}> {
  const cookieStore = cookies();
  const existing = cookieStore.get(GUEST_COOKIE_NAME)?.value;

  if (existing) {
    const session = await prisma.guestSession.findUnique({ where: { id: existing } });
    if (session) {
      await prisma.guestSession.update({
        where: { id: session.id },
        data: { lastSeenAt: new Date() },
      });
      return { guestSessionId: session.id, isNew: false };
    }
  }

  const created = await prisma.guestSession.create({ data: {} });
  return { guestSessionId: created.id, isNew: true };
}
