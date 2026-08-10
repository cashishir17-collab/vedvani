"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Phase 6: simple toggle button that flips the `vv_locale` cookie between
 * "en" and "hi" via POST /api/locale, then refreshes the current route so
 * server components re-render with the new locale.
 */
export default function LocaleToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const next: Locale = locale === "en" ? "hi" : "en";

  async function toggle() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className="secondary"
      onClick={toggle}
      disabled={pending}
      aria-label={locale === "en" ? "Switch to Hindi" : "Switch to English"}
    >
      {locale === "en" ? "हिन्दी" : "English"}
    </button>
  );
}
