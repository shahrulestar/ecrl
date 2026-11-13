"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MAP_DOUBLE_TAP_MS, Map } from "@/components/shadcnmaps/map";
import { MapControls } from "@/components/shadcnmaps/map-controls";
import { useMapContext } from "@/components/shadcnmaps/map-context";
import type { ZoomState } from "@/components/shadcnmaps/types";
import { malaysiaMapData } from "@/components/shadcnmaps/map-data/malaysia";
import { formatRm, pathBetween, publishedJourney, stationIndex, type StationName } from "@/data/fares";
import { ecrlRoute, lineStops, peninsulaViewBox, type LineStop } from "@/data/ecrl-line";
import { fill } from "@/i18n/fill";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { FarePeek } from "@/components/fare/trip-tab";
import { AnimatedFarePrice, usePromoPhase } from "@/components/fare/shared";
import { quoteTrip } from "@/lib/fare-quote";
import { fareStateQuery } from "@/lib/fare-search";
import { useFareState } from "@/lib/use-fare-state";

const routeRegionIds = new Set<string>(["SL", "PH", "TE", "KN"]);

const zoomConfig = { maxZoom: 4 };

const regionByState = {
  Selangor: "SL",
  Pahang: "PH",
  Terengganu: "TE",
  Kelantan: "KN",
} as const;

const [, , viewWidth, viewHeight] = peninsulaViewBox.split(" ").map(Number);

const restZoom: ZoomState = { scale: 1, translateX: 0, translateY: 0 };

/** Mirrors the map's zoom so the HTML labels can follow it. */
function ZoomSync({ onChange }: { onChange: (zoom: ZoomState) => void }) {
  const { zoomState } = useMapContext();
  useEffect(() => onChange(zoomState), [zoomState, onChange]);
  return null;
}

interface Size {
  width: number;
  height: number;
}

/**
 * Station name drawn inside the map's zoom layer, so it moves with the map in
 * the same frame. `unit` is one screen px in view-box units, which keeps the
 * label the same size at every zoom.
 */
function StationLabel({
  stop,
  unit,
  delayed = false,
}: {
  stop: LineStop;
  unit: number;
  delayed?: boolean;
}) {
  const [textWidth, setTextWidth] = useState(stop.name.length * 6.6);
  const height = 24 * unit;
  const width = (textWidth + 20) * unit;
  const gap = 10 * unit;
  const x =
    stop.label === "e" ? gap : stop.label === "w" ? -gap - width : -width / 2;
  const y =
    stop.label === "n" ? -gap - height : stop.label === "s" ? gap : -height / 2;

  const origin =
    stop.label === "e" ? "left" : stop.label === "w" ? "right" : stop.label === "n" ? "bottom" : "top";

  return (
    <g
      transform={`translate(${stop.x} ${stop.y})`}
      className={delayed ? "route-label-end pointer-events-none" : "route-label-hover pointer-events-none"}
      style={{ transformOrigin: origin }}
    >
      <rect x={x} y={y} width={width} height={height} rx={6 * unit} className="fill-foreground" />
      <text
        ref={(node) => {
          if (node) setTextWidth(Math.round(node.getComputedTextLength() / unit));
        }}
        x={x + width / 2}
        y={y + height / 2}
        dy="0.36em"
        fontSize={12 * unit}
        textAnchor="middle"
        className="fill-background font-medium"
      >
        {stop.name}
      </text>
    </g>
  );
}

