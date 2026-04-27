const CACHE_NAME = 'artesana-del-barro-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './css/schedule.css',
  './js/main.js',
  './js/schedule.js',
  './img/hero_bg.webp',
  './logo.webp',
  './logo-letras.webp',
  './logo-footer.webp',
  './wa-white.webp'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Assets
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Return from cache
      }
      return fetch(event.request).then(networkResponse => {
        // Cache new static assets
        if (event.request.url.match(/\.(webp|png|jpg|jpeg|svg|css|js|woff2)$/)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});
