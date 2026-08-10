import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createLoginToken, getAppBaseUrl } from "@/lib/authToken";

export const dynamic = "force-dynamic";

/**
 * Magic-link "request login" endpoint.
 *
 * PLACEHOLDER NOTE: No email-sending provider (Resend, SMTP relay, etc.)
 * is configured yet for this deployment. Rather than silently failing or
 * pretending an email was sent, this endpoint generates the real signed
 * magic link and returns it directly in the JSON response so the /login
 * page can display it as a clickable link. Once an email provider is
 * wired up, replace the `magicLink` passthrough below with an actual
 * "send email" call and stop returning the link in the response body.
 * See README "Known limitations" for tracking.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const rawEmail: string = (body?.email ?? "").toString().trim().toLowerCase();

  if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { email: rawEmail },
    update: {},
    create: { email: rawEmail },
  });

  const token = createLoginToken(user.id, user.email);
  const magicLink = `${getAppBaseUrl()}/api/auth/verify?token=${encodeURIComponent(token)}`;

  return NextResponse.json({
    ok: true,
    emailSendingConfigured: false,
    message:
      "Email sending isn't configured yet, so we can't send this automatically. Use the link below to log in.",
    magicLink,
    expiresInMinutes: 15,
  });
}
