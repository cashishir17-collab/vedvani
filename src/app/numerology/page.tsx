"use client";

import { useState } from "react";

export default function NumerologyPage() {
  const [tab, setTab] = useState<"learn" | "name" | "birth" | "saved">("learn");

  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Numerology</h1>
        <div className="vv-notice">Interpretive tradition, not a guaranteed outcome. Calculation and interpretation are shown separately below.</div>
        <nav style={{ display: "flex", gap: 12, marginTop: 10 }}>
          {(["learn", "name", "birth", "saved"] as const).map((k) => (
            <button key={k} type="button" className={tab === k ? "" : "secondary"} onClick={() => setTab(k)}>
              {k === "learn" ? "Learn" : k === "name" ? "Name Number" : k === "birth" ? "Birth Number" : "Saved Reports"}
            </button>
          ))}
        </nav>
      </div>
      <div className="card">
        {tab === "learn" && <p className="muted">Numerology assigns meaning to numbers derived from names and birth dates. Systems vary — VedVani states which system it uses for any calculation shown.</p>}
        {tab === "name" && <p className="muted">Name-number calculation is a stub in this build — full logic is a follow-up.</p>}
        {tab === "birth" && <p className="muted">Birth-number calculation is a stub in this build — full logic is a follow-up.</p>}
        {tab === "saved" && <p className="muted">No saved reports yet.</p>}
      </div>
    </div>
  );
}
