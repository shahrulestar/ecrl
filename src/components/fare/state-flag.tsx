"use client";

import { stations, type StationName } from "@/data/fares";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export type StateName = (typeof stations)[number]["state"];

export function stateOf(name: StationName): StateName | null {
  return stations.find((station) => station.name === name)?.state ?? null;
}

const flagSrc: Record<StateName, { src: string; width: number; height: number }> = {
  Pahang: { src: "/flags/pahang.webp", width: 1024, height: 512 },
  Selangor: { src: "/flags/selangor.webp", width: 1024, height: 512 },
  Terengganu: { src: "/flags/terengganu.webp", width: 856, height: 344 },
  Kelantan: { src: "/flags/kelantan.webp", width: 1024, height: 512 },
};

export function StateFlag({ state, className }: { state: StateName; className?: string }) {
  const flag = flagSrc[state];
  return (
    <span
      role="img"
      aria-label={state}
      title={state}
      className={cn(
        "box-content inline-block h-4 w-8 shrink-0 overflow-hidden rounded-[2px] border border-foreground/25 align-middle",
        className,
      )}
    >
      <img
        src={flag.src}
        alt=""
        width={flag.width}
        height={flag.height}
        draggable={false}
        className="block size-full object-cover"
      />
    </span>
  );
}

/** From–to line with the state flag immediately before each station name. */
export function RouteLabel({
  from,
  to,
  className,
}: {
  from: StationName;
  to: StationName;
  className?: string;
}) {
  const { m } = useI18n();
  const joiner = m.trip.route.replace("{from}", "").replace("{to}", "").trim();
  const origin = stateOf(from);
  const destination = stateOf(to);

  return (
    <span className={cn("inline-flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1", className)}>
      {origin ? <StateFlag state={origin} /> : null}
      <span>{from}</span>
      <span className="shrink-0">{joiner}</span>
      {destination ? <StateFlag state={destination} /> : null}
      <span>{to}</span>
    </span>
  );
}
