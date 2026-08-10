import type { Metadata } from "next";

export const metadata: Metadata = { title: "Traditions — VedVani" };

const LABELS: Record<string, string> = {
  deities: "Deities",
  darshanas: "Darshanas",
  sampradayas: "Sampradayas",
  temples: "Temples & Tirthas",
  "yoga-ayurveda": "Yoga & Ayurveda",
};

export default function TraditionPage({ params }: { params: { slug: string } }) {
  const label = LABELS[params.slug] ?? params.slug;
  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>{label}</h1>
      <p className="muted">
        This section is a thin stub in this build. Browse related passages via the <a href="/library">Scripture
        Library</a>, related figures via <a href="/entities">Entities</a>, or{" "}
        <a href={`/ask?about=${encodeURIComponent(label)}`}>ask VedVani about {label}</a>.
      </p>
    </div>
  );
}
