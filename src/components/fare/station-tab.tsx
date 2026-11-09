"use client";

import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { HugeiconsIcon } from "@hugeicons/react";
import { Train01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatRm, getFare, stationIndex, stations, type StationName } from "@/data/fares";
import { stationSearchParsers, stationUrlKeys, tripHref } from "@/lib/fare-search";
import { code, PromoBanner, StationSelect, usePromoPhase } from "@/components/fare/shared";

export function StationTab() {
  const router = useRouter();
  const [{ from }, setQuery] = useQueryStates(stationSearchParsers, {
    urlKeys: stationUrlKeys,
    clearOnDefault: true,
  });
  const phase = usePromoPhase();

  function setFrom(value: StationName | null) {
    setQuery({ from: value });
  }

  function openPair(origin: StationName, destination: StationName) {
    router.push(tripHref(origin, destination));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fares from one station</CardTitle>
        <CardDescription>
          {from
            ? `Every stop from ${from}, in line order. Tap one to see the full fare.`
            : "Pick a station, then tap where you're going to see the full fare."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <PromoBanner phase={phase} />
        <StationSelect id="line-from" label="From" value={from} onChange={setFrom} fit />
        {from == null ? (
          <Empty className="border-0 px-2 py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={Train01Icon} strokeWidth={2} />
              </EmptyMedia>
              <EmptyTitle>No station picked yet</EmptyTitle>
              <EmptyDescription>
                Choose where you&apos;re starting to see the fare to every other stop.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-1">
            {stations
              .filter((station) => station.name !== from)
              .map((station) => {
                const fare = getFare(from, station.name);
                const hops = Math.abs(stationIndex(station.name) - stationIndex(from));
                return (
                  <Button
                    key={station.name}
                    variant="ghost"
                    className="h-auto min-h-14 w-full justify-between px-3"
                    onClick={() => openPair(from, station.name)}
                  >
                    <span className="min-w-0 text-left">
                      <span className="block truncate text-sm font-medium">
                        {code(station.index)} {station.name}
                      </span>
                      <span className="block text-xs font-normal text-muted-foreground">
                        {station.state} · {hops} {hops === 1 ? "stop" : "stops"} away
                      </span>
                    </span>
                    <span className="shrink-0 type-fare">
                      {fare == null ? "—" : formatRm(fare)}
                    </span>
                  </Button>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
