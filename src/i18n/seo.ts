import type { Metadata } from "next";
import cover from "@/app/ecrl-cover.png";
import { htmlLang, LOCALE_META, type Locale } from "./locales";
import { getMessages } from "./messages";

export type FarePage = "trip" | "station" | "table" | "map";

const pathFor = (page: FarePage, locale: Locale) => (locale === "ms" ? `/ms/${page}` : `/${page}`);

export function pageMetadata(page: FarePage, locale: Locale = "en"): Metadata {
  const m = getMessages(locale).meta;
  const copy =
    page === "station"
      ? { title: m.stationTitle, description: m.stationDescription }
      : page === "table"
        ? { title: m.tableTitle, description: m.tableDescription }
        : page === "map"
          ? { title: m.mapTitle, description: m.mapDescription }
          : { title: m.tripTitle, description: m.tripDescription };
  const url = pathFor(page, locale);
  return {
    title: { absolute: copy.title },
    description: copy.description,
    keywords: m.keywords,
    applicationName: m.siteName,
    alternates: {
      canonical: url,
      languages: {
        [htmlLang("en")]: pathFor(page, "en"),
        [htmlLang("ms")]: pathFor(page, "ms"),
        "x-default": pathFor(page, "en"),
      },
    },
    openGraph: {
      type: "website",
      siteName: m.siteName,
      locale: locale === "ms" ? "ms_MY" : "en_MY",
      alternateLocale: [locale === "ms" ? "en_MY" : "ms_MY"],
      title: copy.title,
      description: copy.description,
      url,
      images: [{ url: cover.src, width: cover.width, height: cover.height, alt: m.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: [cover.src] },
    ...(locale === "ms" ? { other: { [LOCALE_META]: "ms" } } : {}),
  };
}
