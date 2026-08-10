import type { Metadata } from "next";
import { resolveSession } from "@/lib/session";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "VedVani — Ask about Hindu scripture and tradition",
  description:
    "Ask questions about Hindu scripture, philosophy, and tradition and get answers grounded in cited primary sources.",
};

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { label: "Vedas & Yajna", href: "/library/vedas" },
  { label: "Scriptures", href: "/library" },
  { label: "Philosophy", href: "/library/darshanas" },
  { label: "Saints", href: "/saints" },
  { label: "Astrology", href: "/astrology" },
  { label: "Festivals", href: "/festivals" },
];

export default async function HomePage() {
  const session = await resolveSession();
  const loggedIn = session.type === "user";

  return (
    <div>
      {!loggedIn && (
        <div className="card" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div className="vv-mandala-watermark" aria-hidden="true" />
          <h1 style={{ color: "var(--vv-maroon)", fontSize: "1.8rem" }}>
            वेदों से वर्तमान तक — सम्पूर्ण हिन्दू ज्ञान से संवाद।
          </h1>
          <p className="muted">
            Ask VedVani — a source-grounded companion across the Vedas, Upanishads, epics, Puranas and
            philosophical traditions of Hindu thought. Every answer cites where it comes from.
          </p>
        </div>
      )}

      <div className="card">
        <HomeClient />
      </div>

      {!loggedIn && (
        <>
          <div className="card">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
              {CATEGORIES.map((c) => (
                <a key={c.label} href={c.href} className="vv-work-row" style={{ textAlign: "center", margin: 0 }}>
                  {c.label}
                </a>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: "0.85rem" }} className="muted">
              <span>✓ Source-grounded answers</span>
              <span>✓ Multiple interpretations, no single sampradaya</span>
              <span>✓ Hindi / English, voice-ready</span>
            </div>
          </div>

          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ marginTop: 0 }}>Support VedVani</h3>
            <p className="muted">Help preserve, review and make Hindu knowledge accessible to everyone.</p>
            <a className="vv-btn" href="/donate">Donate</a>
          </div>
        </>
      )}
    </div>
  );
}
