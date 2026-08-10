"use client";

import { useEffect, useRef, useState } from "react";

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
};

export default function ChatThread({
  conversationId,
  title,
  initialMessages,
}: {
  conversationId: string;
  title: string;
  initialMessages: Msg[];
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        body: JSON.stringify({ conversationId, message: userText }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.answer ?? "Something went wrong.",
          citations: data.citations ?? [],
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
        <h2 style={{ marginTop: 0 }}>{title}</h2>
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
        <div className="composer-row" style={{ marginTop: 10 }}>
          {micSupported && (
            <button type="button" className="secondary" onClick={toggleMic}>
              {listening ? "Stop mic" : "Mic"}
            </button>
          )}
          <button type="button" onClick={send} disabled={loading || !text.trim()}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
