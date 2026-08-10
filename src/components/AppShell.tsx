import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import LocaleToggle from "@/app/LocaleToggle";
import type { Locale } from "@/lib/i18n";

export interface AppShellSession {
  authenticated: boolean;
  email?: string | null;
  name?: string | null;
}

export default function AppShell({
  children,
  locale,
  session,
  breadcrumb,
}: {
  children: ReactNode;
  locale: Locale;
  session: AppShellSession;
  breadcrumb?: ReactNode;
}) {
  return (
    <div className="vv-shell">
      <Sidebar locale={locale} session={session} />
      <div className="vv-main">
        <div className="vv-topbar">
          <div className="vv-breadcrumb">{breadcrumb ?? <a href="/">VedVani</a>}</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href="/search" className="vv-btn secondary" aria-label="Search">Search</a>
            <LocaleToggle locale={locale} />
            {session.authenticated ? (
              <a href="/api/auth/logout" className="vv-btn secondary">Log out</a>
            ) : (
              <a href="/login" className="vv-btn secondary">Log in</a>
            )}
            <a href="/settings" className="vv-btn secondary" aria-label="Accessibility settings">A11y</a>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
