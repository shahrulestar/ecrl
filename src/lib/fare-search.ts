import { stations, type StationName } from "@/data/fares";

export type ShareConcession = "student" | "half";

export type FareSearch = {
  from?: StationName;
  to?: StationName;
  passengers?: number;
  concession?: ShareConcession;
};

export function isStationName(value: unknown): value is StationName {
  return typeof value === "string" && stations.some((station) => station.name === value);
}

export function parseFareSearch(search: Record<string, unknown>): FareSearch {
  const passengers = Number(search.passengers);
  const concession = search.concession;
  return {
    from: isStationName(search.from) ? search.from : undefined,
    to: isStationName(search.to) ? search.to : undefined,
    passengers:
      Number.isInteger(passengers) && passengers >= 2 && passengers <= 9 ? passengers : undefined,
    concession: concession === "student" || concession === "half" ? concession : undefined,
  };
}

export function fareSearchParams(input: {
  from: StationName | null;
  to: StationName | null;
  passengers: number;
  concession: "adult" | ShareConcession;
}): FareSearch {
  return {
    from: input.from ?? undefined,
    to: input.to ?? undefined,
    passengers: input.passengers > 1 ? input.passengers : undefined,
    concession: input.concession === "adult" ? undefined : input.concession,
  };
}
