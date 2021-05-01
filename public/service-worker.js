const CACHE = 'cache-v1';
const DATA_CACHE = 'data-cache-v1';


self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(DATA_CACHE).then((c) => c.add('/api/transaction'))
  );

  e.waitUntil(
    caches.open('static').then((c) => {
      return c.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/index.js',
        '/transactiondb.js',
        '/run-sw.js',
        '/manifest.webmanifest',
        './icons/icon-192x192.png',
        './icons/icon-512x512.png',
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
      return c.match(e.request).then((response) => {
        return response || fetch(e.request);
      });
    })
  );
});
