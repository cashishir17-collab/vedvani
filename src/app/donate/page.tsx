"use client";

import { useState } from "react";

const PROGRAMMES = [
  { key: "digitisation", label: "Digitisation of new texts" },
  { key: "review", label: "Scholar review of unreviewed passages" },
  { key: "translation", label: "New translations & commentary" },
  { key: "access", label: "Free access & hosting costs" },
  { key: "general", label: "General support" },
];

export default function DonatePage() {
  const [amountType, setAmountType] = useState<"one-time" | "monthly">("one-time");
  const [amount, setAmount] = useState(500);
  const [programme, setProgramme] = useState("general");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0, color: "var(--vv-maroon)" }}>Support VedVani</h1>
        <p>
          Please donate for the upliftment of the Hindu religion — to help preserve scripture, fund editorial
          review, and keep this knowledge freely accessible to everyone, across traditions.
        </p>
        <div className="vv-notice">
          The legal recipient entity for donations is still being finalised (charitable registration / compliance
          review in progress). This page describes the intended donation flow; no payment is collected yet.
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Choose an amount</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button type="button" className={amountType === "one-time" ? "" : "secondary"} onClick={() => setAmountType("one-time")}>One-time</button>
          <button type="button" className={amountType === "monthly" ? "" : "secondary"} onClick={() => setAmountType("monthly")}>Monthly</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {[100, 500, 1000, 2500].map((v) => (
            <button key={v} type="button" className={amount === v ? "" : "secondary"} onClick={() => setAmount(v)}>₹{v}</button>
          ))}
          <input
            type="number"
            aria-label="Custom amount"
            value={amount}
            min={1}
            onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
            style={{ width: 100 }}
          />
        </div>

        <h4>Programme</h4>
        <select value={programme} onChange={(e) => setProgramme(e.target.value)} style={{ width: "100%", padding: 8 }}>
          {PROGRAMMES.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>

        <h4>Your details</h4>
        <input type="text" placeholder="Name" style={{ marginBottom: 8 }} />
        <input type="email" placeholder="Email" style={{ marginBottom: 8 }} />

        {submitted ? (
          <div className="vv-notice">
            Payment gateway integration is pending legal/compliance review — thank you for your interest, we are
            not able to accept payment yet. Please check back soon.
          </div>
        ) : (
          <button type="button" onClick={() => setSubmitted(true)}>
            Continue — {amountType === "monthly" ? "₹" + amount + "/month" : "₹" + amount} ({PROGRAMMES.find((p) => p.key === programme)?.label})
          </button>
        )}
      </div>
    </div>
  );
}
