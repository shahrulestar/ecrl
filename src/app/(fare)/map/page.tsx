import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { LineMap } from "@/components/fare/route-map";
import { pageMetadata } from "@/i18n/seo";

export const metadata: Metadata = pageMetadata("map");

/** Draw under Safari's bars and notch; the browser chrome takes the page colour. */
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function MapPage() {
  return (
    <Suspense>
      <LineMap />
    </Suspense>
  );
}
