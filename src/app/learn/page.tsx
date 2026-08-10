import { cookies } from "next/headers";
import { LEARNING_PATHS } from "@/lib/learningPaths";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning paths — VedVani",
  description: "Guided learning paths through Hindu scripture and philosophy, grounded in cited source passages.",
};

export const dynamic = "force-dynamic";

export default function LearnIndexPage() {
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";
  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{t(locale, "learnTitle")}</h2>
        <p className="muted">{t(locale, "learnIntro")}</p>
      </div>
      <div className="card">
        <div className="conversation-list">
          {LEARNING_PATHS.map((path) => (
            <a key={path.slug} href={`/learn/${path.slug}`}>
              <div>{path.title}</div>
              <div className="muted">{path.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
