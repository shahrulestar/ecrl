import { createParser, parseAsBoolean } from "nuqs/server";
import { slugToStation, stations, stationToSlug, type StationName } from "@/data/fares";

export const PARTY_MAX = 9;

export interface Party {
  adults: number;
  students: number;
  half: number;
}

export const DEFAULT_PARTY: Party = { adults: 1, students: 0, half: 0 };

/** Party as `adults.students.half`, trailing zeros dropped: `2`, `2.1`, `0.0.3`. */
export function encodePartyParam(party: Party): string {
  const counts = [party.adults, party.students, party.half];
  while (counts.length > 1 && counts[counts.length - 1] === 0) counts.pop();
  return counts.join(".");
}

export function decodePartyParam(value: string): Party | null {
  const parts = value.split(".");
  if (parts.length > 3) return null;
  const [adults, students = 0, half = 0] = parts.map((part) => clampCount(part));
  if (adults === undefined || students === undefined || half === undefined) return null;
  return { adults, students, half };
}

const parseAsStationSlug = createParser<StationName>({
  parse: slugToStation,
  serialize: stationToSlug,
});

const parseAsParty = createParser<Party>({
  parse: decodePartyParam,
  serialize: encodePartyParam,
  eq: (a, b) => a.adults === b.adults && a.students === b.students && a.half === b.half,
});

export const fareSearchParsers = {
  from: parseAsStationSlug,
  to: parseAsStationSlug,
  party: parseAsParty.withDefault(DEFAULT_PARTY),
  my: parseAsBoolean.withDefault(true),
};

/** Short URL keys for the trip and table pages. */
export const fareUrlKeys = { from: "f", to: "t", party: "p", my: "my" } as const;

/** Station page: one station, shown as `?s=kb`. */
export const stationSearchParsers = { from: fareSearchParsers.from };
export const stationUrlKeys = { from: "s" } as const;

/** Table page: only reads the current pair to highlight it. */
export const tableSearchParsers = {
  from: fareSearchParsers.from,
  to: fareSearchParsers.to,
};
export const tableUrlKeys = { from: "f", to: "t" } as const;

export type FareSearch = {
  from?: StationName;
  to?: StationName;
  adults?: number;
  students?: number;
  half?: number;
  /** False when the party is not Malaysian. Omitted when the default (Malaysian) applies. */
  my?: boolean;
};

export function isStationName(value: unknown): value is StationName {
  return typeof value === "string" && stations.some((station) => station.name === value);
}

function clampCount(value: unknown): number | undefined {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n < 0 || n > PARTY_MAX) return undefined;
  return n;
}

export function partyFromSearch(search: FareSearch): Party {
  if (search.adults !== undefined || search.students !== undefined || search.half !== undefined) {
    return {
      adults: search.adults ?? 0,
      students: search.students ?? 0,
      half: search.half ?? 0,
    };
  }
  return DEFAULT_PARTY;
}

export function parseFareSearch(search: Record<string, unknown>): FareSearch {
  const from = isStationName(search.from) ? search.from : undefined;
  const to = isStationName(search.to) ? search.to : undefined;
  const hasParty = "adults" in search || "students" in search || "half" in search;
  if (hasParty) {
    return {
      from,
      to,
      adults: clampCount(search.adults) ?? 0,
      students: clampCount(search.students) ?? 0,
      half: clampCount(search.half) ?? 0,
    };
  }

  const passengers = clampCount(search.passengers);
  const count = passengers ?? 1;
  if (search.concession === "student") return { from, to, adults: 0, students: count, half: 0 };
  if (search.concession === "half") return { from, to, adults: 0, students: 0, half: count };
  if (passengers !== undefined) return { from, to, adults: passengers };
  return { from, to };
}

export function fareSearchParams(input: {
  from: StationName | null;
  to: StationName | null;
  party: Party;
  my?: boolean;
}): FareSearch {
  const from = input.from ?? undefined;
  const to = input.to ?? undefined;
  const my = input.my === false ? false : undefined;
  const { adults, students, half } = input.party;
  if (adults + students + half === 0) return { from, to, my, adults: 0, students: 0, half: 0 };
  if (adults === 1 && students === 0 && half === 0) return { from, to, my };
  return {
    from,
    to,
    my,
    adults,
    students: students === 0 ? undefined : students,
    half: half === 0 ? undefined : half,
  };
}

export function fareQueryString(search: FareSearch): string {
  const qs = new URLSearchParams();
  if (search.from) qs.set(fareUrlKeys.from, stationToSlug(search.from));
  if (search.to) qs.set(fareUrlKeys.to, stationToSlug(search.to));
  const party = partyFromSearch(search);
  if (encodePartyParam(party) !== encodePartyParam(DEFAULT_PARTY))
    qs.set(fareUrlKeys.party, encodePartyParam(party));
  if (search.my === false) qs.set(fareUrlKeys.my, "false");
  return qs.toString();
}

export function tripHref(from: StationName, to: StationName): string {
  return `/trip?${fareQueryString({ from, to })}`;
}
