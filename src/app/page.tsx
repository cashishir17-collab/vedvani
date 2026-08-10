"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOCALE_COOKIE_NAME, isLocale, t, type Locale } from "@/lib/i18n";
import ResponseModeSelect, { type ResponseMode } from "./ResponseModeSelect";

function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(new RegExp(`${LOCALE_COOKIE_NAME}=([^;]+)`));
  const val = match?.[1];
  return isLocale(val) ? val : "en";
}

export default function HomePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const [responseMode, setResponseMode] = useState<ResponseMode>("detailed");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setLocale(readLocaleCookie());
  }, []);

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
        body: JSON.stringify({ message: text.trim(), responseMode }),
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
        <h1 style={{ marginTop: 0 }}>{t(locale, "homeTitle")}</h1>
        <p className="muted">{t(locale, "homeIntro")}</p>
      </div>
      <div className="card">
        <textarea
          rows={4}
          placeholder="e.g. What does the Gita say about acting without attachment to results?"
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
          <button type="button" onClick={submit} disabled={loading || !text.trim()}>
            {loading ? t(locale, "asking") : t(locale, "askVedVani")}
          </button>
        </div>
      </div>
    </div>
  );
}
