"use client";

import { useState } from "react";

export default function BookmarkButton({ corpusPassageId }: { corpusPassageId: string }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const note = window.prompt("Optional note for this bookmark (leave blank to skip):") || undefined;
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ corpusPassageId, note }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button type="button" onClick={save} disabled={saving || saved}>
      {saved ? "Bookmarked" : saving ? "Saving..." : "Bookmark"}
    </button>
  );
}
