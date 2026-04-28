/* Artesana del Barro - Service Worker v6
   Estrategia: Cache-First para assets estáticos, Network-First para HTML
*/

const CACHE_VERSION = 'v6';
const STATIC_CACHE = `artesana-static-${CACHE_VERSION}`;
const IMAGE_CACHE  = `artesana-images-${CACHE_VERSION}`;
const ALL_CACHES   = [STATIC_CACHE, IMAGE_CACHE];

// Assets críticos que se cachean en el install
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/schedule.css',
  './js/main.js',
  './js/schedule.js',
  './logo.webp',
  './logo-letras.webp',
  './logo-footer.webp',
  './wa-white.webp'
];

// ── INSTALL: precachear assets críticos ──────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpiar caches viejas ─────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !ALL_CACHES.includes(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH: estrategia por tipo de recurso ────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar requests del mismo origen o assets conocidos
  if (request.method !== 'GET') return;

  // HTML → Network-First (siempre contenido fresco)
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  // Imágenes → Cache-First con fallback a red y cache posterior
  if (/\.(webp|png|jpg|jpeg|svg|gif)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // CSS / JS / Fonts → Cache-First (versionados con query string)
  if (/\.(css|js|woff2|woff)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Resto → Network con fallback a cache
  event.respondWith(networkFirst(request, STATIC_CACHE));
});

// ── HELPERS ──────────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('', { status: 408, statusText: 'Offline' });
  }
}
