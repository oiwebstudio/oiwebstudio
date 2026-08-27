// Hace que la app abra sin conexión. Estrategia: primero la red, y si no hay,
// lo guardado. Al revés (caché primero) es lo que hacía que salieran versiones
// viejas y hubiera que recargar dos veces.
//
// Al cambiar VERSION se tira todo lo anterior.

const VERSION = 'mi-panel-v8';
const BASICOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './entrada.webp',
  './fuentes/onest-400.woff2',
  './fuentes/onest-500.woff2',
  './fuentes/onest-600.woff2',
  './fuentes/onest-700.woff2',
  './iconos/icono-192.png',
  './iconos/icono-512.png',
  './iconos/icono-180.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(BASICOS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),   // si algo no está, se instala igual
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Solo lo propio: las cotizaciones y demás van siempre a la red.
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r.ok) {
          const copia = r.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copia));
        }
        return r;
      })
      .catch(() => caches.match(e.request).then((g) => g || caches.match('./index.html'))),
  );
});
