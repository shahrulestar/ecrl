import type { Metadata } from "next";
import { Suspense } from "react";
import { TableTab } from "@/components/fare/table-tab";
import { pageMetadata } from "@/i18n/seo";

export const metadata: Metadata = pageMetadata("table");

export default function TablePage() {
  return (
    <Suspense>
      <TableTab />
    </Suspense>
  );
}
