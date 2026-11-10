"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { fill } from "@/i18n/fill";
import { useI18n } from "@/i18n/provider";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { cn } from "@/lib/utils";
import {
  formatAmount,
  launchPromo,
  promoDateFrom,
  promoPhase,
  stationIndex,
  stations,
  type PromoPhase,
  type StationName,
} from "@/data/fares";

const STATES = ["Selangor", "Pahang", "Terengganu", "Kelantan"] as const;

interface StationGroup {
  value: (typeof STATES)[number];
  items: StationName[];
}

const stationGroups: StationGroup[] = STATES.map((state) => ({
  value: state,
  items: stations.filter((station) => station.state === state).map((station) => station.name),
}));

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

/** Match on the name, the two-digit code ("07") or the state. */
function matchesStation(name: StationName, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const station = stations[stationIndex(name)];
  return (
    name.toLowerCase().includes(q) ||
    code(station.index).startsWith(q) ||
    station.state.toLowerCase().startsWith(q)
  );
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
  const listRef = useRef<HTMLDivElement>(null);
  const searchable = id === "from" || id === "line-from";
  const isOpen = useRef(false);
  const wasOpenAtPress = useRef(false);

  /** Bring the picked station into view, as a native select does. */
  function revealPicked() {
    const list = listRef.current;
    const picked = list?.querySelector('[aria-selected="true"]');
    if (!list || !picked) return;
    const listBox = list.getBoundingClientRect();
    const pickedBox = picked.getBoundingClientRect();
    list.scrollTop += pickedBox.top - listBox.top - (listBox.height - pickedBox.height) / 2;
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Combobox
        items={stationGroups}
        value={value}
        onValueChange={(next) => {
          if (isStation(next)) onChange(next);
        }}
        onOpenChange={(open) => {
          isOpen.current = open;
          if (open) requestAnimationFrame(revealPicked);
        }}
        filter={matchesStation}
        autoHighlight
      >
        <Tooltip {...(searchable ? {} : { open: false })}>
          <TooltipTrigger render={<div className="w-full min-w-0" />}>
            <ComboboxInput
              id={id}
              placeholder={m.shared.placeholder}
              aria-keyshortcuts={searchable ? "/" : undefined}
              className="h-11 w-full [&_input]:h-full [&_input]:text-base sm:[&_input]:text-sm"
              showTrigger={false}
              onPointerDown={() => {
                wasOpenAtPress.current = isOpen.current;
              }}
              onClick={(event) => {
                // The click that opens the list selects the name, so typing replaces it.
                if (!wasOpenAtPress.current) event.currentTarget.select();
              }}
            >
              {/* The input already opens the list, so the chevron stays out of the tab order. */}
              <InputGroupAddon align="inline-end">
                <ComboboxTrigger
                  tabIndex={-1}
                  aria-hidden="true"
                  className="flex size-6 items-center justify-center"
                />
              </InputGroupAddon>
            </ComboboxInput>
          </TooltipTrigger>
          {searchable ? (
            <TooltipContent className="max-md:hidden">
              {m.shell.shortcutSearch} <Kbd>/</Kbd>
            </TooltipContent>
          ) : null}
        </Tooltip>
        <ComboboxContent>
          <ComboboxEmpty>{m.shared.noMatch}</ComboboxEmpty>
          <ComboboxList ref={listRef}>
            {(group: StationGroup) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(name: StationName) => (
                    <ComboboxItem key={name} value={name} className="min-h-11 text-sm/relaxed">
                      {code(stations[stationIndex(name)].index)} {name}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
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