function RouteMap({
  from,
  to,
  label,
  interactive = false,
  labelEnds = !interactive,
}: {
  from: StationName;
  to: StationName;
  label: string;
  /** Fills its parent, with zoom, pan, and station names on hover, tap or focus. */
  interactive?: boolean;
  /** Keep the trip's two end stations named without hovering. */
  labelEnds?: boolean;
}) {
  const [zoom, setZoom] = useState(restZoom);
  /** Bumped on reset so the route line draws again. */
  const [replay, setReplay] = useState(0);
  const [hoveredStop, setHoveredStop] = useState<StationName | null>(null);
  const [pinnedStop, setPinnedStop] = useState<StationName | null>(null);
  const pressedAt = useRef<{ x: number; y: number } | null>(null);
  const pinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPin = useRef<StationName | null>(null);
  const fromIndex = stationIndex(from);
  const toIndex = stationIndex(to);
  const fromT = ecrlRoute.at[fromIndex] * ecrlRoute.length;
  const toT = ecrlRoute.at[toIndex] * ecrlRoute.length;
  const start = Math.min(fromT, toT);
  const length = Math.abs(toT - fromT);
  const lo = Math.min(fromIndex, toIndex);
  const hi = Math.max(fromIndex, toIndex);
  const crossed = new Set<string>(pathBetween(from, to).map((stop) => regionByState[stop.state]));
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const unit = 1 / zoom.scale;
  /** Screen px per view-box unit at zoom 1; the SVG letterboxes to fit. */
  const labelScale = Math.min(size.width / viewWidth, size.height / viewHeight);
  const activeStop = hoveredStop ?? pinnedStop;
  const labelled = [
    ...(labelEnds ? [lineStops[fromIndex], lineStops[toIndex]] : []),
    ...(activeStop ? [lineStops[stationIndex(activeStop)]] : []),
  ].filter((stop, index, all) => all.indexOf(stop) === index);

  /** A press that turned into a pan is not a tap. */
  function isTap(event: React.MouseEvent) {
    const start = pressedAt.current;
    return !start || Math.hypot(event.clientX - start.x, event.clientY - start.y) < 4;
  }

  function togglePin(name: StationName) {
    setPinnedStop((current) => (current === name ? null : name));
  }

  /** Wait past the map's double-tap window. Click lands after touchend, so the extra 50ms keeps the pin pending until that click can cancel it. */
  function armPin(name: StationName) {
    if (pinTimer.current) {
      clearTimeout(pinTimer.current);
      pinTimer.current = null;
      const sameStation = pendingPin.current === name;
      pendingPin.current = null;
      if (sameStation) return;
    }
    pendingPin.current = name;
    pinTimer.current = setTimeout(() => {
      pinTimer.current = null;
      pendingPin.current = null;
      togglePin(name);
    }, MAP_DOUBLE_TAP_MS + 50);
  }

  useEffect(
    () => () => {
      if (pinTimer.current) clearTimeout(pinTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!frame) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height }),
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frame]);

  return (
    <div className={interactive ? "size-full" : "@container"}>
      <div
        ref={setFrame}
        className={
          interactive
            ? "relative size-full overflow-hidden [&>[data-slot=map-container]]:size-full"
            : "relative mx-auto h-[min(calc(100cqw*246/156),calc(100dvh-15rem))] max-w-full lg:h-[min(calc(100cqw*246/156),64dvh,40rem)]"
        }
        style={interactive ? undefined : { aspectRatio: `${viewWidth} / ${viewHeight}` }}
        onPointerDownCapture={(event) => {
          pressedAt.current = { x: event.clientX, y: event.clientY };
        }}
        onClick={(event) => {
          if (!interactive || !isTap(event)) return;
          if (!(event.target as Element).closest("[data-stop]")) setPinnedStop(null);
        }}
      >
        <Map
          data={{ ...malaysiaMapData, viewBox: peninsulaViewBox }}
          showLabels={false}
          showTooltips={false}
          aria-label={label}
          className={interactive ? "size-full h-full! w-full" : "size-full"}
          preserveAspectRatio={interactive ? "xMidYMin meet" : undefined}
          enableZoom={interactive}
          zoomConfig={interactive ? zoomConfig : undefined}
          controls={
            interactive ? (
              <MapControls
                position="bottom-right"
                showPanButtons={false}
                onReset={() => setReplay((count) => count + 1)}
                className="bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] right-[calc(env(safe-area-inset-right)+0.75rem)] rounded-lg border bg-background/90 p-1 shadow-md backdrop-blur max-sm:hidden"
              />
            ) : undefined
          }
          disabledRegions={malaysiaMapData.regions.map((region) => region.id)}
          regions={malaysiaMapData.regions.map((region) => {
            const onRoute = routeRegionIds.has(region.id);
            const onTrip = crossed.has(region.id);
            return {
              id: region.id,
              className: cn(
                "cursor-default opacity-100",
                onRoute
                  ? "stroke-[2px] [vector-effect:non-scaling-stroke]"
                  : "fill-map-land stroke-none",
                onRoute && !onTrip && "fill-map-route-region stroke-map-route-region-stroke",
                onTrip && "fill-map-trip-fill stroke-map-route",
              ),
            };
          })}
        >
          <path
            d={ecrlRoute.d}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="pointer-events-none stroke-muted-foreground stroke-[3px] [vector-effect:non-scaling-stroke]"
          />
          <path
            key={`${from}-${to}-${replay}`}
            d={ecrlRoute.d}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={1.6 * unit}
            className="route-draw pointer-events-none stroke-map-route"
            style={
              {
                strokeDasharray: `0 ${start} ${length} ${ecrlRoute.length}`,
                "--route-from": fromT,
                "--route-length": ecrlRoute.length,
              } as React.CSSProperties
            }
          />
          {lineStops.map((stop, index) => {
            const on = index >= lo && index <= hi;
            const end = index === fromIndex || index === toIndex;
            return (
              <circle
                key={stop.name}
                cx={stop.x}
                cy={stop.y}
                r={(end ? 1.9 : 1.3) * unit}
                className={cn(
                  "pointer-events-none fill-background [vector-effect:non-scaling-stroke]",
                  end ? "stroke-[2.5px]" : "stroke-[2px]",
                  on ? "stroke-map-route" : "stroke-muted-foreground",
                )}
              />
            );
          })}
          {interactive && (
            <>
              <ZoomSync onChange={setZoom} />
              {lineStops.map((stop) => (
                <circle
                  key={`${stop.name}-hit`}
                  cx={stop.x}
                  cy={stop.y}
                  r={3.5 * unit}
                  data-stop
                  tabIndex={0}
                  role="button"
                  aria-label={stop.name}
                  aria-pressed={pinnedStop === stop.name}
                  className="cursor-pointer fill-transparent outline-none"
                  onPointerEnter={(event) => event.pointerType === "mouse" && setHoveredStop(stop.name)}
                  onPointerLeave={(event) => event.pointerType === "mouse" && setHoveredStop(null)}
                  onClick={(event) => isTap(event) && armPin(stop.name)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    togglePin(stop.name);
                  }}
                  onFocus={(event) => event.target.matches(":focus-visible") && setHoveredStop(stop.name)}
                  onBlur={() => setHoveredStop(null)}
                />
              ))}
            </>
          )}
          {size.width > 0 &&
            labelled.map((stop) => {
              const isEnd = stop.name === from || stop.name === to;
              return (
                <StationLabel
                  key={labelEnds && isEnd ? `${stop.name}-${replay}` : stop.name}
                  stop={stop}
                  delayed={labelEnds && isEnd}
                  unit={1 / (labelScale * zoom.scale)}
                />
              );
            })}
        </Map>
      </div>
    </div>
  );
}

