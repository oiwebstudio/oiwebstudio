/* Todo el armazón se guarda en el primer arranque: la app abre sin red.
   No hay API ni datos remotos que cachear: la base vive en el dispositivo. */

const VERSION = 'mi-panel-movil-v1';
const ARMAZON = [
  './',
  './index.html',
  './assets/estilos.css',
  './assets/app.js',
  './assets/datos.js',
  './manifest.webmanifest',
  './iconos/icono-192.png',
  './iconos/icono-512.png',
  './iconos/icono-maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.allSettled(ARMAZON.map((r) => c.add(r))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // Red primero para no servir versiones viejas; la caché es la red de seguridad.
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r.ok) { const copia = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copia)); }
        return r;
      })
      .catch(() => caches.match(e.request).then((g) => g || caches.match('./index.html')))
  );
});
