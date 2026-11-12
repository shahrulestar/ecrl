"use client";

import { stations, type StationName } from "@/data/fares";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export type StateName = (typeof stations)[number]["state"];

export function stateOf(name: StationName): StateName | null {
  return stations.find((station) => station.name === name)?.state ?? null;
}

const FLAG_BOX = { width: 1024, height: 512 } as const;

const flagSrc: Record<StateName, { src: string; width: number; height: number }> = {
  Pahang: { src: "/flags/pahang.webp", ...FLAG_BOX },
  Selangor: { src: "/flags/selangor.webp", ...FLAG_BOX },
  Terengganu: { src: "/flags/terengganu.webp", ...FLAG_BOX },
  Kelantan: { src: "/flags/kelantan.webp", ...FLAG_BOX },
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
        className="block size-full object-contain"
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
