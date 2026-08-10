"use client";

import { useState } from "react";

export default function AccountClient() {
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function downloadData() {
    const res = await fetch("/api/account/export");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      window.alert(data.error ?? "Could not export your data.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vedvani-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function deleteAccount() {
    if (deleteConfirmText !== "DELETE" || deleting) return;
    if (!window.confirm("This will permanently delete your VedVani account and data. Continue?")) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not delete your account.");
        setDeleting(false);
        return;
      }
      window.location.href = "/";
    } catch {
      setError("Something went wrong deleting your account.");
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Download my data</h3>
        <p className="muted">
          Get a JSON file with all your conversations, memory notes, bookmarks, and reports.
        </p>
        <button type="button" onClick={downloadData}>
          Download my data
        </button>
      </div>

      <div className="card" style={{ marginTop: 16, borderColor: "#b91c1c" }}>
        <h3 style={{ marginTop: 0 }}>Delete my account</h3>
        <p className="muted">
          This permanently deletes your account, conversations, memory notes, and bookmarks. Reports
          you've filed are kept for review but no longer linked to you. This cannot be undone.
        </p>
        <div className="composer-row" style={{ gap: 8 }}>
          <input
            type="text"
            placeholder='Type "DELETE" to confirm'
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
          <button
            type="button"
            className="danger"
            onClick={deleteAccount}
            disabled={deleteConfirmText !== "DELETE" || deleting}
          >
            {deleting ? "Deleting..." : "Delete my account"}
          </button>
        </div>
        {error && (
          <p className="muted" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
