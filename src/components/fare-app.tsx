"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  AlertCircleIcon,
  ArrowLeftRightIcon,
  ArrowUpDownIcon,
  MinusSignIcon,
  Moon01Icon,
  PlusSignIcon,
  Sun01Icon,
  Train01Icon,
} from "@hugeicons/core-free-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  fareMeta,
  formatRm,
  getFare,
  pathBetween,
  publishedJourney,
  stationIndex,
  stations,
  type StationName,
} from "@/data/fares";
import { fareSearchParams, parseFareSearch, partyFromSearch, PARTY_MAX, type Party } from "@/lib/fare-search";

const STATES = ["Selangor", "Pahang", "Terengganu", "Kelantan"] as const;

const partyRates = [
  { key: "adults", label: "Adult", hint: "Full fare", off: 0 },
  { key: "students", label: "Student", hint: "13–24 · 40% off", off: 0.4 },
  { key: "half", label: "Child, senior, OKU, pensioner", hint: "50% off", off: 0.5 },
] as const;

type TabId = "quote" | "line" | "matrix";

function isStation(value: unknown): value is StationName {
  return stations.some((station) => station.name === value);
}

function code(index: number) {
  return String(index).padStart(2, "0");
}

function StationSelect({
  id,
  label,
  value,
  onChange,
  fit = false,
}: {
  id: string;
  label: string;
  value: StationName | null;
  onChange: (value: StationName) => void;
  fit?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-2", fit ? "w-fit max-w-full self-start" : "min-w-0")}>
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          if (isStation(next)) onChange(next);
        }}
      >
        <SelectTrigger id={id} className={cn("min-h-11", fit ? "w-fit" : "w-full")}>
          <SelectValue placeholder="Choose a station" />
        </SelectTrigger>
        <SelectContent
          className={fit ? "w-max" : undefined}
          style={fit ? { width: "max-content", minWidth: "var(--anchor-width)" } : undefined}
        >
          {STATES.map((state) => (
            <SelectGroup key={state}>
              <SelectLabel>{state}</SelectLabel>
              {stations
                .filter((station) => station.state === state)
                .map((station) => (
                  <SelectItem
                    key={station.name}
                    value={station.name}
                    className={cn("min-h-11 cursor-pointer", fit && "w-auto")}
                  >
                    {code(station.index)} {station.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  const dark = ready && resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-11"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <HugeiconsIcon icon={dark ? Sun01Icon : Moon01Icon} strokeWidth={2} />
    </Button>
  );
}

function LineDots({ from, to }: { from: StationName; to: StationName }) {
  const a = stationIndex(from);
  const b = stationIndex(to);
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);

  return (
    <ol className="flex w-full items-center" aria-hidden="true">
      {stations.map((station, i) => {
        const on = i >= lo && i <= hi;
        const end = i === a || i === b;
        const last = i === stations.length - 1;
        return (
          <li
            key={station.name}
            className={cn("flex items-center", last ? "shrink-0" : "min-w-0 flex-1")}
          >
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                end ? "size-2.5 bg-primary" : on ? "bg-primary" : "bg-border",
              )}
            />
            {last ? null : (
              <span
                className={cn(
                  "h-px min-w-0 flex-1",
                  i >= lo && i < hi ? "bg-foreground" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function sen(amount: number) {
  return Math.round(amount * 100) / 100;
}

function PartyCount({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-11"
          aria-label={`Fewer ${label}`}
          disabled={value <= 0}
          onClick={() => onChange(value - 1)}
        >
          <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
        </Button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="size-11"
          aria-label={`More ${label}`}
          disabled={value >= PARTY_MAX}
          onClick={() => onChange(value + 1)}
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

function OutputCard({
  from,
  to,
  party,
}: {
  from: StationName | null;
  to: StationName | null;
  party: Party;
}) {
  if (!from || !to) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fare</CardTitle>
          <CardDescription>Your quote shows up here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty className="border-0 px-2 py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={Train01Icon} strokeWidth={2} />
              </EmptyMedia>
              <EmptyTitle>No fare yet</EmptyTitle>
              <EmptyDescription>
                Choose a from station and a to station to see the Economy Transit starting fare.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  if (from === to) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fare</CardTitle>
          <CardDescription>{from}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
            <AlertTitle>Same station</AlertTitle>
            <AlertDescription>
              Pick two different stations. A fare needs a journey, and {from} to {from} is not a
              trip.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const fare = getFare(from, to);
  if (fare == null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fare</CardTitle>
          <CardDescription>
            {from} to {to}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
            <AlertTitle>No published fare</AlertTitle>
            <AlertDescription>
              There is no Economy Transit starting fare for {from} to {to}. Try another pair.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const people = party.adults + party.students + party.half;
  if (people === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fare</CardTitle>
          <CardDescription>
            {from} to {to}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
            <AlertTitle>No passengers</AlertTitle>
            <AlertDescription>
              Add at least one adult, student, or concession fare. Each type is priced on its own,
              then added into the total.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const published = publishedJourney(from, to);
  const path = pathBetween(from, to);
  const between = Math.max(0, path.length - 2);
  const direction = stationIndex(from) < stationIndex(to) ? "Eastbound" : "Westbound";
  const lines = partyRates
    .map((rate) => {
      const count = party[rate.key];
      const each = sen(fare * (1 - rate.off));
      return { ...rate, count, each, amount: sen(each * count) };
    })
    .filter((line) => line.count > 0);
  const total = sen(lines.reduce((sum, line) => sum + line.amount, 0));
  const hopSum = path.slice(1).reduce((sum, stop, i) => {
    const hop = getFare(path[i].name, stop.name);
    return sum + (hop ?? 0);
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Starting fare · Economy Transit</CardDescription>
        <CardTitle className="font-heading text-4xl tracking-tight">{formatRm(total)}</CardTitle>
      </CardHeader>
      <CardContent className="gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed">
            {from} to {to}
          </p>
          <p className="text-sm text-muted-foreground">
            {direction}
            {between === 0
              ? " · next station"
              : ` · ${between} ${between === 1 ? "station" : "stations"} in between`}
            {published ? ` · ${published.km} km` : null}
          </p>
          {lines.length > 1 || lines[0]?.off ? (
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              {lines.map((line) => (
                <li key={line.key} className="flex items-baseline justify-between gap-3">
                  <span>
                    {line.label} × {line.count}
                    {line.off > 0 ? ` · ${line.hint}` : ""}
                  </span>
                  <span className="shrink-0">{formatRm(line.amount)}</span>
                </li>
              ))}
            </ul>
          ) : people > 1 ? (
            <p className="text-sm text-muted-foreground">
              {formatRm(fare)} × {people} adults
            </p>
          ) : null}
          {published ? (
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <p>Transit {published.transitTime}</p>
              <p>
                Express starts at {formatRm(published.expressFare)} · {published.expressTime}
              </p>
            </div>
          ) : null}
          <p className="text-xs leading-relaxed text-muted-foreground">
            Published starting rate. Dynamic pricing can change the price by time, demand, and seats.
            Return fare is the same.
          </p>
        </div>
        <Separator />
        <div className="flex flex-col gap-5">
          <LineDots from={from} to={to} />
          <ol className="flex flex-col">
            {path.map((stop, i) => {
              const previous = path[i - 1];
              const hop = previous ? getFare(previous.name, stop.name) : null;
              return (
                <li key={stop.name} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < path.length - 1 ? (
                    <span className="absolute top-3 bottom-0 left-[4px] w-px bg-border" />
                  ) : null}
                  <span className="relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full bg-primary" />
                  <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{stop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {code(stop.index)} · {stop.state}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm text-muted-foreground">
                      {hop == null ? "Board" : formatRm(hop)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          {hopSum !== fare ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Adjacent hops add up to {formatRm(hopSum)}. The through fare is {formatRm(fare)}, which
              is the published station-to-station rate, not the sum of hops.
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function FareApp() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.toString();
  const search = useMemo(
    () => parseFareSearch(Object.fromEntries(new URLSearchParams(query))),
    [query],
  );
  const [tab, setTab] = useState<TabId>("quote");
  const [from, setFrom] = useState<StationName | null>(search.from ?? null);
  const [to, setTo] = useState<StationName | null>(search.to ?? null);
  const [party, setParty] = useState<Party>(() => partyFromSearch(search));

  useEffect(() => {
    setFrom(search.from ?? null);
    setTo(search.to ?? null);
    setParty(partyFromSearch(search));
  }, [search]);

  useEffect(() => {
    const next = fareSearchParams({ from, to, party });
    if (
      next.from === search.from &&
      next.to === search.to &&
      next.adults === search.adults &&
      next.students === search.students &&
      next.half === search.half
    ) {
      return;
    }
    const qs = new URLSearchParams();
    if (next.from) qs.set("from", next.from);
    if (next.to) qs.set("to", next.to);
    if (next.adults !== undefined) qs.set("adults", String(next.adults));
    if (next.students !== undefined) qs.set("students", String(next.students));
    if (next.half !== undefined) qs.set("half", String(next.half));
    router.replace(qs.size ? `/?${qs.toString()}` : "/", { scroll: false });
  }, [from, to, party, search, router]);

  function openPair(origin: StationName, destination: StationName) {
    setFrom(origin);
    setTo(destination);
    setTab("quote");
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-page flex-col gap-6 px-4 py-6 md:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">ECRL Fare Calculator</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Economy Transit starting fares, Gombak to Kota Bharu. Same rate both ways. Kadar
              permulaan Kelas Ekonomi.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) => {
            if (value === "quote" || value === "line" || value === "matrix") setTab(value);
          }}
        >
          <TabsList className="grid h-11 w-full grid-cols-3 group-data-horizontal/tabs:h-11 lg:inline-flex lg:w-fit lg:self-start lg:group-data-horizontal/tabs:h-10">
            <TabsTrigger value="quote" className="min-h-10 px-3 lg:flex-none lg:px-4">
              Quote
            </TabsTrigger>
            <TabsTrigger value="line" className="min-h-10 px-3 lg:flex-none lg:px-4">
              From station
            </TabsTrigger>
            <TabsTrigger value="matrix" className="min-h-10 px-3 lg:flex-none lg:px-4">
              Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quote" className="pt-4">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Journey</CardTitle>
                  <CardDescription>Pick any two of the 16 stations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
                    <StationSelect id="from" label="From" value={from} onChange={setFrom} />
                    <Button
                      variant="outline"
                      className="min-h-11"
                      aria-label="Swap stations"
                      onClick={() => {
                        setFrom(to);
                        setTo(from);
                      }}
                    >
                      <HugeiconsIcon icon={ArrowUpDownIcon} strokeWidth={2} className="sm:hidden" />
                      <HugeiconsIcon
                        icon={ArrowLeftRightIcon}
                        strokeWidth={2}
                        className="hidden sm:block"
                      />
                      Swap
                    </Button>
                    <StationSelect id="to" label="To" value={to} onChange={setTo} />
                  </div>

                  <Separator className="my-4" />

                  <div className="grid gap-3 md:grid-cols-3">
                    {partyRates.map((rate) => (
                      <PartyCount
                        key={rate.key}
                        label={rate.label}
                        hint={rate.hint}
                        value={party[rate.key]}
                        onChange={(next) =>
                          setParty((current) => ({ ...current, [rate.key]: next }))
                        }
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <OutputCard from={from} to={to} party={party} />
            </div>
          </TabsContent>

          <TabsContent value="line" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Fares from one station</CardTitle>
                <CardDescription>
                  {from
                    ? `All destinations from ${from}, in line order. Tap a row to quote it.`
                    : "Choose a station, then tap a destination to quote it."}
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <StationSelect id="line-from" label="From" value={from} onChange={setFrom} fit />
                {from == null ? (
                  <Empty className="border-0 px-2 py-8">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <HugeiconsIcon icon={Train01Icon} strokeWidth={2} />
                      </EmptyMedia>
                      <EmptyTitle>No station selected</EmptyTitle>
                      <EmptyDescription>
                        Pick a from station to list the starting fare to every other stop.
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
                                {station.state} · {hops} {hops === 1 ? "hop" : "hops"}
                              </span>
                            </span>
                            <span className="shrink-0 text-sm font-medium">
                              {fare == null ? "—" : formatRm(fare)}
                            </span>
                          </Button>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matrix" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Fare matrix</CardTitle>
                <CardDescription>
                  Starting fares in ringgit. The row is where you board and the column is where you
                  get off, in line order from 01 Gombak to 16 Kota Bharu. Tap a price to open that
                  quote.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="w-full min-w-[44rem] text-sm lg:min-w-full lg:table-fixed">
                  <caption className="sr-only">
                    Economy Transit starting fares. Rows are boarding stations and columns are
                    alighting stations, 01 Gombak through 16 Kota Bharu.
                  </caption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 z-10 w-40 bg-card">Board</TableHead>
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
                                <span className="inline-flex min-h-9 w-full items-center justify-center text-muted-foreground">
                                  —
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  variant={selected ? "default" : "ghost"}
                                  className="min-h-9 w-full px-1"
                                  onClick={() => openPair(origin.name, destination.name)}
                                  aria-label={`${origin.name} to ${destination.name}, ${formatRm(fare)}`}
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
          </TabsContent>
        </Tabs>

        <ul className="flex max-w-2xl flex-col gap-1 text-xs leading-relaxed text-muted-foreground">
          {fareMeta.notes.slice(0, 3).map((note) => (
            <li key={note}>{note}</li>
          ))}
          <li>
            Concession figures apply the announced 40% and 50% discounts to the starting fare. They
            are not a live ticket price.
          </li>
        </ul>
      </main>
    </div>
  );
}
