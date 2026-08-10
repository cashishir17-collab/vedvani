import type { Metadata } from "next";
import "./globals.css";
import { cookies, headers } from "next/headers";
import { resolveSession } from "@/lib/session";
import { LOCALE_COOKIE_NAME, isLocale, t, type Locale } from "@/lib/i18n";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "VedVani",
  description: "Ask about Hindu scripture and tradition, grounded in cited sources.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await resolveSession();
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : "en";
  const pathname = headers().get("x-vv-pathname") ?? "/";

  // Admin keeps its own simpler shell (spec section 12) — don't wrap it
  // in the consumer AppShell/sidebar.
  const useAppShell = !pathname.startsWith("/admin");
  const segments = pathname.split("/").filter(Boolean);
  const isReaderPage = segments[0] === "read" && segments.length === 2; // /read/[id]


  const appShellSession = {
    authenticated: session.type === "user",
    email: session.type === "user" ? session.email : null,
  };

  return (
    <html lang={locale}>
      <body>
        {useAppShell ? (
          <AppShell locale={locale} session={appShellSession}>
            {isReaderPage ? (
              children
            ) : (
              <>
                <div className="vv-content">{children}</div>
                <footer className="app-footer" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 24px" }}>
                  {t(locale, "footer")}
                </footer>
              </>
            )}
          </AppShell>
        ) : (
          <div className="app-shell">
            <main className="app-main">{children}</main>
            <footer className="app-footer">{t(locale, "footer")}</footer>
          </div>
        )}
      </body>
    </html>
  );
}
