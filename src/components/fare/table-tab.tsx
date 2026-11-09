"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRm, getFare, stations, type StationName } from "@/data/fares";
import { fill } from "@/i18n/fill";
import { useI18n } from "@/i18n/provider";
import { tripHref } from "@/lib/fare-search";
import { useFareState } from "@/lib/use-fare-state";
import { code, PromoBanner, usePromoPhase } from "@/components/fare/shared";

export function TableTab() {
  const { m } = useI18n();
  const router = useRouter();
  const [{ from, to }] = useFareState();
  const phase = usePromoPhase();

  function openPair(origin: StationName, destination: StationName) {
    router.push(tripHref(origin, destination));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.table.title}</CardTitle>
        <CardDescription>{m.table.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <PromoBanner phase={phase} />
        <Table className="w-full min-w-[44rem] text-xs tabular-nums lg:min-w-full lg:table-fixed lg:text-sm">
          <caption className="sr-only">{m.table.caption}</caption>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 w-40 bg-card">{m.table.board}</TableHead>
              {stations.map((station) => (
                <TableHead key={station.name} className="px-1 text-center" title={station.name}>
                  {code(station.index)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {stations.map((origin) => (
              <TableRow key={origin.name}>
                <TableHead className="sticky left-0 z-10 bg-card text-left whitespace-nowrap">
                  {code(origin.index)} {origin.name}
                </TableHead>
                {stations.map((destination) => {
                  const fare = getFare(origin.name, destination.name);
                  const selected = origin.name === from && destination.name === to;
                  return (
                    <TableCell key={destination.name} className="p-1 text-center">
                      {fare == null ? (
                        <span className="mx-auto flex size-9 items-center justify-center text-muted-foreground lg:w-full">
                          —
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant={selected ? "default" : "ghost"}
                          className="mx-auto flex size-9 px-0 lg:w-full lg:px-1"
                          onClick={() => openPair(origin.name, destination.name)}
                          aria-label={fill(m.table.cell, {
                            from: origin.name,
                            to: destination.name,
                            fare: formatRm(fare),
                          })}
                        >
                          {fare}
                        </Button>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
