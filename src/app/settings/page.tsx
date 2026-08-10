import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";
import LocaleToggle from "../LocaleToggle";

export const metadata: Metadata = { title: "Settings & Accessibility — VedVani" };

export default function SettingsPage() {
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";

  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Settings & accessibility</h1>
        <p className="muted">
          VedVani aims for WCAG 2.2 AA on core flows: semantic headings, visible keyboard focus, alt text and
          aria-labels on icon-only buttons, and respect for reduced-motion preferences.
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Language</h3>
        <LocaleToggle locale={locale} />
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Reading text size</h3>
        <p className="muted">Sanskrit/long-form text size is adjustable from the reader's study panel and persists in your browser (localStorage). Full in-page controls are a follow-up.</p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Simple explanation mode</h3>
        <p className="muted">Set "Response style" to <strong>Child-friendly</strong> when asking a question — this maps to the same responseMode field used across chat.</p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Voice</h3>
        <p className="muted">
          Voice input is available in supported browsers via the mic button on the Ask composer. Voice output
          (listen/playback) and full greeting states are stubbed pending a wired text-to-speech pipeline —
          typing and reading remain fully usable without it.
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Account</h3>
        <a href="/account">Manage account, data export and deletion</a>
      </div>
    </div>
  );
}
