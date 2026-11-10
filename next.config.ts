import type { NextConfig } from "next";

const MYT_OFFSET_MS = 8 * 60 * 60 * 1000;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  env: {
    /** Build day in Malaysia time. The static HTML shows that day's promo phase. */
    NEXT_PUBLIC_BUILD_DATE: new Date(Date.now() + MYT_OFFSET_MS).toISOString().slice(0, 10),
  },
};

export default nextConfig;
