import type { MetadataRoute } from "next";
import { en } from "@/i18n/en";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: en.meta.siteName,
    short_name: "ECRL Fares",
    description: en.meta.tripDescription,
    start_url: "/trip",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "en-MY",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
