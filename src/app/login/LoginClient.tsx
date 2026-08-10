"use client";

import { useState } from "react";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLink, setMagicLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!email.trim() || loading) return;
    setLoading(true);
    setError(null);
    setMagicLink(null);
    try {
      const res = await fetch("/api/auth/email-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong.");
        return;
      }
      setMagicLink(data.magicLink);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Log in</h2>
      <p className="muted">
        Enter your email to get a one-click login link. Your conversations and memory notes will
        be tied to your account instead of a guest session going forward.
      </p>
      <div className="composer-row" style={{ marginBottom: 10 }}>
        <label htmlFor="login-email" className="sr-only">
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="button" onClick={submit} disabled={loading || !email.trim()}>
          {loading ? "Sending..." : "Send magic link"}
        </button>
      </div>

      {error && (
        <div className="citation" style={{ borderColor: "#b91c1c" }}>
          {error}
        </div>
      )}

      {magicLink && (
        <div className="citation">
          <strong>Since email sending isn&apos;t configured yet, click this link to log in:</strong>
          <div style={{ marginTop: 8 }}>
            <a href={magicLink}>{magicLink}</a>
          </div>
          <div className="muted" style={{ marginTop: 8 }}>
            This link expires in 15 minutes and can only be used once conceptually (it&apos;s a
            stateless signed token, so it remains valid for repeated use until it expires — see
            README for details).
          </div>
        </div>
      )}
    </div>
  );
}
