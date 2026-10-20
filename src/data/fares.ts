/* ECRL Economy Transit starting fares. Source table: Kadar Tambang (Transit, Kelas Ekonomi). */
export const fareMeta = {
  "service": "ECRL",
  "class": "Ekonomi",
  "service_type": "Transit",
  "currency": "MYR",
  "description": "Starting fares for ECRL Economy Transit service (dynamic pricing; these are base/starting rates)",
  "notes": [
    "Kadar yang sama terpakai bagi perjalanan ulang alik. (Same fare applies for return journeys.)",
    "Kadar tambang ditetapkan melalui mekanisme tambang dinamik. (Fares set via dynamic pricing mechanism.)",
    "These are starting/base rates announced; actual fares may vary by demand, time, and availability.",
    "Data extracted from official fare table image for web app use."
  ],
  "stations_count": 16,
  "source": "ECRL Kadar Tambang table (Economy Transit)"
} as const;

export const stations = [
  {
    "name": "Gombak",
    "state": "Selangor",
    "index": 1
  },
  {
    "name": "Bentong",
    "state": "Pahang",
    "index": 2
  },
  {
    "name": "Temerloh",
    "state": "Pahang",
    "index": 3
  },
  {
    "name": "Maran",
    "state": "Pahang",
    "index": 4
  },
  {
    "name": "Paya Besar",
    "state": "Pahang",
    "index": 5
  },
  {
    "name": "KotaSAS",
    "state": "Pahang",
    "index": 6
  },
  {
    "name": "Kuantan Port City",
    "state": "Pahang",
    "index": 7
  },
  {
    "name": "Cherating",
    "state": "Pahang",
    "index": 8
  },
  {
    "name": "Chukai",
    "state": "Terengganu",
    "index": 9
  },
  {
    "name": "Kemasik",
    "state": "Terengganu",
    "index": 10
  },
  {
    "name": "Dungun",
    "state": "Terengganu",
    "index": 11
  },
  {
    "name": "Kuala Terengganu",
    "state": "Terengganu",
    "index": 12
  },
  {
    "name": "Bandar Permaisuri",
    "state": "Terengganu",
    "index": 13
  },
  {
    "name": "Jerteh",
    "state": "Terengganu",
    "index": 14
  },
  {
    "name": "Pasir Puteh",
    "state": "Kelantan",
    "index": 15
  },
  {
    "name": "Kota Bharu",
    "state": "Kelantan",
    "index": 16
  }
] as const;

export type StationName = (typeof stations)[number]["name"];

