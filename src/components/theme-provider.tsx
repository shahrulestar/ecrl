"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

const themeBar = { light: "#ffffff", dark: "#0a0a0a" } as const;
const iosStatusBar = { light: "default", dark: "black-translucent" } as const;

/** Class theme overrides the OS media query, so the installed status bar follows the toggle. */
function ThemeColor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
    const color = themeBar[resolvedTheme];
    document.querySelectorAll('meta[name="theme-color"]').forEach((node) => {
      node.setAttribute("content", color);
      node.removeAttribute("media");
    });
  }, [resolvedTheme]);

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
    const style = iosStatusBar[resolvedTheme];
    const appleStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (appleStatus) appleStatus.setAttribute("content", style);
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeColor />
      {children}
    </NextThemesProvider>
  );
}
