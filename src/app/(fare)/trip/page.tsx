import type { Metadata } from "next";
import { Suspense } from "react";
import { TripTab } from "@/components/fare/trip-tab";
import { pageMetadata } from "@/i18n/seo";

export const metadata: Metadata = pageMetadata("trip");

export default function TripPage() {
  return (
    <Suspense>
      <TripTab />
    </Suspense>
  );
}