function useRouteCopy(from: StationName, to: StationName) {
  const { m } = useI18n();
  const between = Math.max(0, pathBetween(from, to).length - 2);
  const direction = stationIndex(from) < stationIndex(to) ? m.trip.east : m.trip.west;
  const detail =
    direction +
    (between === 0
      ? m.trip.nextStop
      : fill(m.trip.stops, {
          count: between,
          unit: between === 1 ? m.trip.stopOne : m.trip.stopMany,
        }));
  return {
    route: fill(m.trip.route, { from, to }),
    detail,
    label: fill(m.trip.mapAria, { from, to, detail }),
    legendStation: m.trip.legendStation,
    legendTrip: m.trip.legendTrip,
    viewMap: m.trip.viewMap,
  };
}

export function RouteLegend({
  station,
  trip,
  className,
}: {
  station: string;
  trip: string;
  className?: string;
}) {
  return (
    <Card
      size="sm"
      className={cn(
        "shrink-0 max-sm:[&_[data-slot=card-content]]:flex-col max-sm:[&_[data-slot=card-content]]:items-start",
        className,
      )}
    >
      <CardContent className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1.5">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2.5 shrink-0 rounded-full border-2 border-foreground/70 bg-background" />
          {station}
        </p>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2.5 shrink-0 rounded-full border-2 border-map-route bg-background" />
          {trip}
        </p>
      </CardContent>
    </Card>
  );
}

