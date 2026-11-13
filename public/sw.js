const STATIC_CACHE = "ecrl-static-v2";
const SHELL_CACHE = "ecrl-shell-v2";
const META_CACHE = "ecrl-meta-v2";
const KEEP = new Set([STATIC_CACHE, SHELL_CACHE, META_CACHE]);
const PAGES = ["/trip", "/station", "/table", "/map"];
const localeKey = new Request("https://offline.ecrl/locale");

function barePage(pathname) {
  const bare = pathname.replace(/\/$/, "").replace(/^\/ms(?=\/)/, "") || "/trip";
  return PAGES.includes(bare) ? bare : "/trip";
}

function pathIsMalay(pathname) {
  return /^\/ms(?=\/|$)/.test(pathname.replace(/\/$/, ""));
}

function shellKey(pathname, malay) {
  return new Request(`https://offline.ecrl/${malay ? "ms" : "en"}${barePage(pathname)}`);
}

async function readLocale() {
  const cache = await caches.open(META_CACHE);
  const saved = await cache.match(localeKey);
  if (!saved) return null;
  const value = (await saved.text()).trim();
  return value === "ms" || value === "en" ? value : null;
}

async function wantsMalay(request) {
  const header = request.headers.get("cookie") ?? "";
  if (/(?:^|;\s*)ecrl-locale=ms(?:;|$)/.test(header)) return true;
  if (/(?:^|;\s*)ecrl-locale=en(?:;|$)/.test(header)) return false;
  if ("cookieStore" in self) {
    try {
      const cookie = await self.cookieStore.get("ecrl-locale");
      if (cookie?.value === "ms" || cookie?.value === "en") return cookie.value === "ms";
    } catch {
      /* Cookie Store can reject; fall through to the last page choice. */
    }
  }
  return (await readLocale()) === "ms";
}

async function storeShell(request, response) {
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html")) return;
  const html = await response.text();
  const malay = /name="ecrl-locale"[^>]*content="ms"|content="ms"[^>]*name="ecrl-locale"/.test(html);
  const cache = await caches.open(SHELL_CACHE);
  await cache.put(
    shellKey(new URL(request.url).pathname, malay),
    new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } }),
  );
}

async function networkFirstPage(request, event) {
  try {
    const response = await fetch(request);
    if (response.ok) event.waitUntil(storeShell(request, response.clone()));
    return response;
  } catch {
    const url = new URL(request.url);
    const malay = pathIsMalay(url.pathname) || (await wantsMalay(request));
    const cache = await caches.open(SHELL_CACHE);
    const cached = await cache.match(shellKey(url.pathname, malay));
    if (cached) return cached;
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener("message", (event) => {
  const locale = event.data?.locale;
  if (event.data?.type !== "locale" || (locale !== "en" && locale !== "ms")) return;
  event.waitUntil(
    caches.open(META_CACHE).then((cache) => cache.put(localeKey, new Response(locale))),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => !KEEP.has(key)).map((key) => caches.delete(key)))),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request, event));
    return;
  }

  const isStatic = url.pathname.startsWith("/_next/static/");
  const isImage = /\.(?:png|webp|svg|jpe?g|gif|ico|avif)$/i.test(url.pathname);
  if (isStatic || isImage) event.respondWith(cacheFirst(request));
});
