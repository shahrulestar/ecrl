"use client";

import { useRouter } from "next/navigation";
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
import { fill } from "@/i18n/fill";
import { useI18n } from "@/i18n/provider";
import { tripHref } from "@/lib/fare-search";
import { useFareState } from "@/lib/use-fare-state";
import { code, PromoBanner, StationSelect, usePromoPhase } from "@/components/fare/shared";

export function StationTab() {
  const { m } = useI18n();
  const router = useRouter();
  const [{ from }, setQuery] = useFareState();
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
        <CardTitle>{m.station.title}</CardTitle>
        <CardDescription>
          {from ? fill(m.station.picked, { from }) : m.station.emptyLead}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <PromoBanner phase={phase} />
        <StationSelect id="line-from" label={m.station.from} value={from} onChange={setFrom} />
        {from == null ? (
          <Empty className="border-0 px-2 py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={Train01Icon} strokeWidth={2} />
              </EmptyMedia>
              <EmptyTitle>{m.station.emptyTitle}</EmptyTitle>
              <EmptyDescription>{m.station.emptyBody}</EmptyDescription>
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
                        {station.state} ·{" "}
                        {fill(m.station.away, {
                          count: hops,
                          unit: hops === 1 ? m.station.stopOne : m.station.stopMany,
                        })}
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
