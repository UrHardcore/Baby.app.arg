const CACHE_NAME = 'mi-baby-arg-v9';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/storage.js',
  '/js/dashboard.js',
  '/js/vaccines.js',
  '/js/reminders.js',
  '/js/medical.js',
  '/js/growth.js',
  '/js/info.js',
  '/js/data.js',
  '/js/utils.js',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('firebasejs') || e.request.url.includes('googleapis')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
