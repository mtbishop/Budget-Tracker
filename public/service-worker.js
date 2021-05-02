const CACHE = 'cache-v1';
const DATA_CACHE = 'data-cache-v1';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('static').then((cache) => {
      return cache.addAll([
        '/',
        'index.html',
        'styles.css',
        'index.js',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png',
        'manifest.webmanifest',
      ]);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then((k) => {
      return Promise.all(
        k.map((key) => {
          if (key !== CACHE && key !== DATA_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('/api/')) {
    e.respondWith(
      caches
        .open(DATA_CACHE)
        .then((c) => {
          return fetch(e.request)
            .then((response) => {
              if (response.status === 200) {
                c.put(e.request.url, response.clone());
              }
              return response;
            })
            .catch((err) => {
              return c.match(e.request);
            });
        })
        .catch((err) => console.log(err))
    );
    return;
  }
  e.respondWith(
    caches.open(CACHE).then((c) => {
      if (
        e.request.cache === 'only-if-cached' &&
        e.request.mode !== 'same-origin'
      ) {
        return;
      }
      return c.match(e.request).then((response) => {
        return response || fetch(e.request);
      });
    })
  );
});
