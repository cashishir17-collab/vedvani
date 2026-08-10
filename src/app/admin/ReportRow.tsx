"use client";

import { useState } from "react";

export default function ReportRow({
  id,
  conversationId,
  messageId,
  note,
  status,
  createdAt,
}: {
  id: string;
  conversationId: string | null;
  messageId: string | null;
  note: string;
  status: string;
  createdAt: string;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [saving, setSaving] = useState(false);

  async function resolve() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/reports/${id}/resolve`, { method: "POST" });
      if (res.ok) setCurrentStatus("resolved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="citation" style={{ marginBottom: 10 }}>
      <div className="muted">{new Date(createdAt).toLocaleString()} — status: {currentStatus}</div>
      {conversationId && <div className="muted">Conversation: {conversationId}</div>}
      {messageId && <div className="muted">Message: {messageId}</div>}
      <div style={{ marginTop: 4 }}>{note}</div>
      {currentStatus !== "resolved" && (
        <button type="button" className="secondary" onClick={resolve} disabled={saving} style={{ marginTop: 8 }}>
          {saving ? "Resolving..." : "Mark resolved"}
        </button>
      )}
    </div>
  );
}
