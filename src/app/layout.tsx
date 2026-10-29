import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/theme-provider";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const title = "ECRL Fare Calculator: Gombak to Kota Bharu";
const description =
  "Check the Economy Transit starting fare between any two of the 16 stations, from Gombak to Kota Bharu. It costs the same in both directions.";

const url = siteUrl();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ECRL Fare Calculator",
  description,
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  inLanguage: "en-MY",
  isAccessibleForFree: true,
  ...(url ? { url: url.href } : {}),
};

export const metadata: Metadata = {
  ...(url ? { metadataBase: url } : {}),
  title: {
    absolute: title,
  },
  description,
  applicationName: "ECRL Fare Calculator",
  category: "travel",
  keywords: [
    "ECRL fare",
    "ECRL fare calculator",
    "Economy Transit",
    "Gombak to Kota Bharu",
    "East Coast Rail Link",
  ],
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
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_MY",
    siteName: "ECRL Fare Calculator",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-MY" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
