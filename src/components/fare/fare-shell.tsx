"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shortcuts } from "@/hooks/use-shortcuts";
import { fill } from "@/i18n/fill";
import { locales } from "@/i18n/locales";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { fareStateQuery, FARE_QUERY_KEY, legacyFareState } from "@/lib/fare-search";
import type { PromoPhase } from "@/data/fares";
import { usePromoPhase } from "@/components/fare/shared";
import type { Messages } from "@/i18n/types";

function footnotesFor(m: Messages, phase: PromoPhase | null) {
  const notes = [
    { key: "return", label: m.shell.returnLabel, text: m.shell.returnText },
    { key: "pricing", label: m.shell.pricingLabel, text: m.shell.pricingText },
    { key: "concessions", label: m.shell.concessionsLabel, text: m.shell.concessionsText },
  ];
  if (phase !== "before" && phase !== "active") return notes;
  return [
    ...notes,
    {
      key: "launch",
      label: m.shell.launchLabel,
      text: fill(m.shell.launchText, { start: m.promo.start, end: m.promo.end }),
    },
  ];
}

/** `!` keeps the icon swap animated while next-themes switches every other transition off. */
const themeIconSwap =
  "absolute inset-0 size-4 transition-[opacity,scale,rotate,filter]! duration-200! ease-[cubic-bezier(0.23,1,0.32,1)]!";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  const { m } = useI18n();
  const dark = ready && resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="size-11 rounded-none border-y-0 border-r-0 bg-transparent shadow-none dark:bg-transparent"
            aria-label={dark ? m.shell.themeToLight : m.shell.themeToDark}
            aria-keyshortcuts="D"
            onClick={() => setTheme(dark ? "light" : "dark")}
          />
        }
      >
      <span className="relative size-4">
        <HugeiconsIcon
          icon={Sun01Icon}
          strokeWidth={2}
          className={cn(themeIconSwap, "scale-100 rotate-0 opacity-100 dark:scale-50 dark:-rotate-90 dark:opacity-0 dark:blur-[2px]")}
        />
        <HugeiconsIcon
          icon={Moon01Icon}
          strokeWidth={2}
          className={cn(themeIconSwap, "scale-50 rotate-90 opacity-0 blur-[2px] dark:scale-100 dark:rotate-0 dark:opacity-100 dark:blur-none")}
        />
      </span>
      </TooltipTrigger>
      <TooltipContent className="max-md:hidden">
        {m.shell.shortcutTheme} <Kbd>D</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}

const tabLinks = [
  { id: "trip", labelKey: "tabTrip" },
  { id: "station", labelKey: "tabStation" },
  { id: "map", labelKey: "tabMap" },
] as const;

/** Carry the `q` code between tabs so switching does not lose the pick. */
function tabHref(id: (typeof tabLinks)[number]["id"], params: URLSearchParams): string {
  const q = params.get(FARE_QUERY_KEY);
  return `/${id}${q ? `?${FARE_QUERY_KEY}=${encodeURIComponent(q)}` : ""}`;
}

const LEGACY_KEYS = [
  "f", "t", "p", "s", "my", "from", "to", "adults", "students", "half", "passengers", "concession",
];

/** Old `f/t/p/s/my` links become a single `q` code. */
function LegacyParamsRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    const state = legacyFareState(new URLSearchParams(params.toString()));
    if (!state) return;
    const rest = new URLSearchParams(params.toString());
    for (const key of LEGACY_KEYS) rest.delete(key);
    const qs = fareStateQuery(state);
    const search = [qs, rest.toString()].filter(Boolean).join("&");
    router.replace(`${pathname}${search ? `?${search}` : ""}`);
  }, [params, pathname, router]);

  return null;
}

