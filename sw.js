const CACHE_NAME = 'dwn-v7';

// Install — तुरुन्तै activate
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate — पुरानो cache clear
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch — Network first (हरेक पटक server बाट ताजा)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // HTML page — कहिल्यै cache नगर्ने
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Message — SKIP_WAITING
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
