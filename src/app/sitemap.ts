import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function baseUrl(): string {
  return process.env.APP_BASE_URL || "https://vedvani.info";
}

const STATIC_ROUTES = [
  "",
  "/read",
  "/learn",
  "/entities",
  "/login",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
  }));

  const [passages, entities] = await Promise.all([
    prisma.corpusPassage.findMany({ select: { id: true, createdAt: true } }),
    prisma.knowledgeEntity.findMany({ select: { slug: true, createdAt: true } }),
  ]);

  const passageEntries: MetadataRoute.Sitemap = passages.map((p) => ({
    url: `${base}/read/${p.id}`,
    lastModified: p.createdAt,
  }));

  const entityEntries: MetadataRoute.Sitemap = entities.map((e) => ({
    url: `${base}/entities/${e.slug}`,
    lastModified: e.createdAt,
  }));

  return [...staticEntries, ...passageEntries, ...entityEntries];
}
