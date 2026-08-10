"use client";

import { useState } from "react";

export default function BirthChartPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Birth Chart</h1>
        <div className="vv-notice">
          Birth details are sensitive. VedVani stores them only for this session unless you explicitly save them,
          and you can delete them at any time. Chart generation here is a stub — full calculation logic is a
          follow-up.
        </div>
      </div>
      <div className="card">
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <label>Date of birth<input type="date" required /></label>
          <label style={{ display: "block", marginTop: 8 }}>Time of birth<input type="time" /></label>
          <label style={{ display: "block", marginTop: 8 }}>Place of birth<input type="text" placeholder="City, Country" /></label>
          <label style={{ display: "block", marginTop: 8 }}>
            <input type="checkbox" defaultChecked /> Use Lahiri ayanamsha (default assumption)
          </label>
          <button type="submit" style={{ marginTop: 12 }}>Generate chart</button>
        </form>
        {submitted && (
          <div style={{ marginTop: 16 }}>
            <div className="vv-notice">
              Chart calculation is not wired up yet in this build — this is a UI placeholder. Once available, your
              chart and a plain-language interpretation will appear here, with an "Ask VedVani about this chart"
              follow-up.
            </div>
            <button type="button" className="secondary">Delete birth details</button>
          </div>
        )}
      </div>
    </div>
  );
}
