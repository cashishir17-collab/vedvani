"use client";

import { useState } from "react";

type Item = { id: string; content: string; createdAt: string };

export default function MemoryList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  async function addItem() {
    if (!text.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim() }),
      });
      const data = await res.json();
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
    await fetch(`/api/memory?id=${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <div className="composer-row" style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Add a memory note (opt-in)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="button" onClick={addItem} disabled={saving || !text.trim()}>
          Save
        </button>
      </div>
      {items.length === 0 && <p className="muted">No memory items saved yet.</p>}
      {items.map((item) => (
        <div key={item.id} className="citation row-between">
          <div>
            <div>{item.content}</div>
            <div className="muted">{new Date(item.createdAt).toLocaleString()}</div>
          </div>
          <button type="button" className="danger" onClick={() => deleteItem(item.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
