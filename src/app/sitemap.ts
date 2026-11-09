import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const pages = [
  { path: "/trip", priority: 1 },
  { path: "/station", priority: 0.7 },
  { path: "/table", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base) return [];
  const href = (path: string) => new URL(path, base).href;
  return pages.map(({ path, priority }) => ({
    url: href(path),
    changeFrequency: "monthly" as const,
    priority,
    alternates: { languages: { "en-MY": href(path), "ms-MY": href(`/ms${path}`) } },
  }));
}
