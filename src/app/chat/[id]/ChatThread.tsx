"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALE_COOKIE_NAME, isLocale, t, type Locale } from "@/lib/i18n";
import ResponseModeSelect, { type ResponseMode } from "../../ResponseModeSelect";

function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(new RegExp(`${LOCALE_COOKIE_NAME}=([^;]+)`));
  const val = match?.[1];
  return isLocale(val) ? val : "en";
}

type Citation = {
  id: string;
  title: string;
  sourceWork: string;
  location: string;
  sourceType: string;
  attribution: string;
  traditionTags: string[];
  snippet: string;
};

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
  followups?: string[];
};

export default function ChatThread({
  conversationId,
  title,
  pinned: initialPinned,
  initialMessages,
}: {
  conversationId: string;
  title: string;
  pinned?: boolean;
  initialMessages: Msg[];
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [threadTitle, setThreadTitle] = useState(title);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(title);
  const [pinned, setPinned] = useState(!!initialPinned);
  const [savingMeta, setSavingMeta] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("en");
  const [responseMode, setResponseMode] = useState<ResponseMode>("detailed");
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setLocale(readLocaleCookie());
  }, []);

  async function saveTitle() {
    const nextTitle = titleDraft.trim();
    setEditingTitle(false);
    if (!nextTitle || nextTitle === threadTitle) {
      setTitleDraft(threadTitle);
      return;
    }
    setThreadTitle(nextTitle);
    setSavingMeta(true);
    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextTitle }),
      });
    } finally {
      setSavingMeta(false);
    }
  }

  async function togglePinned() {
    const next = !pinned;
    setPinned(next);
    setSavingMeta(true);
    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: next }),
      });
    } finally {
      setSavingMeta(false);
    }
  }

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setMicSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? prev + " " + transcript : transcript));
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  function toggleMic() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }

  async function send() {
    if (!text.trim() || loading) return;
    const userText = text.trim();
    setText("");
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, role: "user", content: userText, citations: [] },
    ]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: userText, responseMode }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.answer ?? "Something went wrong.",
          citations: data.citations ?? [],
          followups: data.followups ?? [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function reportMessage(messageId: string) {
    const note = window.prompt("What's wrong with this answer? (brief note)");
    if (!note || !note.trim()) return;
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, messageId, note: note.trim() }),
      });
      window.alert("Thanks — this has been flagged for review.");
    } catch {
      window.alert("Sorry, something went wrong submitting your report.");
    }
  }

  async function listen(messageId: string, content: string) {
    if (!ttsAvailable) return;
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    });
    const data = await res.json();
    if (!data.available) {
      setTtsAvailable(false);
      return;
    }
    setPlayingId(messageId);
    const audio = new Audio(data.audioDataUrl);
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio.play();
  }

  return (
    <div>
      <div className="card">
        <div className="row-between" style={{ alignItems: "center" }}>
          {editingTitle ? (
            <input
              type="text"
              value={titleDraft}
              autoFocus
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setTitleDraft(threadTitle);
                  setEditingTitle(false);
                }
              }}
              style={{ fontSize: "1.25rem", fontWeight: 600 }}
            />
          ) : (
            <h2
              style={{ marginTop: 0, marginBottom: 0, cursor: "pointer" }}
              onClick={() => {
                setTitleDraft(threadTitle);
                setEditingTitle(true);
              }}
              title="Click to rename"
            >
              {threadTitle}
            </h2>
          )}
          <button type="button" className="secondary" onClick={togglePinned} disabled={savingMeta}>
            {pinned ? "Unpin" : "Pin"}
          </button>
        </div>
      </div>
      <div>
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            <div className="muted" style={{ marginBottom: 4 }}>
              {m.role === "user" ? "You" : "VedVani"}
            </div>
            <div>{m.content}</div>
            {m.role === "assistant" && (
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                {ttsAvailable && (
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => listen(m.id, m.content)}
                    disabled={playingId === m.id}
                  >
                    {playingId === m.id ? "Playing..." : "Listen"}
                  </button>
                )}
                <button type="button" className="secondary" onClick={() => reportMessage(m.id)}>
                  Report this answer
                </button>
              </div>
            )}
            {m.role === "assistant" && m.followups && m.followups.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {m.followups.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    className="secondary"
                    onClick={() => setText(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
            {m.citations.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div className="muted">Sources:</div>
                {m.citations.map((c) => (
                  <div key={c.id} className="citation">
                    <strong>{c.sourceWork} {c.location}</strong>
                    <span className={`badge ${c.sourceType}`}>{c.sourceType}</span>
                    <div className="muted" style={{ marginTop: 4 }}>{c.attribution}</div>
                    <div style={{ marginTop: 4 }}>{c.snippet}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="card">
        <textarea
          rows={3}
          placeholder="Continue the conversation..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="composer-row" style={{ marginTop: 10, alignItems: "center" }}>
          <ResponseModeSelect locale={locale} value={responseMode} onChange={setResponseMode} />
          {micSupported && (
            <button type="button" className="secondary" onClick={toggleMic}>
              {listening ? t(locale, "stopMic") : t(locale, "mic")}
            </button>
          )}
          <button type="button" onClick={send} disabled={loading || !text.trim()}>
            {loading ? t(locale, "sending") : t(locale, "send")}
          </button>
        </div>
      </div>
    </div>
  );
}
