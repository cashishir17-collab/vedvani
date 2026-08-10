import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VedVani",
  description: "Ask about Hindu scripture and tradition, grounded in cited sources.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
