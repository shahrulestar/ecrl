import { effectiveOff, getFare, type StationName } from "@/data/fares";
import type { Party } from "@/lib/fare-search";

export const partyRates = [
  { key: "adults", off: 0 },
  { key: "students", off: 0.4 },
  { key: "half", off: 0.5 },
] as const;

export function sen(amount: number) {
  return Math.round(amount * 100) / 100;
}

/** Starting fare for the party in `q`. Null when there is no fare or nobody to charge. */
export function quoteTrip({
  from,
  to,
  party,
  isMalaysian,
  promoActive,
}: {
  from: StationName;
  to: StationName;
  party: Party;
  isMalaysian: boolean;
  promoActive: boolean;
}) {
  const fare = getFare(from, to);
  if (fare == null) return null;
  const people = party.adults + party.students + party.half;
  if (people === 0) return null;

  const total = sen(
    partyRates.reduce((sum, rate) => {
      const count = party[rate.key];
      const off = effectiveOff(rate.off, isMalaysian, promoActive);
      const each = sen(fare * (1 - off));
      return sum + sen(each * count);
    }, 0),
  );
  const baseTotal = sen(
    partyRates.reduce((sum, rate) => {
      const each = sen(fare * (1 - rate.off));
      return sum + sen(each * party[rate.key]);
    }, 0),
  );

  return { total, baseTotal, discounted: total < baseTotal };
}
