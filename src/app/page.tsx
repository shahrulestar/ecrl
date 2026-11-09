import { Suspense } from "react";
import { LegacyRedirect } from "@/components/fare/legacy-redirect";

export default function Page() {
  return (
    <Suspense>
      <LegacyRedirect />
    </Suspense>
  );
}
