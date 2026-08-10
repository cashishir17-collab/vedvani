import { NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE_NAME, isLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const locale = body?.locale;

  if (!isLocale(locale)) {
    return NextResponse.json({ error: "locale must be 'en' or 'hi'" }, { status: 400 });
  }

  const res = NextResponse.json({ locale });
  res.cookies.set(LOCALE_COOKIE_NAME, locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
