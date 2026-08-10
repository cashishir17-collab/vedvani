"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { AppShellSession } from "./AppShell";

const KNOWLEDGE_TOP: Array<{ href: string; label: string }> = [
  { href: "/library", label: "Scriptures" },
  { href: "/library#vedas", label: "Vedas & Yajna" },
  { href: "/library#upanishads", label: "Upanishads" },
  { href: "/library#itihasa", label: "Gita" },
  { href: "/library#itihasa", label: "Ramayana" },
];

const KNOWLEDGE_REST: Array<{ href: string; label: string }> = [
  { href: "/library#itihasa", label: "Mahabharata" },
  { href: "/library#puranas", label: "Puranas" },
];

const LIVING_TRADITION: Array<{ href: string; label: string }> = [
  { href: "/traditions/deities", label: "Deities" },
  { href: "/saints", label: "Saints & Acharyas" },
  { href: "/traditions/darshanas", label: "Darshanas" },
  { href: "/traditions/sampradayas", label: "Sampradayas" },
  { href: "/traditions/temples", label: "Temples & Tirthas" },
  { href: "/festivals", label: "Festivals & Rituals" },
  { href: "/traditions/yoga-ayurveda", label: "Yoga & Ayurveda" },
];

export default function Sidebar({ locale, session }: { locale: Locale; session: AppShellSession }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAllKnowledge, setShowAllKnowledge] = useState(false);
  const [livingOpen, setLivingOpen] = useState(false);

  if (collapsed) {
    return (
      <nav className="vv-rail" aria-label="Primary" style={{ alignItems: "center" }}>
        <a href="/" className="vv-om" title="VedVani" aria-label="VedVani home">ॐ</a>
        <button className="vv-btn secondary" style={{ marginTop: 10 }} onClick={() => setCollapsed(false)} aria-label="Expand sidebar">»</button>
        <a href="/ask" className="vv-rail-link" title="New conversation" aria-label="New conversation">+</a>
        <a href="/search" className="vv-rail-link" title="Search" aria-label="Search">⌕</a>
        <div className="vv-rail-spacer" />
        <a href="/donate" className="vv-rail-link" title="Donate" aria-label="Donate">♥</a>
        {session.authenticated ? (
          <a href="/account" className="vv-rail-link" title="Profile" aria-label="Profile">☺</a>
        ) : (
          <a href="/login" className="vv-rail-link" title="Log in" aria-label="Log in">☺</a>
        )}
      </nav>
    );
  }

  return (
    <nav className="vv-rail" aria-label="Primary">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" className="vv-rail-brand">
          <span className="vv-om" aria-hidden="true">ॐ</span>
          <span>GPT VedVani</span>
        </a>
        <button className="vv-btn secondary" onClick={() => setCollapsed(true)} aria-label="Collapse sidebar">«</button>
      </div>

      <a href="/ask" className="vv-rail-newchat">+ New conversation</a>
      <a href="/search" className="vv-rail-search" aria-label="Search chats, scriptures, saints and topics (Ctrl+K)">
        <span>Search chats, scriptures, saints, topics</span>
        <kbd style={{ fontSize: "0.7rem" }}>Ctrl K</kbd>
      </a>

      <div className="vv-rail-group">
        <a href="/ask" className="vv-rail-link"><span className="vv-rail-icon">✦</span>Ask VedVani</a>
      </div>

      <div className="vv-rail-group">
        <div className="vv-rail-group-label">Divination & personal tools</div>
        <a href="/astrology" className="vv-rail-link" title="Traditional/interpretive guidance"><span className="vv-rail-icon">☉</span>Astrology</a>
        <a href="/numerology" className="vv-rail-link" title="Traditional/interpretive guidance"><span className="vv-rail-icon">#</span>Numerology</a>
        <a href="/tarot" className="vv-rail-link" title="Interpretive guidance, non-Vedic"><span className="vv-rail-icon">◆</span>Tarot Reading</a>
      </div>

      <div className="vv-rail-group">
        <div className="vv-rail-group-label">Knowledge library</div>
        {KNOWLEDGE_TOP.map((k) => (
          <a key={k.label} href={k.href} className="vv-rail-link"><span className="vv-rail-icon">☰</span>{k.label}</a>
        ))}
        {showAllKnowledge && KNOWLEDGE_REST.map((k) => (
          <a key={k.label} href={k.href} className="vv-rail-link"><span className="vv-rail-icon">☰</span>{k.label}</a>
        ))}
        <button className="vv-rail-link" style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }} onClick={() => setShowAllKnowledge((v) => !v)}>
          {showAllKnowledge ? "Show less" : "View all"}
        </button>
      </div>

      <div className="vv-rail-group">
        <button className="vv-rail-group-label" style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }} onClick={() => setLivingOpen((v) => !v)}>
          Living tradition {livingOpen ? "▾" : "▸"}
        </button>
        {livingOpen && LIVING_TRADITION.map((k) => (
          <a key={k.label} href={k.href} className="vv-rail-link"><span className="vv-rail-icon">•</span>{k.label}</a>
        ))}
      </div>

      {session.authenticated && (
        <div className="vv-rail-group">
          <div className="vv-rail-group-label">Personal</div>
          <a href="/history" className="vv-rail-link"><span className="vv-rail-icon">↺</span>Continue Reading</a>
          <a href="/learn" className="vv-rail-link"><span className="vv-rail-icon">◧</span>Learning Paths</a>
          <a href="/saved" className="vv-rail-link"><span className="vv-rail-icon">☆</span>Saved Verses</a>
          <a href="/memory" className="vv-rail-link"><span className="vv-rail-icon">✎</span>Notes / Memory</a>
        </div>
      )}

      {session.authenticated && (
        <div className="vv-rail-group">
          <div className="vv-rail-group-label">Conversation history</div>
          <a href="/history" className="vv-rail-link">Today / Previous 7 days / older</a>
        </div>
      )}

      <div className="vv-rail-spacer" />

      <div className="vv-donate-card">
        <strong>Support VedVani</strong>
        <div className="muted" style={{ marginTop: 4 }}>
          Help preserve, review and make Hindu knowledge accessible to everyone.
        </div>
        <a href="/donate" className="vv-btn">Donate</a>
      </div>

      <div className="vv-rail-footer">
        {session.authenticated ? (
          <a href="/account" className="vv-rail-link"><span className="vv-rail-icon">☺</span>{session.email ?? "Account"}</a>
        ) : (
          <a href="/login" className="vv-rail-link"><span className="vv-rail-icon">☺</span>Log in</a>
        )}
        <a href="/settings" className="vv-rail-link"><span className="vv-rail-icon">⚙</span>Settings & accessibility</a>
      </div>
    </nav>
  );
}
