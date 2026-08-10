import type { Metadata } from "next";
import "./globals.css";
import { resolveSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "VedVani",
  description: "Ask about Hindu scripture and tradition, grounded in cited sources.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await resolveSession();

  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <a href="/" className="brand">VedVani</a>
            <nav className="nav-links">
              <a href="/">Ask</a>
              <a href="/history">History</a>
              <a href="/memory">Memory</a>
              <a href="/read">Read</a>
              <a href="/learn">Learn</a>
              <a href="/bookmarks">Bookmarks</a>
              {session.type === "user" ? (
                <>
                  <span className="muted">{session.email}</span>
                  <a href="/api/auth/logout">Log out</a>
                </>
              ) : (
                <>
                  <span className="muted">Guest</span>
                  <a href="/login">Log in</a>
                </>
              )}
            </nav>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
            VedVani offers pluralistic, cited information about Hindu scripture and tradition.
            It does not claim divine authority and can make mistakes — always verify important
            matters with a qualified teacher or primary source.
          </footer>
        </div>
      </body>
    </html>
  );
}
