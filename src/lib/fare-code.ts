import { stations, type StationName } from "@/data/fares";

export interface FareParty {
  adults: number;
  students: number;
  half: number;
}

export interface FareState {
  from: StationName | null;
  to: StationName | null;
  party: FareParty;
  my: boolean;
}

/** 32 symbols, letters and digits, no `0 1 l o` to avoid look-alikes. */
const ALPHABET = "23456789abcdefghijkmnpqrstuvwxyz";
const VERSION_CHAR = "k";
const CODE_LENGTH = 6;
const MASK_20 = 0xfffff;
const MULTIPLIER = 40503;
const OFFSET = 12345;
const STATION_SLOTS = stations.length + 1;
const MAX_PACKED = STATION_SLOTS * STATION_SLOTS * 1000 * 2;

function modInverse(value: number): number {
  let inv = value;
  for (let i = 0; i < 5; i++) inv = Math.imul(inv, 2 - Math.imul(value, inv));
  return inv & MASK_20;
}

const MULTIPLIER_INVERSE = modInverse(MULTIPLIER);

function checksum(scrambled: number): number {
  return Math.imul(scrambled, 2654435761) >>> 22;
}

function stationSlot(name: StationName | null): number {
  if (!name) return 0;
  return stations.findIndex((station) => station.name === name) + 1;
}

function slotStation(slot: number): StationName | null {
  return slot === 0 ? null : (stations[slot - 1]?.name ?? null);
}

function isCount(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 9;
}

export function encodeFareCode(state: FareState): string {
  const { adults, students, half } = state.party;
  const packed =
    ((((stationSlot(state.from) * STATION_SLOTS + stationSlot(state.to)) * 10 + adults) * 10 +
      students) *
      10 +
      half) *
      2 +
    (state.my ? 1 : 0);
  const scrambled = (Math.imul(packed, MULTIPLIER) + OFFSET) & MASK_20;
  let value = scrambled * 1024 + checksum(scrambled);
  let body = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    body = ALPHABET[value % 32] + body;
    value = Math.floor(value / 32);
  }
  return VERSION_CHAR + body;
}

export function decodeFareCode(code: string): FareState | null {
  if (code.length !== CODE_LENGTH + 1 || code[0] !== VERSION_CHAR) return null;
  let value = 0;
  for (const char of code.slice(1)) {
    const digit = ALPHABET.indexOf(char);
    if (digit < 0) return null;
    value = value * 32 + digit;
  }
  const scrambled = Math.floor(value / 1024);
  if (value % 1024 !== checksum(scrambled)) return null;
  let packed = Math.imul(scrambled - OFFSET, MULTIPLIER_INVERSE) & MASK_20;
  if (packed >= MAX_PACKED) return null;

  const my = packed % 2 === 1;
  packed = Math.floor(packed / 2);
  const half = packed % 10;
  packed = Math.floor(packed / 10);
  const students = packed % 10;
  packed = Math.floor(packed / 10);
  const adults = packed % 10;
  packed = Math.floor(packed / 10);
  const toSlot = packed % STATION_SLOTS;
  const fromSlot = Math.floor(packed / STATION_SLOTS);
  if (![adults, students, half].every(isCount) || fromSlot >= STATION_SLOTS) return null;

  return { from: slotStation(fromSlot), to: slotStation(toSlot), party: { adults, students, half }, my };
}
