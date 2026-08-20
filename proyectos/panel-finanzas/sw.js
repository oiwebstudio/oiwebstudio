/* Service worker: deja la app instalable y usable sin conexión.
   El armazón se cachea; los datos y la API nunca. */

const VERSION = 'panel-v7';
const ARMAZON = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/inicio.html',
  '/habitos.html',
  '/resumen.html',
  '/assets/estilos.css',
  '/assets/app.js',
  '/assets/comun.js',
  '/assets/inicio.js',
  '/assets/negocio.js',
  '/assets/personal.js',
  '/assets/calendario.js',
  '/assets/objetivos.js',
  '/assets/importar.js',
  '/vendor/chart.umd.js',
  '/vendor/xlsx.full.min.js',
  '/manifest.webmanifest',
  '/iconos/icono-192.png',
  '/iconos/icono-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(VERSION)
      // addAll falla entero si un recurso falla; se piden de uno en uno.
      .then((c) => Promise.allSettled(ARMAZON.map((r) => c.add(r))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // La API escribe en el Excel: jamás se cachea ni se sirve en diferido.
  if (url.pathname.startsWith('/api/')) return;

  // El Excel es el dato vivo: red primero, y solo si no hay red, la última copia.
  if (url.pathname.endsWith('.xlsx')) {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const copia = r.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copia));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Armazón: red primero. Cachear primero ahorraba una petición, pero servía la
  // versión vieja tras cada actualización y obligaba a recargar dos veces.
  // La caché queda solo como red de seguridad para cuando no hay conexión.
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r.ok) {
          const copia = r.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copia));
        }
        return r;
      })
      .catch(() => caches.match(e.request).then((guardado) => guardado || caches.match('/inicio.html')))
  );
});
