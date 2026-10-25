import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ThemeProvider } from "@/components/theme-provider";
import { publicShareHost } from "@/lib/share-host";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const title = "ECRL Fare Calculator";
const description =
  "Starting fares for ECRL Economy Transit between all 16 stations, Gombak to Kota Bharu.";

async function shareHost() {
  const fromEnv = publicShareHost(process.env.VITE_PUBLIC_HOSTNAME);
  if (fromEnv) return fromEnv;
  const requestHeaders = await headers();
  return publicShareHost(requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"));
}

export async function generateMetadata(): Promise<Metadata> {
  const host = await shareHost();
  return {
    title,
    description,
    icons: { icon: "/favicon.svg" },
    openGraph: host
      ? {
          title,
          description,
          images: [{ url: `https://${host}/og.jpg`, width: 1200, height: 630 }],
        }
      : { title, description },
  };
}

export const viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = await shareHost();
  const xBanner = host ? `https://${host}/x-banner.jpg` : "";

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>{xBanner ? <meta property="x:game:image" content={xBanner} /> : null}</head>
      <body className={`${inter.className} antialiased`}>
        <PreviewHostBridge />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
