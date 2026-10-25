import { Suspense } from "react";
import { FareApp } from "@/components/fare-app";

export default function Page() {
  return (
    <Suspense>
      <FareApp />
    </Suspense>
  );
}
