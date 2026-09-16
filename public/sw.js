// Service worker de Trader Marketer.
// - Recursos estáticos de Next (/_next/static): cache-first (tienen hash en el nombre).
// - Páginas y datos: network-first con respaldo en caché, para usar la app sin conexión.
// - Navegaciones sin red ni caché: página /offline.
// - La app envía un mensaje CACHE_URLS con los recursos que cargó antes de que
//   este service worker la controlara (primera visita), para no perderlos.

const VERSION = "tm-v2";
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const PRECACHE = [
  "/offline",
  "/panel",
  "/documentos",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
];

const isStatic = (url) => url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) return;

  event.waitUntil(
    Promise.all(
      event.data.urls.map(async (href) => {
        const url = new URL(href, self.location.origin);
        if (url.origin !== self.location.origin) return;
        const cacheName = isStatic(url) ? STATIC_CACHE : RUNTIME_CACHE;
        const cache = await caches.open(cacheName);
        if (await cache.match(url.href)) return;
        try {
          const response = await fetch(url.href);
          if (response.ok) await cache.put(url.href, response);
        } catch {
          // Sin red: se reintentará en la próxima visita.
        }
      }),
    ),
  );
});

async function cacheFirst(event) {
  const cached = await caches.match(event.request);
  if (cached) return cached;
  const response = await fetch(event.request);
  if (response.ok) {
    const copy = response.clone();
    event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, copy)));
  }
  return response;
}

async function networkFirst(event, fallbackUrl) {
  try {
    const response = await fetch(event.request);
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy)));
    }
    return response;
  } catch (error) {
    // Primero la copia más reciente (runtime) y luego la precargada. En navegaciones
    // solo sirve HTML, para no devolver por error una respuesta RSC de la misma URL.
    const navigate = event.request.mode === "navigate";
    const options = { ignoreVary: navigate };
    const candidates = [
      await (await caches.open(RUNTIME_CACHE)).match(event.request, options),
      await caches.match(event.request, options),
    ];
    const cached = candidates.find(
      (response) => response && (!navigate || response.headers.get("content-type")?.includes("text/html")),
    );
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await caches.match(fallbackUrl);
      if (fallback) return fallback;
    }
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (isStatic(url)) {
    event.respondWith(cacheFirst(event));
    return;
  }

  event.respondWith(networkFirst(event, request.mode === "navigate" ? "/offline" : undefined));
});
