"use client";

import { useState } from "react";
import { useQueryStates } from "nuqs";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowUp01Icon,
  Copy01Icon,
  Tick02Icon,
  AlertCircleIcon,
  ArrowLeftRightIcon,
  ArrowUpDownIcon,
  MinusSignIcon,
  PlusSignIcon,
  Train01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  effectiveOff,
  formatRm,
  getFare,
  launchPromo,
  pathBetween,
  publishedJourney,
  stationIndex,
  stations,
  type PromoPhase,
  type StationName,
} from "@/data/fares";
import { fareSearchParsers, fareUrlKeys, PARTY_MAX, type Party } from "@/lib/fare-search";
import { code, FarePrice, StationSelect, usePromoPhase } from "@/components/fare/shared";

const partyRates = [
  { key: "adults", label: "Adult", hint: "Full fare", off: 0 },
  { key: "students", label: "Student", hint: "Aged 13–24 · 40% off", off: 0.4 },
  { key: "half", label: "Child, senior, OKU, pensioner", hint: "50% off", off: 0.5 },
] as const;

function sen(amount: number) {
  return Math.round(amount * 100) / 100;
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
                  i >= lo && i < hi ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
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
          aria-label={`One less: ${label}`}
          disabled={value <= 0}
          onClick={() => onChange(value - 1)}
        >
          <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
        </Button>
        <span className="w-6 text-center text-base font-semibold tabular-nums">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="size-11"
          aria-label={`One more: ${label}`}
          disabled={value >= PARTY_MAX}
          onClick={() => onChange(value + 1)}
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

function MalaysianSwitch({
  checked,
  detail,
  onChange,
}: {
  checked: boolean;
  detail: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 rounded-lg border px-3 py-3 text-left"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium">Launch Discount</span>
        <span className="block text-xs text-muted-foreground">{detail}</span>
      </span>
      <span
        className={cn(
          "inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors",
          checked ? "bg-primary" : "bg-input",
        )}
      >
        <span
          className={cn(
            "size-5 rounded-full bg-background shadow-sm transition-transform",
            checked && "translate-x-5",
          )}
        />
      </span>
    </button>
  );
}

function FareState({
  icon,
  route,
  title,
  detail,
  tone = "neutral",
  action,
}: {
  icon: typeof Train01Icon;
  route: string;
  title: string;
  detail: string;
  tone?: "neutral" | "error";
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="type-eyebrow">Starting fare · Economy Transit</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-base font-medium">{route}</p>
          <p
            role={tone === "error" ? "alert" : "status"}
            className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
          >
            <HugeiconsIcon
              icon={icon}
              strokeWidth={2}
              className={cn("mt-0.5 size-4 shrink-0", tone === "error" && "text-destructive")}
            />
            <span>
              <span className="font-medium text-foreground">{title}.</span> {detail}
            </span>
          </p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}

function OutputCard({
  from,
  to,
  party,
  isMalaysian,
  phase,
  onAddAdult,
}: {
  onAddAdult?: () => void;
  from: StationName | null;
  to: StationName | null;
  party: Party;
  isMalaysian: boolean;
  phase: PromoPhase | null;
}) {
  if (!from || !to)
    return (
      <FareState
        icon={Train01Icon}
        route={from ? `${from} to …` : "Pick two stations"}
        title="Where to?"
        detail="Choose where you get on and where you get off. Your fare appears here."
      />
    );

  if (from === to)
    return (
      <FareState
        icon={Alert02Icon}
        tone="error"
        route={from}
        title="Same station on both ends"
        detail="Change one of them to see a fare."
      />
    );

  const fare = getFare(from, to);
  if (fare == null)
    return (
      <FareState
        icon={AlertCircleIcon}
        tone="error"
        route={`${from} to ${to}`}
        title="No fare listed for this trip"
        detail="The fare table has no Economy Transit price for these two stations. Try another pair."
      />
    );

  const people = party.adults + party.students + party.half;
  if (people === 0)
    return (
      <FareState
        icon={Alert02Icon}
        tone="error"
        route={`${from} to ${to}`}
        title="Add a passenger"
        detail="The fare is worked out per passenger, so add at least one."
        action={
          onAddAdult ? (
            <Button variant="outline" className="h-11 w-full" onClick={onAddAdult}>
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} data-icon="inline-start" />
              Add an adult
            </Button>
          ) : null
        }
      />
    );

  const published = publishedJourney(from, to);
  const path = pathBetween(from, to);
  const between = Math.max(0, path.length - 2);
  const direction = stationIndex(from) < stationIndex(to) ? "Eastbound" : "Westbound";
  const promoActive = phase === "before" || phase === "active";
  const lines = partyRates
    .map((rate) => {
      const count = party[rate.key];
      const off = effectiveOff(rate.off, isMalaysian, promoActive);
      const each = sen(fare * (1 - off));
      const launchRate = promoActive && isMalaysian && off > rate.off;
      return { ...rate, count, each, amount: sen(each * count), off, launchRate };
    })
    .filter((line) => line.count > 0);
  const total = sen(lines.reduce((sum, line) => sum + line.amount, 0));
  const baseTotal = sen(
    partyRates.reduce((sum, rate) => {
      const each = sen(fare * (1 - rate.off));
      return sum + sen(each * party[rate.key]);
    }, 0),
  );
  const discounted = total < baseTotal;
  const hopSum = path.slice(1).reduce((sum, stop, i) => {
    const hop = getFare(path[i].name, stop.name);
    return sum + (hop ?? 0);
  }, 0);

  const renderCard = (className?: string, withCopy = false) => (
    <Card className={className}>
      <CardHeader>
        <CardDescription className="type-eyebrow">Starting fare · Economy Transit</CardDescription>
        <div className="flex flex-col items-start gap-3">
          <CardTitle className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <FarePrice amount={total} className="type-fare-hero" />
            {discounted ? (
              <span className="text-xl font-normal tracking-normal text-muted-foreground tabular-nums line-through">
                {formatRm(baseTotal)}
              </span>
            ) : null}
          </CardTitle>
          {discounted ? (
            <Badge variant="secondary" className="h-auto px-2.5 py-1 text-xs font-medium">
              30% off · Malaysians · until {launchPromo.endLabel}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 md:gap-3">
          <p className="text-base leading-relaxed font-medium">
            {from} to {to}
          </p>
          <p className="text-sm text-muted-foreground">
            {direction}
            {between === 0 ? " · next stop" : ` · ${between} ${between === 1 ? "stop" : "stops"}`}
            {published ? ` · ${published.km} km` : null}
          </p>
          {lines.length > 1 || people > 1 || (lines[0]?.off > 0 && !lines[0]?.launchRate) ? (
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              {lines.map((line) => (
                <li key={line.key} className="flex items-baseline justify-between gap-3">
                  <span>
                    {line.label} × {line.count}
                    {line.off > 0 ? ` · ${Math.round(line.off * 100)}% off` : ""}
                  </span>
                  <span className="shrink-0 font-medium text-foreground tabular-nums">
                    {formatRm(line.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {published ? (
            <p className="text-sm text-muted-foreground">
              {`Transit ${published.transitTime} · Express ${formatRm(published.expressFare)}, ${published.expressTime}`}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-5">
          <LineDots from={from} to={to} />
          <ol className="flex flex-col lg:scroll-fade lg:max-h-[min(24rem,45dvh)] lg:overflow-y-auto lg:pr-3 lg:pl-1 lg:[scrollbar-width:thin]">
            {path.map((stop, i) => {
              const previous = path[i - 1];
              const hop = previous ? getFare(previous.name, stop.name) : null;
              return (
                <li key={stop.name} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < path.length - 1 ? (
                    <span className="absolute top-[11px] -bottom-[11px] left-[4.5px] w-px bg-primary" />
                  ) : null}
                  <span className="relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full bg-primary" />
                  <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{stop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {code(stop.index)} · {stop.state}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm text-muted-foreground tabular-nums">
                      {hop == null ? "Board" : formatRm(hop)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          {hopSum !== fare ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              The stop-by-stop fares add up to {formatRm(hopSum)}, but the published fare for the
              whole trip is {formatRm(fare)}.
            </p>
          ) : null}
        </div>
        {withCopy ? (
          <div className="max-md:hidden">
            <CopyLinkButton />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  return (
    <>
      {renderCard("max-md:hidden", true)}
      <Drawer>
        <DrawerTrigger
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 rounded-t-2xl border-t bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-left shadow-[0_-8px_24px_rgb(0_0_0/0.10)] md:hidden"
          aria-label={`Fare ${formatRm(total)}${discounted ? `, was ${formatRm(baseTotal)}` : ""}, ${from} to ${to}. Open full breakdown`}
        >
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Starting fare</span>
            <span className="truncate text-sm font-medium">
              {from} to {to}
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
              View full breakdown
              <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3.5" />
            </span>
          </span>
          <span className="shrink-0 text-right">
            {discounted ? (
              <span className="block text-sm text-muted-foreground tabular-nums line-through">
                {formatRm(baseTotal)}
              </span>
            ) : null}
            <FarePrice
              amount={total}
              className="text-4xl leading-none font-semibold tracking-tighter"
            />
          </span>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Fare breakdown</DrawerTitle>
          </DrawerHeader>
          <div className="scroll-fade max-h-[70dvh] overflow-y-auto px-2 pb-4">
            {renderCard("border-0 ring-0")}
          </div>
          <div className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <CopyLinkButton />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", window.location.href);
    }
  }

  return (
    <Button
      type="button"
      className="h-11 w-full text-sm [&_svg:not([class*='size-'])]:size-4"
      onClick={copy}
    >
      <HugeiconsIcon
        icon={copied ? Tick02Icon : Copy01Icon}
        strokeWidth={2}
        data-icon="inline-start"
      />
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </Button>
  );
}

export function TripTab() {
  const [query, setQuery] = useQueryStates(fareSearchParsers, {
    urlKeys: fareUrlKeys,
    clearOnDefault: true,
  });
  const phase = usePromoPhase();
  const { from, to, party } = query;
  const isMalaysian = query.my;

  function setFrom(value: StationName | null) {
    setQuery({ from: value });
  }

  function setTo(value: StationName | null) {
    setQuery({ to: value });
  }

  function setParty(update: (current: Party) => Party) {
    setQuery({ party: update(party) });
  }

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle>Where are you going?</CardTitle>
          <CardDescription>Pick any two of the 16 stations.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
            <StationSelect id="from" label="From" value={from} onChange={setFrom} />
            <Button
              variant="outline"
              className="h-11 w-full gap-2 sm:w-11 sm:justify-self-center sm:px-0"
              aria-label="Swap stations"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
            >
              <HugeiconsIcon icon={ArrowUpDownIcon} strokeWidth={2} className="sm:hidden" />
              <span className="sm:hidden">Swap stations</span>
              <HugeiconsIcon
                icon={ArrowLeftRightIcon}
                strokeWidth={2}
                className="hidden sm:block"
              />
            </Button>
            <StationSelect id="to" label="To" value={to} onChange={setTo} />
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
            {partyRates.map((rate) => (
              <PartyCount
                key={rate.key}
                label={rate.label}
                hint={
                  rate.key === "adults" && (phase === "before" || phase === "active") && isMalaysian
                    ? "Malaysian launch rate · 30% off"
                    : rate.hint
                }
                value={party[rate.key]}
                onChange={(next) => setParty((current) => ({ ...current, [rate.key]: next }))}
              />
            ))}
          </div>
          {phase === "before" || phase === "active" ? (
            <MalaysianSwitch
              checked={isMalaysian}
              detail={
                phase === "before"
                  ? `Launch offer starts ${launchPromo.startLabel}. For Malaysian citizens.`
                  : "30% off for Malaysian citizens."
              }
              onChange={(next) => setQuery({ my: next })}
            />
          ) : null}
        </CardContent>
      </Card>

      <div className="lg:sticky lg:top-6">
        <OutputCard
          from={from}
          to={to}
          party={party}
          isMalaysian={isMalaysian}
          phase={phase}
          onAddAdult={() => setParty((c) => ({ ...c, adults: 1 }))}
        />
      </div>
    </div>
  );
}
