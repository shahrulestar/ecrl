"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fareStateQuery, legacyFareState } from "@/lib/fare-search";

/** Old links used `/?from=Kota Bharu&adults=2` or `/?f=kb&t=gombak`. Send them to `/trip?q=...`. */
export function LegacyRedirect() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.has("q") ? null : legacyFareState(params);
    const qs = state
      ? fareStateQuery(state)
      : params.has("q")
        ? `q=${encodeURIComponent(params.get("q") ?? "")}`
        : "";
    router.replace(`/trip${qs ? `?${qs}` : ""}`);
  }, [router]);

  return null;
}
