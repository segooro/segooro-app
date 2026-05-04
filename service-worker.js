const CACHE_NAME = 'segooro-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://raw.githubusercontent.com/Dakrooon/img/main/segooro.png'
];

// Install Service Worker & Simpan Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ambil dari Cache jika tidak ada sinyal (Offline / Cepat)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
