"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fill } from "@/i18n/fill";
import { useI18n } from "@/i18n/provider";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { cn } from "@/lib/utils";
import {
  formatAmount,
  promoDateFrom,
  promoPhase,
  stations,
  type PromoPhase,
  type StationName,
} from "@/data/fares";

const STATES = ["Selangor", "Pahang", "Terengganu", "Kelantan"] as const;

export function usePromoPhase(): PromoPhase | null {
  const [promoDate, setPromoDate] = useState<string | null>(null);

  useEffect(() => {
    const override =
      process.env.NODE_ENV !== "production"
        ? new URLSearchParams(window.location.search).get("today")
        : null;
    setPromoDate(promoDateFrom(new Date(), override));
  }, []);

  return promoDate ? promoPhase(promoDate) : null;
}

function isStation(value: unknown): value is StationName {
  return stations.some((station) => station.name === value);
}

export function code(index: number) {
  return String(index).padStart(2, "0");
}

export function StationSelect({
  id,
  label,
  value,
  onChange,
  fit = false,
}: {
  id: string;
  label: string;
  value: StationName | null;
  onChange: (value: StationName) => void;
  fit?: boolean;
}) {
  const { m } = useI18n();

  return (
    <div className={cn("flex flex-col gap-2", fit ? "w-fit max-w-full self-start" : "min-w-0")}>
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          if (isStation(next)) onChange(next);
        }}
      >
        <SelectTrigger id={id} className={cn("min-h-11", fit ? "w-fit" : "w-full")}>
          <SelectValue placeholder={m.shared.placeholder} />
        </SelectTrigger>
        <SelectContent
          side="bottom"
          align="start"
          alignItemWithTrigger={false}
          className={cn("max-h-[min(18rem,var(--available-height))]", fit && "w-max")}
          style={fit ? { width: "max-content", minWidth: "var(--anchor-width)" } : undefined}
        >
          {STATES.map((state) => (
            <SelectGroup key={state}>
              <SelectLabel>{state}</SelectLabel>
              {stations
                .filter((station) => station.state === state)
                .map((station) => (
                  <SelectItem
                    key={station.name}
                    value={station.name}
                    className={cn("min-h-11 cursor-pointer", fit && "w-auto")}
                  >
                    {code(station.index)} {station.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FarePrice({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-[0.15em] tabular-nums", className)}>
      <span>RM</span>
      <span>{formatAmount(amount)}</span>
    </span>
  );
}

export function AnimatedFarePrice({ amount, className }: { amount: number; className?: string }) {
  const value = useAnimatedNumber(amount);
  return <FarePrice amount={value} className={className} />;
}

export function PromoBanner({ phase }: { phase: PromoPhase | null }) {
  const { m } = useI18n();
  if (phase !== "active") return null;
  return (
    <p className="text-sm leading-relaxed text-muted-foreground">
      {fill(m.shared.promoBanner, { start: m.promo.start, end: m.promo.end })}
    </p>
  );
}
