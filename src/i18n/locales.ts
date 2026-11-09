export const locales = ["en", "ms"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Device-only choice. The Cloudflare function reads it to serve prebuilt Malay HTML. */
export const LOCALE_COOKIE = "ecrl-locale";

/** Marks prebuilt Malay HTML so the client hydrates in Malay on the first render. */
export const LOCALE_META = "ecrl-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function htmlLang(locale: Locale): "en-MY" | "ms-MY" {
  return locale === "ms" ? "ms-MY" : "en-MY";
}
