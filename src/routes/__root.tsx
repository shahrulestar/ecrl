import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ThemeProvider } from "@/components/theme-provider";
import appCss from "../styles.css?url";

const APP_NAME = "ECRL Fare Calculator";

function publicShareHost(raw: string | undefined) {
  const host = String(raw ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
  if (
    host === "vercel.app" ||
    host.endsWith(".vercel.app") ||
    host === "vercel.com" ||
    host.endsWith(".vercel.com")
  ) {
    return "";
  }
  return host;
}

async function resolveShareHost() {
  const fromEnv = publicShareHost(import.meta.env.VITE_PUBLIC_HOSTNAME);
  if (fromEnv) return fromEnv;
  if (!import.meta.env.SSR) return "";
  try {
    const { getRequestHost } = await import("@tanstack/react-start/server");
    return publicShareHost(getRequestHost({ xForwardedHost: true }));
  } catch {
    return "";
  }
}

export const Route = createRootRoute({
  head: async () => {
    const host = await resolveShareHost();
    const meta: Array<Record<string, string>> = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Starting fares for ECRL Economy Transit between all 16 stations, Gombak to Kota Bharu.",
      },
      { name: "theme-color", content: "#2563EB" },
    ];
    if (host) {
      const xBanner = `https://${host}/x-banner.jpg`;
      meta.push({ property: "x:game:image", content: xBanner });
    }
    return {
      meta,
      links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    };
  },
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <ThemeProvider>
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  ),
});
