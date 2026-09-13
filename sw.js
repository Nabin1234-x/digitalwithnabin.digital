// 🚀 Force Update Service Worker
const CACHE = 'dwn-v4-' + Date.now();

self.addEventListener('install', e => {
  console.log('📦 New SW installing...');
  self.skipWaiting(); // तुरुन्तै activate
});

self.addEventListener('activate', e => {
  console.log('✅ SW activated');
  e.waitUntil(
    caches.keys().then(keys => {
      console.log('🗑️ Clearing old caches:', keys);
      return Promise.all(
        keys.map(k => {
          console.log('Deleting:', k);
          return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // HTML — सधैँ network बाट (cache नगर्ने)
  if (e.request.mode === 'navigate' || 
      e.request.destination === 'document' ||
      e.request.url.endsWith('.html') ||
      e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  
  // Image — सधैँ network बाट
  if (e.request.destination === 'image') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  
  // बाँकी — network first
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// 🔄 Message ले update force गर्न
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