export const fares: Record<StationName, Partial<Record<StationName, number>>> = {
  "Gombak": {
    "Bentong": 24,
    "Temerloh": 35,
    "Maran": 42,
    "Paya Besar": 55,
    "KotaSAS": 60,
    "Kuantan Port City": 62,
    "Cherating": 67,
    "Chukai": 69,
    "Kemasik": 75,
    "Dungun": 82,
    "Kuala Terengganu": 95,
    "Bandar Permaisuri": 107,
    "Jerteh": 114,
    "Pasir Puteh": 118,
    "Kota Bharu": 125
  },
  "Bentong": {
    "Gombak": 24,
    "Temerloh": 11,
    "Maran": 18,
    "Paya Besar": 31,
    "KotaSAS": 36,
    "Kuantan Port City": 38,
    "Cherating": 43,
    "Chukai": 45,
    "Kemasik": 51,
    "Dungun": 58,
    "Kuala Terengganu": 71,
    "Bandar Permaisuri": 83,
    "Jerteh": 90,
    "Pasir Puteh": 94,
    "Kota Bharu": 101
  },
  "Temerloh": {
    "Gombak": 35,
    "Bentong": 11,
    "Maran": 7,
    "Paya Besar": 20,
    "KotaSAS": 25,
    "Kuantan Port City": 27,
    "Cherating": 32,
    "Chukai": 34,
    "Kemasik": 40,
    "Dungun": 47,
    "Kuala Terengganu": 60,
    "Bandar Permaisuri": 72,
    "Jerteh": 79,
    "Pasir Puteh": 83,
    "Kota Bharu": 90
  },
  "Maran": {
    "Gombak": 42,
    "Bentong": 18,
    "Temerloh": 7,
    "Paya Besar": 13,
    "KotaSAS": 18,
    "Kuantan Port City": 20,
    "Cherating": 25,
    "Chukai": 27,
    "Kemasik": 33,
    "Dungun": 40,
    "Kuala Terengganu": 53,
    "Bandar Permaisuri": 65,
    "Jerteh": 72,
    "Pasir Puteh": 76,
    "Kota Bharu": 83
  },
  "Paya Besar": {
    "Gombak": 55,
    "Bentong": 31,
    "Temerloh": 20,
    "Maran": 13,
    "KotaSAS": 5,
    "Kuantan Port City": 7,
    "Cherating": 12,
    "Chukai": 14,
    "Kemasik": 20,
    "Dungun": 27,
    "Kuala Terengganu": 40,
    "Bandar Permaisuri": 52,
    "Jerteh": 59,
    "Pasir Puteh": 63,
    "Kota Bharu": 70
  },
  "KotaSAS": {
    "Gombak": 60,
    "Bentong": 36,
    "Temerloh": 25,
    "Maran": 18,
    "Paya Besar": 5,
    "Kuantan Port City": 2,
    "Cherating": 7,
    "Chukai": 9,
    "Kemasik": 15,
    "Dungun": 22,
    "Kuala Terengganu": 35,
    "Bandar Permaisuri": 47,
    "Jerteh": 54,
    "Pasir Puteh": 58,
    "Kota Bharu": 65
  },
  "Kuantan Port City": {
    "Gombak": 62,
    "Bentong": 38,
    "Temerloh": 27,
    "Maran": 20,
    "Paya Besar": 7,
    "KotaSAS": 2,
    "Cherating": 5,
    "Chukai": 7,
    "Kemasik": 13,
    "Dungun": 20,
    "Kuala Terengganu": 33,
    "Bandar Permaisuri": 45,
    "Jerteh": 52,
    "Pasir Puteh": 56,
    "Kota Bharu": 63
  },
  "Cherating": {
    "Gombak": 67,
    "Bentong": 43,
    "Temerloh": 32,
    "Maran": 25,
    "Paya Besar": 12,
    "KotaSAS": 7,
    "Kuantan Port City": 5,
    "Chukai": 2,
    "Kemasik": 8,
    "Dungun": 15,
    "Kuala Terengganu": 28,
    "Bandar Permaisuri": 40,
    "Jerteh": 47,
    "Pasir Puteh": 51,
    "Kota Bharu": 58
  },
  "Chukai": {
    "Gombak": 69,
    "Bentong": 45,
    "Temerloh": 34,
    "Maran": 27,
    "Paya Besar": 14,
    "KotaSAS": 9,
    "Kuantan Port City": 7,
    "Cherating": 2,
    "Kemasik": 6,
    "Dungun": 13,
    "Kuala Terengganu": 26,
    "Bandar Permaisuri": 38,
    "Jerteh": 45,
    "Pasir Puteh": 49,
    "Kota Bharu": 56
  },
  "Kemasik": {
    "Gombak": 75,
    "Bentong": 51,
    "Temerloh": 40,
    "Maran": 33,
    "Paya Besar": 20,
    "KotaSAS": 15,
    "Kuantan Port City": 13,
    "Cherating": 8,
    "Chukai": 6,
    "Dungun": 7,
    "Kuala Terengganu": 20,
    "Bandar Permaisuri": 32,
    "Jerteh": 39,
    "Pasir Puteh": 43,
    "Kota Bharu": 50
  },
  "Dungun": {
    "Gombak": 82,
    "Bentong": 58,
    "Temerloh": 47,
    "Maran": 40,
    "Paya Besar": 27,
    "KotaSAS": 22,
    "Kuantan Port City": 20,
    "Cherating": 15,
    "Chukai": 13,
    "Kemasik": 7,
    "Kuala Terengganu": 13,
    "Bandar Permaisuri": 25,
    "Jerteh": 32,
    "Pasir Puteh": 36,
    "Kota Bharu": 43
  },
  "Kuala Terengganu": {
    "Gombak": 95,
    "Bentong": 71,
    "Temerloh": 60,
    "Maran": 53,
    "Paya Besar": 40,
    "KotaSAS": 35,
    "Kuantan Port City": 33,
    "Cherating": 28,
    "Chukai": 26,
    "Kemasik": 20,
    "Dungun": 13,
    "Bandar Permaisuri": 12,
    "Jerteh": 19,
    "Pasir Puteh": 23,
    "Kota Bharu": 30
  },
  "Bandar Permaisuri": {
    "Gombak": 107,
    "Bentong": 83,
    "Temerloh": 72,
    "Maran": 65,
    "Paya Besar": 52,
    "KotaSAS": 47,
    "Kuantan Port City": 45,
    "Cherating": 40,
    "Chukai": 38,
    "Kemasik": 32,
    "Dungun": 25,
    "Kuala Terengganu": 12,
    "Jerteh": 7,
    "Pasir Puteh": 11,
    "Kota Bharu": 18
  },
  "Jerteh": {
    "Gombak": 114,
    "Bentong": 90,
    "Temerloh": 79,
    "Maran": 72,
    "Paya Besar": 59,
    "KotaSAS": 54,
    "Kuantan Port City": 52,
    "Cherating": 47,
    "Chukai": 45,
    "Kemasik": 39,
    "Dungun": 32,
    "Kuala Terengganu": 19,
    "Bandar Permaisuri": 7,
    "Pasir Puteh": 4,
    "Kota Bharu": 11
  },
  "Pasir Puteh": {
    "Gombak": 118,
    "Bentong": 94,
    "Temerloh": 83,
    "Maran": 76,
    "Paya Besar": 63,
    "KotaSAS": 58,
    "Kuantan Port City": 56,
    "Cherating": 51,
    "Chukai": 49,
    "Kemasik": 43,
    "Dungun": 36,
    "Kuala Terengganu": 23,
    "Bandar Permaisuri": 11,
    "Jerteh": 4,
    "Kota Bharu": 7
  },
  "Kota Bharu": {
    "Gombak": 125,
    "Bentong": 101,
    "Temerloh": 90,
    "Maran": 83,
    "Paya Besar": 70,
    "KotaSAS": 65,
    "Kuantan Port City": 63,
    "Cherating": 58,
    "Chukai": 56,
    "Kemasik": 50,
    "Dungun": 43,
    "Kuala Terengganu": 30,
    "Bandar Permaisuri": 18,
    "Jerteh": 11,
    "Pasir Puteh": 7
  }
};

