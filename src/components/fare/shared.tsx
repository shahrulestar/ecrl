"use client";

import { useState, useSyncExternalStore } from "react";
import { Kbd } from "@/components/ui/kbd";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { fill } from "@/i18n/fill";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import {
  formatAmount,
  launchPromo,
  promoDateFrom,
  promoPhase,
  stations,
  type PromoPhase,
  type StationName,
} from "@/data/fares";

const STATES = ["Selangor", "Pahang", "Terengganu", "Kelantan"] as const;

/** The phase on the day the site was built. It is what the static HTML shows. */
const buildPhase = promoPhase(process.env.NEXT_PUBLIC_BUILD_DATE ?? launchPromo.start);

function subscribeToNothing() {
  return () => {};
}

function todayPhase(): PromoPhase {
  const override =
    process.env.NODE_ENV !== "production"
      ? new URLSearchParams(window.location.search).get("today")
      : null;
  return promoPhase(promoDateFrom(new Date(), override));
}

/** Build-day phase in the static HTML, then today's phase once the page is live. */
export function usePromoPhase(): PromoPhase {
  return useSyncExternalStore(subscribeToNothing, todayPhase, () => buildPhase);
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
}: {
  id: string;
  label: string;
  value: StationName | null;
  onChange: (value: StationName) => void;
}) {
  const { m } = useI18n();
  const searchable = id === "from" || id === "line-from";
  const trigger = (
    <SelectTrigger
      id={id}
      aria-keyshortcuts={searchable ? "/" : undefined}
      className="min-h-11 w-full text-sm"
    />
  );

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          if (isStation(next)) onChange(next);
        }}
      >
        {searchable ? (
          <Tooltip>
            <TooltipTrigger render={trigger}>
              <SelectValue placeholder={m.shared.placeholder} />
            </TooltipTrigger>
            <TooltipContent className="max-md:hidden">
              {m.shell.shortcutSearch} <Kbd>/</Kbd>
            </TooltipContent>
          </Tooltip>
        ) : (
          <SelectTrigger id={id} className="min-h-11 w-full text-sm">
            <SelectValue placeholder={m.shared.placeholder} />
          </SelectTrigger>
        )}
        <SelectContent
          side="bottom"
          align="start"
          alignItemWithTrigger={false}
          className="max-h-[min(18rem,var(--available-height))]"
        >
          {STATES.map((state) => (
            <SelectGroup key={state}>
              <SelectLabel>{state}</SelectLabel>
              {stations
                .filter((station) => station.state === state)
                .map((station) => (
                  <SelectItem key={station.name} value={station.name} className="min-h-11">
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
  const [frame, setFrame] = useState({ amount, generation: 0 });
  if (frame.amount !== amount) {
    setFrame({ amount, generation: frame.generation + 1 });
  }

  return (
    <span key={frame.generation} className={cn("inline-flex", frame.generation > 0 && "reveal")}>
      <FarePrice amount={amount} className={className} />
    </span>
  );
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
