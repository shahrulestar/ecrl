const CACHE = "ecrl-v1";
const PAGES = ["/trip", "/station", "/table", "/map"];
const SHELLS = PAGES.flatMap((page) => [page, `/ms${page}`]);

function shellPath(pathname, malay) {
  const bare = pathname.replace(/\/$/, "").replace(/^\/ms(?=\/)/, "") || "/trip";
  const page = PAGES.includes(bare) ? bare : "/trip";
  return malay ? `/ms${page}` : page;
}

async function wantsMalay(request) {
  const header = request.headers.get("cookie") ?? "";
  if (/(?:^|;\s*)ecrl-locale=ms(?:;|$)/.test(header)) return true;
  if (/(?:^|;\s*)ecrl-locale=en(?:;|$)/.test(header)) return false;
  if ("cookieStore" in self) {
    const cookie = await self.cookieStore.get("ecrl-locale");
    return cookie?.value === "ms";
  }
  return false;
}

async function precacheShells() {
  const cache = await caches.open(CACHE);
  await Promise.all(
    SHELLS.map(async (path) => {
      const response = await fetch(path, { credentials: "omit", cache: "reload" });
      if (response.ok) await cache.put(path, response);
    }),
  );
}

async function networkFirstPage(request) {
  try {
    const response = await fetch(request);
    if (response.ok) return response;
  } catch {
    /* offline: fall through to the precached shell */
  }
  const url = new URL(request.url);
  const malay = await wantsMalay(request);
  const cached = await caches.match(shellPath(url.pathname, malay));
  if (cached) return cached;
  return fetch(request);
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShells());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  const isStatic = url.pathname.startsWith("/_next/static/");
  const isImage = /\.(?:png|webp|svg|jpe?g|gif|ico|avif)$/i.test(url.pathname);
  if (isStatic || isImage) event.respondWith(cacheFirst(request));
});
