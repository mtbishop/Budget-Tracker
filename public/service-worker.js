const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/db.js',
  '/style.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/index.js',
];

const CACHE = 'cache-v1';
const DATA_CACHE = 'data-cache-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(DATA_CACHE).then((value) => value.add('/api/transaction'))
  );
});
