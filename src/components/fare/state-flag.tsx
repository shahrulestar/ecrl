"use client";

import { stations, type StationName } from "@/data/fares";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export type StateName = (typeof stations)[number]["state"];

export function stateOf(name: StationName): StateName | null {
  return stations.find((station) => station.name === name)?.state ?? null;
}

export function StateFlag({ state, className }: { state: StateName; className?: string }) {
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
      <svg viewBox="0 0 64 32" preserveAspectRatio="none" className="block size-full" aria-hidden="true">
        {flags[state]}
      </svg>
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

const flags: Record<StateName, React.ReactNode> = {
  Pahang: (
    <>
      <rect width="64" height="16" fill="#fff" />
      <rect y="16" width="64" height="16" fill="#111" />
    </>
  ),
  Selangor: (
    <>
      <rect width="64" height="32" fill="#F5B800" />
      <rect width="32" height="16" fill="#E10600" />
      <rect x="32" y="16" width="32" height="16" fill="#E10600" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M5 8a5 5 0 1 0 10 0a5 5 0 1 0-10 0M8.4 8a3.8 3.8 0 1 1 7.6 0a3.8 3.8 0 1 1-7.6 0"
      />
      <polygon
        fill="#fff"
        points="19.20,5.44 19.80,7.18 21.64,7.21 20.17,8.31 20.70,10.07 19.20,9.01 17.70,10.07 18.23,8.31 16.76,7.21 18.60,7.18"
      />
    </>
  ),
  Terengganu: (
    <>
      <rect width="64" height="32" fill="#111" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M12 16a8 8 0 1 0 16 0a8 8 0 1 0-16 0M17.8 16a6.2 6.2 0 1 1 12.4 0a6.2 6.2 0 1 1-12.4 0"
      />
      <polygon
        fill="#fff"
        points="34.27,11.47 35.33,14.53 38.58,14.60 36.00,16.56 36.93,19.67 34.27,17.81 31.60,19.67 32.54,16.56 29.96,14.60 33.20,14.53"
      />
    </>
  ),
  Kelantan: (
    <>
      <rect width="64" height="32" fill="#E10600" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M20 23a12 12 0 1 0 24 0a12 12 0 1 0-24 0M24 18a8 8 0 1 1 16 0a8 8 0 1 1-16 0"
      />
      <path fill="#fff" d="M24.5 22V8H22.2L26.2 2L30.2 8H27.9V22Z" />
      <path fill="#fff" d="M36.1 22V8H33.8L37.8 2L41.8 8H39.5V22Z" />
      <polygon
        fill="#fff"
        points="32,8.4 32.7,10.4 34.8,10.4 33.1,11.7 33.8,13.7 32,12.5 30.2,13.7 30.9,11.7 29.2,10.4 31.3,10.4"
      />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        d="M14 11c8-5 12 1 28 14M50 11c-8-5-12 1-28 14"
      />
    </>
  ),
};
