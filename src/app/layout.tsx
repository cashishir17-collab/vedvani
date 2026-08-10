import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { resolveSession } from "@/lib/session";
import { LOCALE_COOKIE_NAME, isLocale, t, type Locale } from "@/lib/i18n";
import LocaleToggle from "./LocaleToggle";

export const metadata: Metadata = {
  title: "VedVani",
  description: "Ask about Hindu scripture and tradition, grounded in cited sources.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await resolveSession();
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : "en";

  return (
    <html lang={locale}>
      <body>
        <div className="app-shell">
          <header className="app-header">
            <a href="/" className="brand">{t(locale, "brand")}</a>
            <nav className="nav-links">
              <a href="/">{t(locale, "navAsk")}</a>
              <a href="/history">{t(locale, "navHistory")}</a>
              <a href="/memory">{t(locale, "navMemory")}</a>
              <a href="/read">{t(locale, "navRead")}</a>
              <a href="/learn">{t(locale, "navLearn")}</a>
              <a href="/entities">{t(locale, "navEntities")}</a>
              <a href="/bookmarks">{t(locale, "navBookmarks")}</a>
              <LocaleToggle locale={locale} />
              {session.type === "user" ? (
                <>
                  <a href="/account">{t(locale, "navAccount")}</a>
                  <span className="muted">{session.email}</span>
                  <a href="/api/auth/logout">{t(locale, "logOut")}</a>
                </>
              ) : (
                <>
                  <span className="muted">{t(locale, "guest")}</span>
                  <a href="/login">{t(locale, "logIn")}</a>
                </>
              )}
            </nav>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
            {t(locale, "footer")}
          </footer>
        </div>
      </body>
    </html>
  );
}
