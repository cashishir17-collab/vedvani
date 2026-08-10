import type { Metadata } from "next";

export const metadata: Metadata = { title: "Astrology — VedVani" };

export default function AstrologyPage() {
  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Astrology (Jyotish)</h1>
        <div className="vv-notice">Traditional/interpretive guidance — not a scientific claim or a certainty about your future. For reflection alongside, not instead of, your own judgement.</div>
      </div>
      <div className="card">
        <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <a href="/astrology">Learn</a>
          <a href="/astrology/chart">Birth Chart</a>
          <span className="muted">Panchang (coming soon)</span>
          <span className="muted">Compatibility (coming soon)</span>
        </nav>
        <p className="muted">
          Jyotish is the traditional Hindu system of astrology, distinct from Western astrology in its use of the
          sidereal zodiac. This section is a lightweight shell — full chart calculation and interpretation engines
          are a follow-up; you can already <a href="/astrology/chart">try a stub chart form</a> or{" "}
          <a href="/ask?about=Jyotish">ask VedVani about Jyotish concepts</a> directly.
        </p>
      </div>
    </div>
  );
}
