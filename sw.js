// 🔥 FORCE CACHE CLEAR - v6 (Date.now() हटाइयो)
const VERSION = 'dwn-v6';

self.addEventListener('install', e => {
  console.log('📦 SW installing:', VERSION);
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('✅ SW activated:', VERSION);
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  
  // HTML — network first
  if (e.request.mode === 'navigate' || 
      e.request.destination === 'document' ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  
  // JS/CSS — network first
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  
  // बाँकी — network first
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// Force update message
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
