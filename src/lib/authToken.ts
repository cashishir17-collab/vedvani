import crypto from "crypto";

/**
 * Lightweight, dependency-free HMAC-signed tokens used for both:
 *  1. Magic-link login tokens (short-lived, single purpose "login")
 *  2. Signed session cookies identifying a logged-in user (longer-lived,
 *     purpose "session")
 *
 * This intentionally avoids pulling in a JWT library — it's just a
 * base64url(payload).base64url(hmacSha256(payload)) scheme, which is
 * sufficient for this slice. Tokens are stateless: no DB-backed token
 * table is needed since the user id + email + expiry + signature all
 * live in the token itself.
 */

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    // Fall back to a dev-only default so local/dev builds don't crash,
    // but this is NOT safe for production. Always set AUTH_SECRET in
    // production environments (e.g. Railway variables).
    return "dev-secret-change-me-do-not-use-in-production";
  }
  return secret;
}

function base64url(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64");
}

function sign(payload: string): string {
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(payload);
  return base64url(hmac.digest());
}

export type LoginTokenPayload = {
  purpose: "login";
  userId: string;
  email: string;
  exp: number; // epoch ms
};

export type SessionTokenPayload = {
  purpose: "session";
  userId: string;
  email: string;
  exp: number; // epoch ms
};

function encodeToken(payload: LoginTokenPayload | SessionTokenPayload): string {
  const json = JSON.stringify(payload);
  const encodedPayload = base64url(Buffer.from(json, "utf8"));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function decodeToken<T extends { purpose: string; exp: number }>(token: string): T | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encodedPayload, signature] = parts;
  const expectedSignature = sign(encodedPayload);

  // Constant-time comparison to avoid timing attacks.
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const json = base64urlDecode(encodedPayload).toString("utf8");
    const payload = JSON.parse(json) as T;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

const LOGIN_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TOKEN_TTL_MS = 60 * 60 * 24 * 30 * 1000; // 30 days

export function createLoginToken(userId: string, email: string): string {
  return encodeToken({
    purpose: "login",
    userId,
    email,
    exp: Date.now() + LOGIN_TOKEN_TTL_MS,
  });
}

export function verifyLoginToken(token: string): LoginTokenPayload | null {
  const payload = decodeToken<LoginTokenPayload>(token);
  if (!payload || payload.purpose !== "login") return null;
  return payload;
}

export function createSessionToken(userId: string, email: string): string {
  return encodeToken({
    purpose: "session",
    userId,
    email,
    exp: Date.now() + SESSION_TOKEN_TTL_MS,
  });
}

export function verifySessionToken(token: string): SessionTokenPayload | null {
  const payload = decodeToken<SessionTokenPayload>(token);
  if (!payload || payload.purpose !== "session") return null;
  return payload;
}

export function getAppBaseUrl(): string {
  return process.env.APP_BASE_URL || "http://localhost:3000";
}
