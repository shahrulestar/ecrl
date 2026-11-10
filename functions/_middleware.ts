/** Serves prebuilt Malay HTML at the clean URL when the device chose Malay. No redirect, no flash. */
interface AssetsEnv {
  ASSETS: { fetch: (request: Request | URL | string) => Promise<Response> };
}

interface Context {
  request: Request;
  env: AssetsEnv;
  next: () => Promise<Response>;
}

const pages = new Set(["/trip", "/station", "/table", "/map"]);
const malayCookie = /(?:^|;\s*)ecrl-locale=ms(?:;|$)/;

export async function onRequest({ request, env, next }: Context): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "");
  if (request.method !== "GET" || !pages.has(path)) return next();

  const wantsMalay = malayCookie.test(request.headers.get("cookie") ?? "");
  const upstream = wantsMalay ? await env.ASSETS.fetch(new URL(`/ms${path}`, url)) : await next();
  const response = new Response(upstream.body, upstream);
  response.headers.append("Vary", "Cookie");
  return response;
}
