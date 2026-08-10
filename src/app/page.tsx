"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setMicSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
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

  async function submit() {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();
      if (data.conversationId) {
        router.push(`/chat/${data.conversationId}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>VedVani</h1>
        <p className="muted">
          Ask about the Vedas, Upanishads, Bhagavad Gita, or Puranas. Answers are grounded in a
          cited, public-domain corpus and clearly label synthesis vs. scripture vs. tradition.
          VedVani never claims divine authority and stays neutral across sampradayas.
        </p>
      </div>
      <div className="card">
        <textarea
          rows={4}
          placeholder="e.g. What does the Gita say about acting without attachment to results?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="composer-row" style={{ marginTop: 10 }}>
          {micSupported && (
            <button type="button" className="secondary" onClick={toggleMic}>
              {listening ? "Stop mic" : "Mic"}
            </button>
          )}
          <button type="button" onClick={submit} disabled={loading || !text.trim()}>
            {loading ? "Asking..." : "Ask VedVani"}
          </button>
        </div>
      </div>
    </div>
  );
}
