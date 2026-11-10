"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowUp01Icon,
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
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fill } from "@/i18n/fill";
import { useI18n } from "@/i18n/provider";
import {
  effectiveOff,
  formatRm,
  getFare,
  pathBetween,
  publishedJourney,
  stationIndex,
  type PromoPhase,
  type StationName,
} from "@/data/fares";
import { fareStateQuery, PARTY_MAX, type Party } from "@/lib/fare-search";
import { useFareState } from "@/lib/use-fare-state";
import { AnimatedFarePrice, code, StationSelect, usePromoPhase } from "@/components/fare/shared";

const partyRates = [
  { key: "adults", off: 0 },
  { key: "students", off: 0.4 },
  { key: "half", off: 0.5 },
] as const;

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
  const { m } = useI18n();

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
          aria-label={fill(m.trip.oneLess, { label })}
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
          aria-label={fill(m.trip.oneMore, { label })}
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
  const { m } = useI18n();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 rounded-lg border px-3 py-3 text-left"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium">{m.trip.launchTitle}</span>
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
  const { m } = useI18n();

  return (
    <Card>
      <CardHeader>
        <Badge variant="outline" className="h-auto px-2.5 py-1 text-xs font-medium">{m.trip.eyebrow}</Badge>
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
  const { locale, m } = useI18n();
  const [fareOpen, setFareOpen] = useState(false);
  const routeOf = (origin: string, destination: string) =>
    fill(m.trip.route, { from: origin, to: destination });

  if (!from || !to)
    return (
      <Empty className="min-h-40 p-4">
        <EmptyHeader>
          <EmptyTitle>{from ? fill(m.trip.whereRouteFrom, { from }) : m.trip.whereRoute}</EmptyTitle>
          <EmptyDescription>{m.trip.whereDetail}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  if (from === to)
    return (
      <FareState
        icon={Alert02Icon}
        tone="error"
        route={from}
        title={m.trip.sameTitle}
        detail={m.trip.sameDetail}
      />
    );

  const fare = getFare(from, to);
  if (fare == null)
    return (
      <FareState
        icon={AlertCircleIcon}
        tone="error"
        route={routeOf(from, to)}
        title={m.trip.missingTitle}
        detail={m.trip.missingDetail}
      />
    );

  const people = party.adults + party.students + party.half;
  if (people === 0)
    return (
      <FareState
        icon={Alert02Icon}
        tone="error"
        route={routeOf(from, to)}
        title={m.trip.passengersTitle}
        detail={m.trip.passengersDetail}
        action={
          onAddAdult ? (
            <Button variant="outline" className="h-11 w-full" onClick={onAddAdult}>
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} data-icon="inline-start" />
              {m.trip.addAdult}
            </Button>
          ) : null
        }
      />
    );

  const published = publishedJourney(from, to);
  const path = pathBetween(from, to);
  const between = Math.max(0, path.length - 2);
  const direction = stationIndex(from) < stationIndex(to) ? m.trip.east : m.trip.west;
  const promoActive = phase === "before" || phase === "active";
  const lines = partyRates
    .map((rate) => {
      const count = party[rate.key];
      const off = effectiveOff(rate.off, isMalaysian, promoActive);
      const each = sen(fare * (1 - off));
      const launchRate = promoActive && isMalaysian && off > rate.off;
      return {
        ...rate,
        label: m.party[rate.key].label,
        count,
        each,
        amount: sen(each * count),
        off,
        launchRate,
      };
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
        <div className="flex flex-col items-start gap-3">
          <CardTitle className="flex flex-col items-start gap-1">
            <AnimatedFarePrice amount={total} className="type-fare-hero" />
            {discounted ? (
              <span className="text-xl font-normal tracking-normal text-muted-foreground tabular-nums line-through">
                {formatRm(baseTotal)}
              </span>
            ) : null}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="h-auto px-2.5 py-1 text-xs font-medium">{m.trip.eyebrow}</Badge>
            {discounted ? (
              <Badge className="h-auto px-2.5 py-1 text-xs font-medium">
                {fill(m.trip.badge, { end: m.promo.end })}
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 md:gap-3">
          <p className="text-base leading-relaxed font-medium">{routeOf(from, to)}</p>
          <p className="text-sm text-muted-foreground">
            {direction}
            {between === 0
              ? m.trip.nextStop
              : fill(m.trip.stops, {
                  count: between,
                  unit: between === 1 ? m.trip.stopOne : m.trip.stopMany,
                })}
            {published ? ` · ${published.km} km` : null}
          </p>
          {lines.length > 1 || people > 1 || (lines[0]?.off > 0 && !lines[0]?.launchRate) ? (
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              {lines.map((line) => (
                <li key={line.key} className="flex items-baseline justify-between gap-3">
                  <span>
                    {line.label} × {line.count}
                    {line.off > 0
                      ? ` · ${fill(m.trip.percentOff, { percent: Math.round(line.off * 100) })}`
                      : ""}
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
              {fill(m.trip.transitExpress, {
                time: published.transitTime[locale],
                fare: formatRm(published.expressFare),
                expressTime: published.expressTime[locale],
              })}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-5">
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
                      {hop == null ? m.trip.board : formatRm(hop)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          {hopSum !== fare ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {fill(m.trip.hopNote, { hop: formatRm(hopSum), fare: formatRm(fare) })}
            </p>
          ) : null}
        </div>
        {withCopy ? <FareActions /> : null}
      </CardContent>
    </Card>
  );

  return (
    <>
      {renderCard("max-md:hidden", true)}
      <Drawer open={fareOpen} onOpenChange={setFareOpen}>
        <DrawerTrigger
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 rounded-t-2xl border-t bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-left shadow-[0_-8px_24px_rgb(0_0_0/0.10)] md:hidden"
          aria-label={fill(m.trip.drawerAria, {
            total: formatRm(total),
            was: discounted ? fill(m.trip.was, { amount: formatRm(baseTotal) }) : "",
            from,
            to,
          })}
        >
          <span className="shrink-0 text-left">
            {discounted ? (
              <span className="block text-sm text-muted-foreground tabular-nums line-through">
                {formatRm(baseTotal)}
              </span>
            ) : null}
            <AnimatedFarePrice
              amount={total}
              className="text-4xl leading-none font-semibold tracking-tighter"
            />
          </span>
          <span className="flex min-w-0 flex-col items-end gap-0.5 text-right">
            <span className="text-xs text-muted-foreground">{m.trip.startingFare}</span>
            <span className="max-w-full truncate text-sm font-medium">{routeOf(from, to)}</span>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
              {m.trip.viewBreakdown}
              <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3.5" />
            </span>
          </span>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{m.trip.breakdownTitle}</DrawerTitle>
          </DrawerHeader>
          <div className="scroll-fade max-h-[70dvh] overflow-y-auto px-2 pb-4">
            {renderCard("border-0 ring-0")}
          </div>
          <div className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <FareActions />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function FareActions() {
  const { m } = useI18n();
  const [state] = useFareState();
  const query = fareStateQuery(state);

  return (
    <div className="flex gap-2">
      <Button
        className="h-11 flex-1"
        nativeButton={false}
        render={<Link href={`/map${query ? `?${query}` : ""}`} />}
      >
        {m.trip.viewMap}
      </Button>
      <CopyLinkButton />
    </div>
  );
}

function CopyLinkButton() {
  const { m } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(m.trip.copyPrompt, window.location.href);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 flex-1 text-sm"
      onClick={copy}
    >
      <span aria-live="polite">{copied ? m.trip.copied : m.trip.copy}</span>
    </Button>
  );
}

export function TripTab() {
  const { m } = useI18n();
  const [query, setQuery] = useFareState();
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
          <CardTitle>{m.trip.heading}</CardTitle>
          <CardDescription>{m.trip.subhead}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
            <StationSelect id="from" label={m.trip.from} value={from} onChange={setFrom} />
            <Button
              variant="outline"
              className="h-11 w-full gap-2 sm:w-11 sm:justify-self-center sm:px-0"
              aria-label={m.trip.swap}
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
            >
              <HugeiconsIcon icon={ArrowUpDownIcon} strokeWidth={2} className="sm:hidden" />
              <span className="sm:hidden">{m.trip.swap}</span>
              <HugeiconsIcon
                icon={ArrowLeftRightIcon}
                strokeWidth={2}
                className="hidden sm:block"
              />
            </Button>
            <StationSelect id="to" label={m.trip.to} value={to} onChange={setTo} />
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
            {partyRates.map((rate) => (
              <PartyCount
                key={rate.key}
                label={m.party[rate.key].label}
                hint={
                  rate.key === "adults" && (phase === "before" || phase === "active") && isMalaysian
                    ? m.party.adults.launchHint
                    : m.party[rate.key].hint
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
                  ? fill(m.trip.launchBefore, { start: m.promo.start })
                  : m.trip.launchActive
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
