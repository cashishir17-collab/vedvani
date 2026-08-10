"use client";

import { useState } from "react";

type Bookmark = {
  id: string;
  note: string | null;
  createdAt: string;
  corpusPassage: { id: string; title: string; sourceWork: string; location: string };
};

export default function BookmarkList({ initial }: { initial: Bookmark[] }) {
  const [bookmarks, setBookmarks] = useState(initial);

  async function remove(id: string) {
    const res = await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
  }

  return (
    <div className="conversation-list">
      {bookmarks.map((b) => (
        <div key={b.id} className="citation">
          <a href={`/read/${b.corpusPassage.id}`}>
            <strong>{b.corpusPassage.title}</strong>
          </a>
          <div className="muted">{b.corpusPassage.sourceWork} · {b.corpusPassage.location}</div>
          {b.note && <div style={{ marginTop: 4 }}>{b.note}</div>}
          <button type="button" className="secondary" style={{ marginTop: 8 }} onClick={() => remove(b.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
