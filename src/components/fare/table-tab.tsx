"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRm, getFare, stationIndex, stations, type StationName } from "@/data/fares";
import { fill } from "@/i18n/fill";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { tripHref } from "@/lib/fare-search";
import { useFareState } from "@/lib/use-fare-state";
import { code, PromoBanner, usePromoPhase } from "@/components/fare/shared";

/** Zero-based position in the fare grid. */
interface GridCell {
  row: number;
  col: number;
}

export function TableTab() {
  const { m } = useI18n();
  const router = useRouter();
  const [{ from, to }] = useFareState();
  const phase = usePromoPhase();
  const [hover, setHover] = useState<GridCell | null>(null);
  /** The hovered or focused cell, else the pair picked on the trip tab. */
  const activeRow = hover ? hover.row : from ? stationIndex(from) : -1;
  const activeCol = hover ? hover.col : to ? stationIndex(to) : -1;
  const activeFrom = stations[activeRow]?.name;
  const activeTo = stations[activeCol]?.name;
  const activeFare = activeFrom && activeTo ? getFare(activeFrom, activeTo) : null;
  const pickedRow = from ? stationIndex(from) : -1;
  const pickedCol = to ? stationIndex(to) : -1;

  function openPair(origin: StationName, destination: StationName) {
    router.push(tripHref(origin, destination));
  }

  return (
    <Card>
      <CardHeader className="max-lg:has-data-[slot=card-action]:grid-cols-1">
        <CardTitle>{m.table.title}</CardTitle>
        <CardDescription>{m.table.description}</CardDescription>
        <CardAction
          aria-hidden="true"
          className="text-sm font-medium tabular-nums max-lg:col-start-1 max-lg:row-span-1 max-lg:row-start-3 max-lg:w-full max-lg:justify-self-start max-lg:text-left lg:w-80 lg:truncate lg:text-right"
        >
          {activeFrom && activeTo && activeFare != null
            ? fill(m.table.cell, { from: activeFrom, to: activeTo, fare: formatRm(activeFare) })
            : null}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <PromoBanner phase={phase} />
        <Table
          className="w-full min-w-[44rem] border-separate border-spacing-0.5 text-xs tabular-nums lg:min-w-full lg:table-fixed lg:border-spacing-1 lg:text-sm"
          onPointerLeave={() => setHover(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setHover(null);
          }}
        >
          <caption className="sr-only">{m.table.caption}</caption>
          <TableHeader>
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="sticky left-0 z-10 w-40 rounded-md bg-card">{m.table.board}</TableHead>
              {stations.map((station, col) => (
                <TableHead
                  key={station.name}
                  className={cn(
                    "rounded-md px-1 text-center",
                    col === activeCol && "bg-muted",
                  )}
                  title={station.name}
                >
                  {code(station.index)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {stations.map((origin, row) => (
              <TableRow key={origin.name} className="border-0 hover:bg-transparent">
                <TableHead
                  className={cn(
                    "sticky left-0 z-10 rounded-md text-left whitespace-nowrap",
                    row === activeRow ? "bg-muted" : "bg-card",
                  )}
                >
                  {code(origin.index)} {origin.name}
                </TableHead>
                {stations.map((destination, col) => {
                  const fare = getFare(origin.name, destination.name);
                  const onPath =
                    hover !== null &&
                    ((row === hover.row && col <= hover.col) ||
                      (col === hover.col && row <= hover.row));
                  const isHoverCell =
                    hover !== null && row === hover.row && col === hover.col;
                  const isPicked =
                    hover === null &&
                    pickedRow >= 0 &&
                    pickedCol >= 0 &&
                    row === pickedRow &&
                    col === pickedCol;
                  const cellClass = cn(
                    "rounded-md p-0 text-center transition-colors focus-within:ring-2 focus-within:ring-ring/30",
                    isHoverCell && "bg-primary text-primary-foreground",
                    onPath && !isHoverCell && "bg-muted",
                    isPicked && "lg:bg-primary lg:text-primary-foreground",
                  );

                  return (
                    <TableCell key={destination.name} className={cellClass}>
                      {fare == null ? (
                        <span className="flex h-9 w-full items-center justify-center text-muted-foreground">
                          —
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className={cn(
                            "h-9 w-full min-w-0 rounded-[inherit] border-0 bg-transparent px-1 font-medium text-inherit shadow-none hover:bg-transparent aria-expanded:bg-transparent focus-visible:ring-0 dark:hover:bg-transparent",
                            isHoverCell &&
                              "text-primary-foreground hover:!text-primary-foreground aria-expanded:!text-primary-foreground",
                            isPicked &&
                              "lg:text-primary-foreground lg:hover:!text-primary-foreground lg:aria-expanded:!text-primary-foreground",
                          )}
                          onClick={() => openPair(origin.name, destination.name)}
                          onPointerEnter={(event) => {
                            if (event.pointerType === "mouse") setHover({ row, col });
                          }}
                          onFocus={() => setHover({ row, col })}
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
