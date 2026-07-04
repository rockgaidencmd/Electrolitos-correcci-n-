const CACHE_NAME = "nak-electrolitos-v8";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estrategia:
// - Documento/navegación (index.html): NETWORK-FIRST. Así, con internet,
//   siempre se ve la última versión publicada en Vercel; sin internet,
//   cae al caché y la app sigue funcionando.
// - Resto de recursos (íconos, manifest): CACHE-FIRST para velocidad.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const isDoc = req.mode === "navigate" ||
    (req.destination === "document") ||
    req.headers.get("accept")?.includes("text/html");

  if (isDoc) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
