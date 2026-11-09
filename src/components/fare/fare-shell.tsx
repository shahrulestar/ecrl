"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { launchPromo, type PromoPhase } from "@/data/fares";
import { usePromoPhase } from "@/components/fare/shared";

const footnotes = [
  { label: "Return", text: "Same price both ways." },
  {
    label: "Pricing",
    text: "Starting fares. The real price can change with demand, time, and seats left.",
  },
  {
    label: "Concessions",
    text: "Student 40% off. Child, senior, OKU, and pensioner 50% off. Not a live ticket price.",
  },
];

function footnotesFor(phase: PromoPhase | null) {
  if (phase !== "before" && phase !== "active") return footnotes;
  return [
    ...footnotes,
    {
      label: "Launch",
      text: `Malaysians, ${launchPromo.startLabel} to ${launchPromo.endLabel}. You get this 30% or your concession, whichever is larger.`,
    },
  ];
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  const dark = ready && resolvedTheme === "dark";

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "d" || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.repeat || event.defaultPrevented) return;
      const target = event.target instanceof Element ? event.target : null;
      if (
        target?.closest(
          "input, textarea, select, [contenteditable], [role=combobox], [role=listbox]",
        )
      )
        return;
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-11"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-keyshortcuts="D"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <span className="relative size-4">
        <HugeiconsIcon
          icon={Sun01Icon}
          strokeWidth={2}
          className="absolute inset-0 size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90"
        />
        <HugeiconsIcon
          icon={Moon01Icon}
          strokeWidth={2}
          className="absolute inset-0 size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0"
        />
      </span>
    </Button>
  );
}

const tabLinks = [
  { id: "trip", label: "Your Trip" },
  { id: "station", label: "By Station" },
  { id: "table", label: "Fare Table" },
] as const;

/** Carry the chosen station(s) between tabs so switching does not lose the pick. */
function tabHref(id: (typeof tabLinks)[number]["id"], params: URLSearchParams): string {
  const from = params.get("f") ?? params.get("s");
  const to = params.get("t");
  const next = new URLSearchParams();
  if (id === "station") {
    if (from) next.set("s", from);
  } else {
    if (from) next.set("f", from);
    if (to) next.set("t", to);
    if (id === "trip") {
      const party = params.get("p");
      const my = params.get("my");
      if (party) next.set("p", party);
      if (my) next.set("my", my);
    }
  }
  const qs = next.toString();
  return `/${id}${qs ? `?${qs}` : ""}`;
}

function TabNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = tabLinks.find((tab) => pathname.startsWith(`/${tab.id}`))?.id ?? "trip";

  return (
    <Tabs value={active}>
      <TabsList className="grid w-full grid-cols-3 group-data-horizontal/tabs:h-11 sm:inline-flex sm:w-fit sm:self-start sm:group-data-horizontal/tabs:h-9">
        {tabLinks.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            nativeButton={false}
            className="px-3"
            render={<Link href={tabHref(tab.id, params)} />}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export function FareShell({ children }: { children: React.ReactNode }) {
  const phase = usePromoPhase();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto flex w-full max-w-page flex-1 flex-col gap-6 px-4 pt-6 pb-6 md:px-6 md:pb-10">
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="type-page-title">ECRL Fare Calculator</h1>
          <p className="type-lead max-w-2xl">
            Check the Economy Transit starting fare between any two stations, Gombak to Kota Bharu.
            It costs the same in both directions.
          </p>
        </div>
        <TabNav />
        <div className="pt-0">{children}</div>
      </main>
      <footer className="mt-auto max-md:pb-32">
        <div className="mx-auto w-full max-w-page px-4 pb-6 md:px-6 md:pb-10">
          <Card>
            <CardContent className="flex flex-col gap-6">
              <dl className="grid gap-x-8 gap-y-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
                {footnotesFor(phase).map((note) => (
                  <div key={note.label} className="flex flex-col gap-0.5">
                    <dt className="font-medium text-foreground">{note.label}</dt>
                    <dd className="leading-relaxed text-muted-foreground">{note.text}</dd>
                  </div>
                ))}
              </dl>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-xs text-muted-foreground">
                    Learn more on the{" "}
                    <a
                      href="https://ecrl.com.my/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      ECRL website
                    </a>
                    .
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Built by{" "}
                    <a
                      href="https://shahrulestar.com"
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      shahrulestar.com
                    </a>
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>
    </div>
  );
}
