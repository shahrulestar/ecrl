import { Suspense } from "react";
import { FareShell } from "@/components/fare/fare-shell";

export default function FareLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <FareShell>{children}</FareShell>
    </Suspense>
  );
}
