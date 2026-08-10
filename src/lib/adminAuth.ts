import { prisma } from "@/lib/prisma";
import { resolveSession, ResolvedSession } from "@/lib/session";

/**
 * Resolves the current session AND verifies (server-side, via DB lookup)
 * that the logged-in user has isAdmin = true. Guests are never admins.
 */
export async function resolveAdminSession(): Promise<{ session: ResolvedSession; isAdmin: boolean }> {
  const session = await resolveSession();
  if (session.type !== "user") {
    return { session, isAdmin: false };
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  return { session, isAdmin: !!user?.isAdmin };
}
