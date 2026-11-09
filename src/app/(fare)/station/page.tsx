import type { Metadata } from "next";
import { Suspense } from "react";
import { StationTab } from "@/components/fare/station-tab";

export const metadata: Metadata = {
  title: { absolute: "ECRL Fares by Station: every stop from one station" },
  description:
    "Pick an ECRL station and see the Economy Transit starting fare to every other stop, in line order.",
  alternates: { canonical: "/station" },
};

export default function StationPage() {
  return (
    <Suspense>
      <StationTab />
    </Suspense>
  );
}
