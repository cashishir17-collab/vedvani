import { LEARNING_PATHS } from "@/lib/learningPaths";

export const dynamic = "force-dynamic";

export default function LearnIndexPage() {
  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Learning Paths</h2>
        <p className="muted">Guided sequences of passages to build understanding step by step.</p>
      </div>
      <div className="card">
        <div className="conversation-list">
          {LEARNING_PATHS.map((path) => (
            <a key={path.slug} href={`/learn/${path.slug}`}>
              <div>{path.title}</div>
              <div className="muted">{path.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
