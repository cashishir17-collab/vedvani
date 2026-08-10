import { cookies } from "next/headers";
import { resolveSession } from "@/lib/session";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";
import AccountClient from "./AccountClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account — VedVani",
  description: "Download your VedVani data or delete your account.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await resolveSession();
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";

  if (session.type !== "user") {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Account</h2>
        <p className="muted">
          Data export and account deletion require a logged-in account. Please{" "}
          <a href="/login">log in</a> first.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Account</h2>
      <p className="muted">Signed in as {session.email}.</p>
      <AccountClient />
    </div>
  );
}
