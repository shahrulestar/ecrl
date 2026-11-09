import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ThemeProvider } from "@/components/theme-provider";
import { en } from "@/i18n/en";
import { ms } from "@/i18n/ms";
import { I18nProvider } from "@/i18n/provider";
import { siteUrl } from "@/lib/site-url";
import { inter } from "./font";
import cover from "./ecrl-cover.png";
import "./globals.css";

const m = en.meta;
const url = siteUrl();

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  ...(url ? { metadataBase: url } : {}),
  title: { absolute: m.tripTitle },
  description: m.tripDescription,
  applicationName: m.siteName,
  category: "travel",
  keywords: [...m.keywords, ...ms.meta.keywords],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/trip" },
  openGraph: {
    type: "website",
    siteName: m.siteName,
    locale: "en_MY",
    alternateLocale: ["ms_MY"],
    title: m.tripTitle,
    description: m.tripDescription,
    url: "/trip",
    images: [{ url: cover.src, width: cover.width, height: cover.height, alt: m.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: m.tripTitle,
    description: m.tripDescription,
    images: [cover.src],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: m.siteName,
  description: m.tripDescription,
  alternateName: ms.meta.siteName,
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  inLanguage: ["en-MY", "ms-MY"],
  isAccessibleForFree: true,
  ...(url ? { url: new URL("/trip", url).href } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-MY" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <NuqsAdapter>
            <I18nProvider>{children}</I18nProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
