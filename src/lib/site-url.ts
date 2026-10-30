export function siteUrl(): URL | null {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.CF_PAGES_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!raw) return null;

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}
