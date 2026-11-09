import { createParser } from "nuqs/server";
import { slugToStation, stations, type StationName } from "@/data/fares";
import { decodeFareCode, encodeFareCode, type FareState } from "@/lib/fare-code";

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

export const DEFAULT_FARE_STATE: FareState = {
  from: null,
  to: null,
  party: DEFAULT_PARTY,
  my: true,
};

function isSameFareState(a: FareState, b: FareState): boolean {
  return (
    a.from === b.from &&
    a.to === b.to &&
    a.my === b.my &&
    a.party.adults === b.party.adults &&
    a.party.students === b.party.students &&
    a.party.half === b.party.half
  );
}

/** One `q` param carries the whole selection, e.g. `?q=kx7m3d9`. */
export const parseAsFareCode = createParser<FareState>({
  parse: decodeFareCode,
  serialize: encodeFareCode,
  eq: isSameFareState,
});

export const FARE_QUERY_KEY = "q";

/** Read old `f/t/p/s/my` and long `from/adults` params. Returns null when none are present. */
export function legacyFareState(params: URLSearchParams): FareState | null {
  if (params.has(FARE_QUERY_KEY)) return null;
  const shortFrom = slugToStation(params.get("f") ?? params.get("s") ?? "");
  const shortTo = slugToStation(params.get("t") ?? "");
  const shortParty = params.has("p") ? decodePartyParam(params.get("p") ?? "") : DEFAULT_PARTY;
  const isShort = ["f", "s", "t", "p"].some((key) => params.has(key));
  const isLong = ["from", "to", "adults", "students", "half", "passengers", "concession"].some(
    (key) => params.has(key),
  );
  if (!isShort && !isLong && !params.has("my")) return null;

  const long = parseFareSearch(Object.fromEntries(params.entries()));
  return {
    from: isShort ? shortFrom : (long.from ?? null),
    to: isShort ? shortTo : (long.to ?? null),
    party: isShort ? (shortParty ?? DEFAULT_PARTY) : partyFromSearch(long),
    my: params.get("my") !== "false",
  };
}

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

export function fareStateQuery(state: FareState): string {
  if (isSameFareState(state, DEFAULT_FARE_STATE)) return "";
  return `${FARE_QUERY_KEY}=${encodeFareCode(state)}`;
}

export function fareQueryString(search: FareSearch): string {
  return fareStateQuery({
    from: search.from ?? null,
    to: search.to ?? null,
    party: partyFromSearch(search),
    my: search.my !== false,
  });
}

export function tripHref(from: StationName, to: StationName): string {
  return `/trip?${fareQueryString({ from, to })}`;
}
