"use client";

import { useState } from "react";

type Category = "explicit_fact" | "inferred_preference" | "summary" | "learning_progress";

type Item = { id: string; content: string; category: string; paused: boolean; createdAt: string };

const CATEGORY_LABELS: Record<Category, string> = {
  explicit_fact: "Explicit facts you told VedVani",
  inferred_preference: "Inferred preferences",
  summary: "Conversation summaries",
  learning_progress: "Learning progress",
};

const CATEGORY_ORDER: Category[] = ["explicit_fact", "inferred_preference", "summary", "learning_progress"];

export default function MemoryList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>("explicit_fact");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addItem() {
    if (!text.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim(), category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save this note.");
        return;
      }
      if (data.item) {
        setItems((prev) => [data.item, ...prev]);
        setText("");
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/memory/${id}`, { method: "DELETE" });
  }

  async function togglePaused(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = !item.paused;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, paused: next } : i)));
    await fetch(`/api/memory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paused: next }),
    });
  }

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: items.filter((i) => i.category === cat),
  }));

  return (
    <div>
      <div className="composer-row" style={{ marginBottom: 8, gap: 8 }}>
        <input
          type="text"
          placeholder="Add a memory note (opt-in)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORY_ORDER.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
        <button type="button" onClick={addItem} disabled={saving || !text.trim()}>
          Save
        </button>
      </div>
      {error && (
        <p className="muted" style={{ color: "#b45309" }}>
          {error}
        </p>
      )}
      {items.length === 0 && <p className="muted">No memory items saved yet.</p>}
      {grouped.map(
        (group) =>
          group.items.length > 0 && (
            <div key={group.category} style={{ marginTop: 20 }}>
              <h3 style={{ marginBottom: 8 }}>{CATEGORY_LABELS[group.category]}</h3>
              {group.items.map((item) => (
                <div key={item.id} className="citation row-between">
                  <div>
                    <div style={{ opacity: item.paused ? 0.5 : 1 }}>{item.content}</div>
                    <div className="muted">
                      {new Date(item.createdAt).toLocaleString()}
                      {item.paused ? " — paused" : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" className="secondary" onClick={() => togglePaused(item.id)}>
                      {item.paused ? "Resume" : "Pause"}
                    </button>
                    <button type="button" className="danger" onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  );
}
