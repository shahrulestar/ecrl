import type { Metadata } from "next";
import { Suspense } from "react";
import { TripTab } from "@/components/fare/trip-tab";

export const metadata: Metadata = {
  alternates: { canonical: "/trip" },
};

export default function TripPage() {
  return (
    <Suspense>
      <TripTab />
    </Suspense>
  );
}
