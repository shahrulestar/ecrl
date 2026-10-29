import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base) return [];
  return [
    {
      url: new URL("/", base).href,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
