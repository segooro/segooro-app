// UBAH VERSI CACHE DI SINI (dari v1 ke v2)
const CACHE_NAME = 'segooro-v2';

// Masukkan link icon yang baru ke dalam daftar cache
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://raw.githubusercontent.com/segooro/segooro-app/main/segooro-192.png',
  'https://raw.githubusercontent.com/segooro/segooro-app/main/segooro-512.png'
];

// Install Service Worker & Simpan Cache
self.addEventListener('install', event => {
  // Memaksa service worker baru untuk langsung mengambil alih
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Hapus Cache Lama (Penting untuk ganti logo/versi!)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Ambil dari Cache atau Fetch dari internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// ==========================================
// TAMBAHAN: FUNGSI KLIK NOTIFIKASI PWA
// ==========================================
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Tutup notif di layar atas setelah diklik

    // Buka atau fokuskan kembali tab PWA Segoo.Ro yang sedang berjalan
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Cek jika PWA sudah terbuka tapi di-minimize, maka panggil ke depan (focus)
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url.indexOf('/') !== -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            // Jika benar-benar tertutup, buka jendela baru
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
