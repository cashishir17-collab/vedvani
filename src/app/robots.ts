import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

function baseUrl(): string {
  return process.env.APP_BASE_URL || "https://vedvani.info";
}

export default function robots(): MetadataRoute.Robots {
  const base = baseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/memory", "/history", "/bookmarks"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
