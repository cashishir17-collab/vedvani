import type { Metadata } from "next";

export const metadata: Metadata = { title: "Festivals & Rituals — VedVani" };

export default function FestivalPage({ params }: { params: { slug: string } }) {
  const label = params.slug.replace(/-/g, " ");
  return (
    <div className="card">
      <h1 style={{ marginTop: 0, textTransform: "capitalize" }}>{label}</h1>
      <p className="muted">
        This festival page is a thin stub in this build. <a href={`/ask?about=${encodeURIComponent(label)}`}>Ask VedVani about {label}</a>.
      </p>
    </div>
  );
}
