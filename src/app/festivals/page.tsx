import type { Metadata } from "next";

export const metadata: Metadata = { title: "Festivals & Rituals — VedVani" };

const FESTIVALS = ["Diwali", "Holi", "Navaratri", "Maha Shivaratri", "Raksha Bandhan", "Makar Sankranti"];

export default function FestivalsPage() {
  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Festivals & Rituals</h1>
      <div className="conversation-list">
        {FESTIVALS.map((f) => (
          <a key={f} href={`/festivals/${f.toLowerCase().replace(/\s+/g, "-")}`}>{f}</a>
        ))}
      </div>
    </div>
  );
}
