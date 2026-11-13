"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMessages } from "./messages";
import { defaultLocale, htmlLang, LOCALE_COOKIE, LOCALE_META, type Locale } from "./locales";
import type { Messages } from "./types";

interface I18nValue {
  locale: Locale;
  m: Messages;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

const MS_PREFIX = /^\/ms(?=\/|$)/;

/** Malay HTML lives at `/ms/...` for search engines. English leaves that prefix only when chosen. */
function barePath(pathname: string) {
  return pathname.replace(MS_PREFIX, "") || "/trip";
}

/** Prebuilt Malay HTML carries a meta marker (also when served at /trip); otherwise English. */
function initialLocale(pathname: string): Locale {
  if (typeof document === "undefined") return MS_PREFIX.test(pathname) ? "ms" : defaultLocale;
  const marker = document.head.querySelector(`meta[name="${LOCALE_META}"]`);
  return marker?.getAttribute("content") === "ms" ? "ms" : defaultLocale;
}

function readCookie(): Locale | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=(en|ms)`));
  return match ? (match[1] as Locale) : null;
}

/** Offline fallback reads this when the worker cannot see the cookie header. */
function publishLocale(locale: Locale) {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.getRegistration().then((registration) => {
    registration?.active?.postMessage({ type: "locale", locale });
  }).catch(() => {});
}

function pageCopy(m: Messages, rawPathname: string) {
  const pathname = rawPathname.replace(MS_PREFIX, "") || "/";
  if (pathname.startsWith("/station"))
    return { title: m.meta.stationTitle, description: m.meta.stationDescription };
  if (pathname.startsWith("/table"))
    return { title: m.meta.tableTitle, description: m.meta.tableDescription };
  if (pathname.startsWith("/map"))
    return { title: m.meta.mapTitle, description: m.meta.mapDescription };
  return { title: m.meta.tripTitle, description: m.meta.tripDescription };
}

function setMeta(selector: string, content: string) {
  for (const el of document.head.querySelectorAll(selector))
    if (el.getAttribute("content") !== content) el.setAttribute("content", content);
}

/** Keep head tags in step with the visible language (the page has one URL per tab). */
function syncHead(locale: Locale, m: Messages, pathname: string) {
  const { title, description } = pageCopy(m, pathname);
  if (document.documentElement.lang !== htmlLang(locale))
    document.documentElement.lang = htmlLang(locale);
  if (document.title !== title) document.title = title;
  setMeta('meta[name="description"]', description);
  setMeta('meta[name="application-name"]', m.meta.siteName);
  setMeta('meta[name="keywords"]', m.meta.keywords.join(", "));
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:site_name"]', m.meta.siteName);
  setMeta('meta[property="og:locale"]', locale === "ms" ? "ms_MY" : "en_MY");
  setMeta('meta[property="og:image:alt"]', m.meta.ogAlt);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
}

/** English first, so server HTML and the first client render match. Malay is applied after load. */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale(pathname));

  // Dev and non-Cloudflare hosts serve English HTML, so honour the saved choice after load.
  // An explicit `/ms/...` URL stays Malay; the English cookie must not rewrite it.
  useEffect(() => {
    const saved = readCookie();
    if (!saved) return;
    if (saved === defaultLocale && MS_PREFIX.test(pathname)) return;
    setLocaleState(saved);
  }, [pathname]);

  useEffect(() => {
    const m = getMessages(locale);
    syncHead(locale, m, pathname);
    const observer = new MutationObserver(() => syncHead(locale, m, pathname));
    observer.observe(document.head, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale, pathname]);

  useEffect(() => {
    publishLocale(locale);
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    publishLocale(next);
    if (next === defaultLocale && MS_PREFIX.test(pathname))
      router.replace(`${barePath(pathname)}${window.location.search}`, { scroll: false });
  }

  return (
    <I18nContext.Provider value={{ locale, m: getMessages(locale), setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used within I18nProvider");
  return value;
}