function LanguageSwitch() {
  const { locale, m, setLocale } = useI18n();

  return (
    <nav
      aria-label={m.shell.langLabel}
      className="flex h-11 items-center p-1 text-xs font-medium"
    >
      {locales.map((code) => {
        const active = code === locale;
        const name = code === "en" ? m.shell.langEn : m.shell.langMs;
        return (
          <button
            key={code}
            type="button"
            lang={code === "en" ? "en-MY" : "ms-MY"}
            aria-pressed={active}
            onClick={() => setLocale(code)}
            aria-label={name}
            className={cn(
              "h-full min-w-9 rounded-md px-2.5",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {code === "en" ? "EN" : "BM"}
          </button>
        );
      })}
    </nav>
  );
}

function HeaderControls() {
  return (
    <div className="flex h-11 shrink-0 items-stretch overflow-hidden rounded-lg border">
      <LanguageSwitch />
      <ThemeToggle />
    </div>
  );
}

function TabNav() {
  return <TabNavView params={useSearchParams()} />;
}

function TabNavView({ params }: { params: URLSearchParams }) {
  const { m } = useI18n();
  const pathname = usePathname().replace(/^\/ms(?=\/|$)/, "");
  const active =
    pathname.startsWith("/station") || pathname.startsWith("/table")
      ? "station"
      : (tabLinks.find((tab) => pathname.startsWith(`/${tab.id}`))?.id ?? "trip");

  return (
    <Tabs value={active}>
      <TabsList className="relative grid w-full grid-cols-3 group-data-horizontal/tabs:h-11 sm:inline-flex sm:w-fit sm:self-start sm:group-data-horizontal/tabs:h-9">
        <TabsIndicator />
        {tabLinks.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            nativeButton={false}
            className="relative z-10 px-1 text-[13px] data-active:bg-transparent max-[359px]:text-xs sm:px-3 sm:text-sm dark:data-active:border-transparent dark:data-active:bg-transparent"
            render={<Link href={tabHref(tab.id, params)} />}
          >
            {m.shell[tab.labelKey]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export function FareShell({ children }: { children: React.ReactNode }) {
  const { m } = useI18n();
  const phase = usePromoPhase();
  const bare = usePathname().replace(/^\/ms(?=\/|$)/, "") === "/map";

  if (bare)
    return (
      <>
        <Suspense fallback={null}>
          <Shortcuts />
        </Suspense>
        {children}
      </>
    );

  return (
    <div className="flex min-h-dvh flex-col bg-background max-lg:has-[[data-fare-peek]]:pb-[calc(8rem+env(safe-area-inset-bottom,0px))]">
      <Suspense fallback={null}>
        <Shortcuts />
      </Suspense>
      <main className="mx-auto flex w-full max-w-page flex-1 flex-col gap-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px))] pr-[max(1rem,env(safe-area-inset-right))] pb-6 pl-[max(1rem,env(safe-area-inset-left))] max-lg:min-h-dvh md:pr-[max(1.5rem,env(safe-area-inset-right))] md:pb-10 md:pl-[max(1.5rem,env(safe-area-inset-left))]">
        <div className="flex min-w-0 flex-col gap-2">
          <header>
            <h1 className="type-page-title min-w-0">{m.shell.title}</h1>
          </header>
        </div>
        <Suspense>
          <LegacyParamsRedirect />
        </Suspense>
        <Suspense fallback={<TabNavView params={new URLSearchParams()} />}>
          <TabNav />
        </Suspense>
        <div className="pt-0">{children}</div>
      </main>
      <footer className="mt-auto max-lg:mt-0">
        <div className="mx-auto w-full max-w-page pr-[max(1rem,env(safe-area-inset-right))] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pl-[max(1rem,env(safe-area-inset-left))] md:pr-[max(1.5rem,env(safe-area-inset-right))] md:pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] md:pl-[max(1.5rem,env(safe-area-inset-left))]">
          <Card>
            <CardContent className="flex flex-col gap-6">
              <dl className="grid gap-x-8 gap-y-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
                {footnotesFor(m, phase).map((note) => (
                  <div key={note.key} className="flex flex-col gap-0.5">
                    <dt className="font-medium text-foreground">{note.label}</dt>
                    <dd className="leading-relaxed text-muted-foreground">{note.text}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">
                    {m.shell.learnMoreBefore}
                    <a
                      href="https://ecrl.com.my/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {m.shell.learnMoreLink}
                    </a>
                    {m.shell.learnMoreAfter}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.shell.builtBy}{" "}
                    <a
                      href="https://shahrulestar.com"
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      shahrulestar.com
                    </a>
                  </p>
                </div>
                <HeaderControls />
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>
    </div>
  );
}
