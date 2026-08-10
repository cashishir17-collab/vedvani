"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

/**
 * Phase 6 (BRD FR-CHAT-006): response mode selector shared by the home
 * composer and the in-thread composer. The chosen mode is sent to
 * POST /api/chat and threaded into runChatTurn() in src/lib/chat.ts, where
 * it adjusts the system prompt instructions given to Claude.
 */
export type ResponseMode = "concise" | "detailed" | "child-friendly" | "academic" | "devotional";

export const RESPONSE_MODES: ResponseMode[] = ["concise", "detailed", "child-friendly", "academic", "devotional"];

const LABEL_KEYS: Record<ResponseMode, Parameters<typeof t>[1]> = {
  concise: "modeConcise",
  detailed: "modeDetailed",
  "child-friendly": "modeChildFriendly",
  academic: "modeAcademic",
  devotional: "modeDevotional",
};

export default function ResponseModeSelect({
  locale,
  value,
  onChange,
}: {
  locale: Locale;
  value: ResponseMode;
  onChange: (mode: ResponseMode) => void;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.9rem" }} className="muted">
      {t(locale, "responseMode")}
      <select value={value} onChange={(e) => onChange(e.target.value as ResponseMode)}>
        {RESPONSE_MODES.map((mode) => (
          <option key={mode} value={mode}>
            {t(locale, LABEL_KEYS[mode])}
          </option>
        ))}
      </select>
    </label>
  );
}