export const publishedJourneys = [
  {
    a: "Gombak",
    b: "Kota Bharu",
    km: 523,
    transitTime: "about 5 hours",
    expressFare: 147,
    expressTime: "about 4 hours",
  },
  {
    a: "Gombak",
    b: "Kuala Terengganu",
    km: 378,
    transitTime: "3 hours 51 minutes",
    expressFare: 110,
    expressTime: "2 hours 54 minutes",
  },
  {
    a: "Gombak",
    b: "KotaSAS",
    km: 209,
    transitTime: "2 hours 5 minutes",
    expressFare: 68,
    expressTime: "1 hour 27 minutes",
  },
] as const;

export function stationIndex(name: StationName): number {
  return stations.findIndex((s) => s.name === name);
}

export function getFare(from: StationName, to: StationName): number | null {
  if (from === to) return null;
  return fares[from][to] ?? null;
}

export function pathBetween(from: StationName, to: StationName) {
  const a = stationIndex(from);
  const b = stationIndex(to);
  const slice = stations.slice(Math.min(a, b), Math.max(a, b) + 1);
  return a <= b ? slice : [...slice].reverse();
}

export function publishedJourney(from: StationName, to: StationName) {
  return (
    publishedJourneys.find(
      (j) => (j.a === from && j.b === to) || (j.a === to && j.b === from),
    ) ?? null
  );
}

export function formatRm(amount: number): string {
  return Number.isInteger(amount) ? `RM${amount}` : `RM${amount.toFixed(2)}`;
}
