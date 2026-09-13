// 🔥 FORCE CACHE CLEAR - v5
const VERSION = 'v5-' + Date.now();

self.addEventListener('install', e => {
  console.log('📦 New SW installing:', VERSION);
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('✅ SW activated:', VERSION);
  e.waitUntil(
    caches.keys().then(keys => {
      console.log('🗑️ Found caches:', keys);
      return Promise.all(
        keys.map(k => {
          console.log('❌ Deleting cache:', k);
          return caches.delete(k);
        })
      );
    }).then(() => {
      console.log('🎯 All caches cleared');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  
  // HTML — सधैँ network बाट (cache बाट कहिल्यै होइन)
  if (e.request.mode === 'navigate' || 
      e.request.destination === 'document' ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/' ||
      url.pathname === '') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  
  // JS/CSS — सधैँ network बाट
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  
  // Image — network first
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

// 🔄 Force update message
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (e.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => 
      Promise.all(keys.map(k => caches.delete(k)))
    );
  }
});
