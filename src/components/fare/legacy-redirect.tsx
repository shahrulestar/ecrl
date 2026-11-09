"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fareQueryString, parseFareSearch, partyFromSearch } from "@/lib/fare-search";

/** Old links used `/?from=Kota Bharu&adults=2`. Send them to the short `/trip` URL. */
export function LegacyRedirect() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = parseFareSearch(Object.fromEntries(params.entries()));
    const party = partyFromSearch(search);
    const qs = fareQueryString({
      from: search.from,
      to: search.to,
      ...party,
      my: params.get("my") !== "false",
    });
    router.replace(`/trip${qs ? `?${qs}` : ""}`);
  }, [router]);

  return null;
}
