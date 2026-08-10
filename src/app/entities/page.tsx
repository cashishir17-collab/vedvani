import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { LOCALE_COOKIE_NAME, isLocale, t } from "@/lib/i18n";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entities — VedVani",
  description: "Browse deities, concepts, places, and people from Hindu tradition, with descriptions across multiple schools of thought.",
};

export const dynamic = "force-dynamic";

const TYPE_ORDER = ["deity", "concept", "place", "person"] as const;
const TYPE_LABELS: Record<string, string> = {
  deity: "Deities",
  concept: "Concepts",
  place: "Places",
  person: "People",
};

export default async function EntitiesIndexPage() {
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";

  const entities = await prisma.knowledgeEntity.findMany({ orderBy: { name: "asc" } });

  const grouped = new Map<string, typeof entities>();
  for (const e of entities) {
    const list = grouped.get(e.entityType) ?? [];
    list.push(e);
    grouped.set(e.entityType, list);
  }

  const orderedTypes = [
    ...TYPE_ORDER.filter((ty) => grouped.has(ty)),
    ...Array.from(grouped.keys()).filter((ty) => !(TYPE_ORDER as readonly string[]).includes(ty)),
  ];

  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{t(locale, "entitiesTitle")}</h2>
        <p className="muted">{t(locale, "entitiesIntro")}</p>
      </div>
      {orderedTypes.map((entityType) => (
        <div className="card" key={entityType}>
          <h3 style={{ marginTop: 0 }}>{TYPE_LABELS[entityType] ?? entityType}</h3>
          <div className="conversation-list">
            {(grouped.get(entityType) ?? []).map((e) => (
              <a key={e.id} href={`/entities/${e.slug}`}>
                <div>{e.name}</div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
