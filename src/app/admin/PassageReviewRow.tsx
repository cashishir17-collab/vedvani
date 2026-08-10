"use client";

import { useState } from "react";

export default function PassageReviewRow({
  id,
  title,
  sourceWork,
  sourceType,
  traditionTags,
  reviewStatus,
}: {
  id: string;
  title: string;
  sourceWork: string;
  sourceType: string;
  traditionTags: string[];
  reviewStatus: string;
}) {
  const [status, setStatus] = useState(reviewStatus);
  const [saving, setSaving] = useState(false);

  async function updateStatus(newStatus: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/passages/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewStatus: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr>
      <td>{title}</td>
      <td>{sourceWork}</td>
      <td><span className={`badge ${sourceType}`}>{sourceType}</span></td>
      <td className="muted">{traditionTags.join(", ")}</td>
      <td>{status}</td>
      <td>
        <select
          value={status}
          disabled={saving}
          onChange={(e) => updateStatus(e.target.value)}
        >
          <option value="unreviewed">unreviewed</option>
          <option value="reviewed">reviewed</option>
          <option value="flagged">flagged</option>
        </select>
      </td>
    </tr>
  );
}
