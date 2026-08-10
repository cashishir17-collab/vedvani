"use client";

import { useState } from "react";

export default function TarotPage() {
  const [step, setStep] = useState<"question" | "spread" | "reveal">("question");

  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Tarot Reading</h1>
        <div className="vv-notice">
          Tarot is an optional, non-Vedic interpretive tool — for reflection, not certainty. It is shown separately
          from scriptural citations and never presented as scripture.
        </div>
      </div>
      <div className="card">
        {step === "question" && (
          <>
            <label>Your question<input type="text" placeholder="What would you like to reflect on?" /></label>
            <button style={{ marginTop: 10 }} onClick={() => setStep("spread")}>Continue</button>
          </>
        )}
        {step === "spread" && (
          <>
            <p className="muted">Choose a spread (stub — single-card reflection only in this build).</p>
            <button onClick={() => setStep("reveal")}>Draw a card</button>
          </>
        )}
        {step === "reveal" && (
          <>
            <p><strong>The Star</strong> — a card of hope and renewal.</p>
            <p className="muted">Reflective interpretation: consider where you feel most hopeful right now, and what small step would nurture that. For reflection, not certainty.</p>
            <button className="secondary" onClick={() => setStep("question")}>Ask again</button>
          </>
        )}
      </div>
    </div>
  );
}
