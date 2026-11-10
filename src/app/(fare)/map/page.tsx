import { Suspense } from "react";
import type { Metadata } from "next";
import { LineMap } from "@/components/fare/route-map";
import { pageMetadata } from "@/i18n/seo";

export const metadata: Metadata = pageMetadata("map");

export default function MapPage() {
  return (
    <Suspense>
      <LineMap />
    </Suspense>
  );
}
