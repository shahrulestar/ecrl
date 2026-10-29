import { createParser, parseAsStringLiteral } from "nuqs/server";
import { stations, type StationName } from "@/data/fares";

export const PARTY_MAX = 9;

const stationNames = stations.map((station) => station.name);

const parseAsPartyCount = createParser({
  parse: (value) => clampCount(value) ?? 0,
  serialize: String,
});

export const fareSearchParsers = {
  from: parseAsStringLiteral(stationNames),
  to: parseAsStringLiteral(stationNames),
  adults: parseAsPartyCount,
  students: parseAsPartyCount,
  half: parseAsPartyCount,
};

export type Party = {
  adults: number;
  students: number;
  half: number;
};

export type FareSearch = {
  from?: StationName;
  to?: StationName;
  adults?: number;
  students?: number;
  half?: number;
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
  return { adults: 1, students: 0, half: 0 };
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
}): FareSearch {
  const from = input.from ?? undefined;
  const to = input.to ?? undefined;
  const { adults, students, half } = input.party;
  if (adults + students + half === 0) return { from, to, adults: 0, students: 0, half: 0 };
  if (adults === 1 && students === 0 && half === 0) return { from, to };
  return {
    from,
    to,
    adults,
    students: students === 0 ? undefined : students,
    half: half === 0 ? undefined : half,
  };
}

export function fareQueryString(search: FareSearch): string {
  const qs = new URLSearchParams();
  for (const key of ["from", "to", "adults", "students", "half"] as const) {
    const value = search[key];
    if (value !== undefined) qs.set(key, String(value));
  }
  return qs.toString();
}
