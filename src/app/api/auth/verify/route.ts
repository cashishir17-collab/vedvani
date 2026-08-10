import { NextRequest, NextResponse } from "next/server";
import { verifyLoginToken, createSessionToken } from "@/lib/authToken";
import { SESSION_COOKIE_NAME } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * Magic-link verification endpoint. Validates the signed one-time login
 * token (HMAC + expiry, stateless — no DB token table), then sets a
 * separate signed session cookie identifying the user, and redirects to
 * the home page.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  const payload = verifyLoginToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login?error=invalid_or_expired", req.url));
  }

  const sessionToken = createSessionToken(payload.userId, payload.email);
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