function MapFareCard({
  href,
  label,
  total,
  baseTotal,
  discounted,
  route,
  detail,
}: {
  href: string;
  label: string;
  total: number;
  baseTotal: number;
  discounted: boolean;
  route: string;
  detail: string;
}) {
  const { m } = useI18n();

  return (
    <Link
      href={href}
      aria-label={label}
      className="stage-swap hidden w-full max-w-64 flex-col gap-2 rounded-lg bg-background p-3 text-left shadow-sm ring-1 ring-foreground/10 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring sm:flex"
    >
      <span className="shrink-0 text-left">
        {discounted ? (
          <span className="block text-sm text-muted-foreground tabular-nums line-through">
            {formatRm(baseTotal)}
          </span>
        ) : null}
        <AnimatedFarePrice amount={total} className="text-2xl leading-none font-semibold tracking-tighter" />
      </span>
      <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
        <span className="text-xs text-muted-foreground">{m.trip.startingFare}</span>
        <span className="max-w-full truncate text-sm font-medium">{route}</span>
        <span className="max-w-full text-xs text-pretty text-muted-foreground">{detail}</span>
      </span>
    </Link>
  );
}

/** The line on its own page; follows the trip picked in `q`, else shows the whole line. */
export function LineMap() {
  const { locale, m } = useI18n();
  const [state] = useFareState();
  const phase = usePromoPhase();
  const hasTrip = state.from !== null && state.to !== null;
  const from = state.from ?? lineStops[0].name;
  const to = state.to ?? lineStops[lineStops.length - 1].name;
  const copy = useRouteCopy(from, to);
  const query = fareStateQuery(state);
  const quote = hasTrip
    ? quoteTrip({
        from,
        to,
        party: state.party,
        isMalaysian: state.my,
        promoActive: phase === "before" || phase === "active",
      })
    : null;
  const tripHref = `/trip${query ? `?${query}` : ""}`;
  const published = quote ? publishedJourney(from, to) : null;
  const detail = published
    ? `${copy.detail} · ${fill(m.trip.transit, { time: published.transitTime[locale] })}`
    : copy.detail;

  return (
    <main className="fixed inset-x-0 top-0 h-dvh overflow-hidden bg-background">
      <RouteMap from={from} to={to} label={copy.label} interactive labelEnds={hasTrip} />
      <Button
        variant="outline"
        className="absolute top-[calc(env(safe-area-inset-top)+0.75rem)] left-[calc(env(safe-area-inset-left)+0.75rem)] z-10 h-9 bg-background shadow-sm hover:bg-background sm:top-[calc(env(safe-area-inset-top)+1rem)] sm:left-[calc(env(safe-area-inset-left)+1rem)] dark:bg-background dark:hover:bg-background"
        render={<Link href={tripHref} aria-label={m.trip.backAria} />}
        nativeButton={false}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} data-icon="inline-start" />
        {m.trip.back}
      </Button>
      <div className="absolute top-[calc(env(safe-area-inset-top)+0.75rem)] right-[calc(env(safe-area-inset-right)+0.75rem)] z-10 flex flex-col items-end gap-2 sm:top-[calc(env(safe-area-inset-top)+1rem)] sm:right-[calc(env(safe-area-inset-right)+1rem)]">
        <RouteLegend station={copy.legendStation} trip={copy.legendTrip} className="shadow-sm" />
        {quote ? (
          <MapFareCard
            href={tripHref}
            total={quote.total}
            baseTotal={quote.baseTotal}
            discounted={quote.discounted}
            route={copy.route}
            detail={detail}
            label={fill(m.trip.drawerAria, {
              total: formatRm(quote.total),
              was: quote.discounted ? fill(m.trip.was, { amount: formatRm(quote.baseTotal) }) : "",
              from,
              to,
            })}
          />
        ) : null}
      </div>
      <FarePeek />
    </main>
  );
}
