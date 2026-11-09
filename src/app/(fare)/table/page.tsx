import type { Metadata } from "next";
import { Suspense } from "react";
import { TableTab } from "@/components/fare/table-tab";

export const metadata: Metadata = {
  title: { absolute: "ECRL Fare Table: all 16 stations" },
  description:
    "Economy Transit starting fares between all 16 ECRL stations, Gombak to Kota Bharu, in one table.",
  alternates: { canonical: "/table" },
};

export default function TablePage() {
  return (
    <Suspense>
      <TableTab />
    </Suspense>
  );
}
