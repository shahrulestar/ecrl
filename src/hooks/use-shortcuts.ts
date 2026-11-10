"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { FARE_QUERY_KEY } from "@/lib/fare-search";
import { useFareState } from "@/lib/use-fare-state";

const TABS = ["trip", "station", "table", "map"] as const;

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(
      target.closest("input, textarea, select, [contenteditable], [role=combobox], [role=listbox]"),
    )
  );
}

/** Keyboard: 1–4 switch tabs, S swaps stations, / focuses the picker, D toggles theme. */
export function Shortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { resolvedTheme, setTheme } = useTheme();
  const [state, setQuery] = useFareState();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat || event.defaultPrevented)
        return;
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if (key === "d") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        return;
      }

      const tabIndex = ["1", "2", "3", "4"].indexOf(event.key);
      if (tabIndex >= 0) {
        const id = TABS[tabIndex];
        const q = params.get(FARE_QUERY_KEY);
        router.push(`/${id}${q ? `?${FARE_QUERY_KEY}=${encodeURIComponent(q)}` : ""}`);
        return;
      }

      const bare = pathname.replace(/^\/ms(?=\/|$)/, "");
      if (key === "s" && bare.startsWith("/trip")) {
        setQuery({ from: state.to, to: state.from });
        window.dispatchEvent(new Event("fare:swap"));
        return;
      }

      if (event.key === "/") {
        const picker = document.querySelector<HTMLElement>("#from, #line-from");
        if (!picker) return;
        event.preventDefault();
        picker.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [params, pathname, resolvedTheme, router, setQuery, setTheme, state.from, state.to]);

  return null;
}
