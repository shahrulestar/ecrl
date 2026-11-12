"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowUp01Icon,
  AlertCircleIcon,
  ArrowLeftRightIcon,
  ArrowUpDownIcon,
  Link01Icon,
  MinusSignIcon,
  PlusSignIcon,
  Tick02Icon,
  Train01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
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
  stations,
  type PromoPhase,
  type StationName,
} from "@/data/fares";
import { partyRates, quoteTrip, sen } from "@/lib/fare-quote";
import { fareStateQuery, PARTY_MAX, type Party } from "@/lib/fare-search";
import { useFareState } from "@/lib/use-fare-state";
import { AnimatedFarePrice, code, StationSelect, usePromoPhase } from "@/components/fare/shared";
import { RouteLabel } from "@/components/fare/state-flag";

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

function PartyFields({
  party,
  phase,
  isMalaysian,
  onChange,
  className,
}: {
  party: Party;
  phase: PromoPhase | null;
  isMalaysian: boolean;
  onChange: (key: (typeof partyRates)[number]["key"], next: number) => void;
  className?: string;
}) {
  const { m } = useI18n();

  return (
    <div className={cn("grid gap-3", className)}>
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
          onChange={(next) => onChange(rate.key, next)}
        />
      ))}
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
  className,
}: {
  icon: typeof Train01Icon;
  route: string;
  title: string;
  detail: string;
  tone?: "neutral" | "error";
  action?: React.ReactNode;
  className?: string;
}) {
  const { m } = useI18n();

  return (
    <Card className={className}>
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
  onPartyChange,
  onFrom,
  onTo,
  showFare = 0,
  peekOnly = false,
}: {
  onAddAdult?: () => void;
  onPartyChange: (key: (typeof partyRates)[number]["key"], next: number) => void;
  onFrom?: (next: StationName) => void;
  onTo?: (next: StationName) => void;
  showFare?: number;
  /** Map page: the same mobile peek and drawer, with no side card. */
  peekOnly?: boolean;
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

  useEffect(() => {
    if (showFare > 0) setFareOpen(true);
  }, [showFare]);

  if (!from || !to) {
    if (peekOnly) return null;
    return (
      <Empty className="stage-swap min-h-40 p-4">
        <EmptyHeader>
          <EmptyTitle>{from ? fill(m.trip.whereRouteFrom, { from }) : m.trip.whereRoute}</EmptyTitle>
          <EmptyDescription>{m.trip.whereDetail}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (from === to) {
    if (peekOnly) return null;
    return (
      <FareState
        className="stage-swap"
        icon={Alert02Icon}
        tone="error"
        route={from}
        title={m.trip.sameTitle}
        detail={m.trip.sameDetail}
      />
    );
  }

  const fare = getFare(from, to);
  if (fare == null) {
    if (peekOnly) return null;
    return (
      <FareState
        className="stage-swap"
        icon={AlertCircleIcon}
        tone="error"
        route={routeOf(from, to)}
        title={m.trip.missingTitle}
        detail={m.trip.missingDetail}
      />
    );
  }

  const people = party.adults + party.students + party.half;
  if (people === 0) {
    if (peekOnly) return null;
    return (
      <FareState
        className="stage-swap"
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
  }

  const published = publishedJourney(from, to);
  const path = pathBetween(from, to);
  const between = Math.max(0, path.length - 2);
  const direction = stationIndex(from) < stationIndex(to) ? m.trip.east : m.trip.west;
  const promoActive = phase === "before" || phase === "active";
  const quote = quoteTrip({ from, to, party, isMalaysian, promoActive });
  if (!quote) return null;
  const { total, baseTotal, discounted } = quote;
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
  const hopSum = path.slice(1).reduce((sum, stop, i) => {
    const hop = getFare(path[i].name, stop.name);
    return sum + (hop ?? 0);
  }, 0);

  const renderCard = (className?: string, withCopy = false) => (
    <Card key={`${from}-${to}`} className={cn("stage-swap", className)}>
      <CardHeader className="reveal">
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
        <div className="reveal reveal-2 flex flex-col gap-2 md:gap-3">
          <p className="text-base leading-relaxed font-medium">
            <RouteLabel from={from} to={to} />
          </p>
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
        <div className="reveal reveal-3 flex flex-col gap-5">
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
      {peekOnly ? null : renderCard("max-lg:hidden", true)}
      <Drawer showSwipeHandle open={fareOpen} onOpenChange={setFareOpen}>
        <DrawerTrigger
          data-fare-peek
          className={cn(
            "peek-enter fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 rounded-t-2xl border-t bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-left shadow-[0_-8px_24px_rgb(0_0_0/0.10)]",
            peekOnly ? "sm:hidden" : "lg:hidden",
          )}
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
          <div className="flex flex-col gap-2 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {peekOnly && onFrom && onTo ? (
              <div className="flex gap-2">
                <div className="min-w-0 flex-1">
                  <PartyDrawer
                    compact
                    party={party}
                    phase={phase}
                    isMalaysian={isMalaysian}
                    onChange={onPartyChange}
                    onViewFare={() => setFareOpen(true)}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <RouteDrawer
                    compact
                    from={from}
                    to={to}
                    onFrom={onFrom}
                    onTo={onTo}
                    onViewFare={() => setFareOpen(true)}
                  />
                </div>
              </div>
            ) : (
              <PartyDrawer
                party={party}
                phase={phase}
                isMalaysian={isMalaysian}
                onChange={onPartyChange}
                onViewFare={() => setFareOpen(true)}
              />
            )}
            <FareActions hideMap={peekOnly} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

/** The trip page's mobile fare peek, on the map. Opens the same breakdown. */
export function FarePeek() {
  const [state, update] = useFareState();
  const phase = usePromoPhase();

  return (
    <OutputCard
      peekOnly
      from={state.from}
      to={state.to}
      party={state.party}
      isMalaysian={state.my}
      phase={phase}
      onPartyChange={(key, next) => update({ party: { ...state.party, [key]: next } })}
      onFrom={(next) =>
        update(state.to && next === state.to ? { from: state.to, to: state.from } : { from: next })
      }
      onTo={(next) =>
        update(state.from && next === state.from ? { from: state.to, to: state.from } : { to: next })
      }
    />
  );
}

function PartyDrawer({
  party,
  phase,
  isMalaysian,
  onChange,
  onViewFare,
  compact = false,
}: {
  party: Party;
  phase: PromoPhase | null;
  isMalaysian: boolean;
  onChange: (key: (typeof partyRates)[number]["key"], next: number) => void;
  onViewFare?: () => void;
  compact?: boolean;
}) {
  const { m } = useI18n();
  const summary = partyRates
    .filter((rate) => party[rate.key] > 0)
    .map((rate) => `${m.party[rate.key].label} × ${party[rate.key]}`)
    .join(" · ");

  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger className="flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg border bg-background px-3 text-left text-sm">
        <span className="truncate font-medium">{m.trip.passengers}</span>
        {compact ? (
          <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <span className="inline-flex min-w-0 items-center gap-1 text-muted-foreground">
            <span className="truncate">{summary || m.trip.passengersTitle}</span>
            <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3.5 shrink-0" />
          </span>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{m.trip.passengers}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <PartyFields
            party={party}
            phase={phase}
            isMalaysian={isMalaysian}
            onChange={onChange}
          />
          <Button className="h-11 w-full" render={<DrawerClose />} onClick={onViewFare}>
            {m.trip.viewBreakdownAction}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const WHEEL_ROW = 44;
const WHEEL_VISIBLE = 5;

function StationWheel({
  value,
  onChange,
  label,
}: {
  value: StationName;
  onChange: (next: StationName) => void;
  label: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrollIndex, setScrollIndex] = useState(() =>
    Math.max(0, stations.findIndex((station) => station.name === value)),
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const index = Math.max(0, stations.findIndex((station) => station.name === value));
    if (settleTimer.current) clearTimeout(settleTimer.current);
    list.scrollTop = index * WHEEL_ROW;
    setScrollIndex(index);
  }, [value]);

  useEffect(
    () => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    },
    [],
  );

  function settle() {
    const list = listRef.current;
    if (!list) return;
    const index = Math.min(
      stations.length - 1,
      Math.max(0, Math.round(list.scrollTop / WHEEL_ROW)),
    );
    const next = stations[index]?.name;
    if (next && next !== value) onChange(next);
  }

  return (
    <div className="relative" style={{ height: WHEEL_ROW * WHEEL_VISIBLE }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2 top-1/2 z-0 h-11 -translate-y-1/2 rounded-lg bg-muted"
      />
      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        tabIndex={0}
        className="relative z-10 h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
        }}
        onScroll={() => {
          const list = listRef.current;
          if (!list) return;
          setScrollIndex(list.scrollTop / WHEEL_ROW);
          if (settleTimer.current) clearTimeout(settleTimer.current);
          settleTimer.current = setTimeout(settle, 80);
        }}
        onKeyDown={(event) => {
          const index = stations.findIndex((station) => station.name === value);
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          const next =
            stations[event.key === "ArrowDown" ? Math.min(stations.length - 1, index + 1) : Math.max(0, index - 1)];
          if (next) onChange(next.name);
        }}
      >
        <div aria-hidden="true" style={{ height: WHEEL_ROW * 2 }} />
        {stations.map((station, index) => {
          const distance = Math.abs(index - scrollIndex);
          const selected = index === Math.round(scrollIndex);
          return (
            <button
              key={station.name}
              type="button"
              role="option"
              aria-selected={selected}
              className={cn(
                "flex h-11 w-full snap-center items-center justify-center gap-2 text-base",
                selected ? "font-medium text-foreground" : "text-muted-foreground",
              )}
              style={{ opacity: Math.max(0.28, 1 - distance * 0.34) }}
              onClick={() => onChange(station.name)}
            >
              <span className="w-6 text-right text-xs tabular-nums">{code(station.index)}</span>
              <span className="truncate">{station.name}</span>
            </button>
          );
        })}
        <div aria-hidden="true" style={{ height: WHEEL_ROW * 2 }} />
      </div>
    </div>
  );
}

function RouteDrawer({
  from,
  to,
  onFrom,
  onTo,
  onViewFare,
  compact = false,
}: {
  from: StationName;
  to: StationName;
  onFrom: (next: StationName) => void;
  onTo: (next: StationName) => void;
  onViewFare?: () => void;
  compact?: boolean;
}) {
  const { m } = useI18n();
  const [end, setEnd] = useState<"from" | "to">("from");
  const active = end === "from" ? from : to;
  const pick = end === "from" ? onFrom : onTo;
  const ends = [
    { key: "from" as const, label: m.trip.from, station: from },
    { key: "to" as const, label: m.trip.to, station: to },
  ];

  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger className="flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg border bg-background px-3 text-left text-sm">
        <span className="truncate font-medium">{m.trip.routeLabel}</span>
        {compact ? (
          <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <span className="inline-flex min-w-0 items-center gap-1 text-muted-foreground">
            <span className="truncate">{fill(m.trip.route, { from, to })}</span>
            <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-3.5 shrink-0" />
          </span>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{m.trip.routeLabel}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-3 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1" role="tablist">
            {ends.map((item) => {
              const selected = end === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={cn(
                    "flex min-w-0 flex-col items-start rounded-lg px-3 py-2 text-left",
                    selected ? "bg-background shadow-sm" : "text-muted-foreground",
                  )}
                  onClick={() => setEnd(item.key)}
                >
                  <span className="text-xs">{item.label}</span>
                  <span className="w-full truncate text-sm font-medium text-foreground">{item.station}</span>
                </button>
              );
            })}
          </div>
          <StationWheel key={end} label={end === "from" ? m.trip.from : m.trip.to} value={active} onChange={pick} />
          <Button className="h-11 w-full" render={<DrawerClose />} onClick={onViewFare}>
            {m.trip.viewBreakdownAction}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function FareActions({ hideMap = false }: { hideMap?: boolean }) {
  const { m } = useI18n();
  const [state] = useFareState();
  const query = fareStateQuery(state);

  return (
    <div className="flex gap-2">
      {hideMap ? null : (
        <Button
          className="h-11 flex-1"
          nativeButton={false}
          render={<Link href={`/map${query ? `?${query}` : ""}`} />}
        >
          {m.trip.viewMap}
        </Button>
      )}
      <CopyLinkButton primary={hideMap} />
    </div>
  );
}

const copySwap =
  "transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]";
const copyIdleIcon =
  "group-data-copied/copy:scale-50 group-data-copied/copy:opacity-0 group-data-copied/copy:blur-[2px]";
const copyDoneIcon =
  "scale-50 opacity-0 blur-[2px] group-data-copied/copy:scale-100 group-data-copied/copy:opacity-100 group-data-copied/copy:blur-none";
const copyIdleLabel = "group-data-copied/copy:opacity-0 group-data-copied/copy:blur-[2px]";
const copyDoneLabel =
  "opacity-0 blur-[2px] group-data-copied/copy:opacity-100 group-data-copied/copy:blur-none";

function CopyLinkButton({ primary = false }: { primary?: boolean }) {
  const { m } = useI18n();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      setCopied(true);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(m.trip.copyPrompt, window.location.href);
    }
  }

  return (
    <Button
      type="button"
      variant={primary ? "default" : "outline"}
      data-copied={copied ? "" : undefined}
      className="group/copy h-11 w-full flex-1 gap-2 text-sm"
      onClick={copy}
    >
      <span aria-hidden="true" className="relative size-4 shrink-0">
        <HugeiconsIcon
          icon={Link01Icon}
          strokeWidth={2}
          className={cn("absolute inset-0 size-4", copySwap, copyIdleIcon)}
        />
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={2}
          className={cn("absolute inset-0 size-4", copySwap, copyDoneIcon)}
        />
      </span>
      <span aria-hidden="true" className="grid justify-items-center">
        <span className={cn("[grid-area:1/1]", copySwap, copyIdleLabel)}>{m.trip.copy}</span>
        <span className={cn("[grid-area:1/1]", copySwap, copyDoneLabel)}>{m.trip.copied}</span>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? m.trip.copied : m.trip.copy}
      </span>
    </Button>
  );
}

export function TripTab() {
  const { m } = useI18n();
  const [query, setQuery] = useFareState();
  const phase = usePromoPhase();
  const { from, to, party } = query;
  const isMalaysian = query.my;
  const [swapped, setSwapped] = useState(false);
  const [showFare, setShowFare] = useState(0);

  useEffect(() => {
    const onSwap = () => setSwapped((current) => !current);
    window.addEventListener("fare:swap", onSwap);
    return () => window.removeEventListener("fare:swap", onSwap);
  }, []);

  function swapStations() {
    setSwapped((current) => !current);
    setFrom(to);
    setTo(from);
  }

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
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-11 w-full gap-2 sm:w-11 sm:justify-self-center sm:px-0"
                    aria-label={m.trip.swap}
                    aria-keyshortcuts="S"
                    onClick={swapStations}
                  />
                }
              >
                <HugeiconsIcon
                  icon={ArrowUpDownIcon}
                  strokeWidth={2}
                  className="transition-[rotate] duration-200 ease-(--ease-out-strong) sm:hidden"
                  style={{ rotate: swapped ? "180deg" : "0deg" }}
                />
                <span className="sm:hidden">{m.trip.swap}</span>
                <HugeiconsIcon
                  icon={ArrowLeftRightIcon}
                  strokeWidth={2}
                  className="hidden transition-[rotate] duration-200 ease-(--ease-out-strong) sm:block"
                  style={{ rotate: swapped ? "180deg" : "0deg" }}
                />
              </TooltipTrigger>
              <TooltipContent className="max-md:hidden">
                {m.shell.shortcutSwap} <Kbd>S</Kbd>
              </TooltipContent>
            </Tooltip>
            <StationSelect id="to" label={m.trip.to} value={to} onChange={setTo} />
          </div>

          <PartyFields
            className="max-lg:hidden lg:grid-cols-1"
            party={party}
            phase={phase}
            isMalaysian={isMalaysian}
            onChange={(key, next) => setParty((current) => ({ ...current, [key]: next }))}
          />
          <div className="lg:hidden">
            <PartyDrawer
              party={party}
              phase={phase}
              isMalaysian={isMalaysian}
              onChange={(key, next) => setParty((current) => ({ ...current, [key]: next }))}
              onViewFare={() => setShowFare((count) => count + 1)}
            />
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
          onPartyChange={(key, next) => setParty((current) => ({ ...current, [key]: next }))}
          showFare={showFare}
        />
      </div>
    </div>
  );
}
