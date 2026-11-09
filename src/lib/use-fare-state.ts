"use client";

import { useQueryState } from "nuqs";
import type { FareState } from "@/lib/fare-code";
import { DEFAULT_FARE_STATE, FARE_QUERY_KEY, parseAsFareCode } from "@/lib/fare-search";

/** Whole selection (stations, party, citizenship) lives in the single `q` URL param. */
export function useFareState() {
  const [state, setState] = useQueryState(
    FARE_QUERY_KEY,
    parseAsFareCode.withDefault(DEFAULT_FARE_STATE).withOptions({ clearOnDefault: true }),
  );

  function update(patch: Partial<FareState>) {
    void setState((current) => ({ ...current, ...patch }));
  }

  return [state, update] as const;
}
