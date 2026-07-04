const CACHE_NAME = "nak-electrolitos-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./activacion.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Orígenes que NUNCA deben pasar por caché (activación con Firebase).
const BYPASS = [
  "firestore.googleapis.com",
  "firebase.googleapis.com",
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com",
  "www.gstatic.com",
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

  // Firebase / Firestore: dejar pasar directo a la red (sin caché).
  const host = new URL(req.url).hostname;
  if (BYPASS.some((h) => host.includes(h))) return;

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
