import type { Metadata } from "next";
import { Suspense } from "react";
import { FareBoard } from "@/components/fare/station-tab";
import { pageMetadata } from "@/i18n/seo";

export const metadata: Metadata = pageMetadata("station");

export default function StationPage() {
  return (
    <Suspense>
      <FareBoard />
    </Suspense>
  );
}
