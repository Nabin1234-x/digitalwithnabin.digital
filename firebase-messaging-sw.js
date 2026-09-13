importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCcKYUIL8mICWxEk7qdK6ucGHhqRS08BbA",
  authDomain: "digital-with-nabin-6ec1d.firebaseapp.com",
  projectId: "digital-with-nabin-6ec1d",
  storageBucket: "digital-with-nabin-6ec1d.firebasestorage.app",
  messagingSenderId: "602694608782",
  appId: "1:602694608782:web:62ce9fa1232de6187866df"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Digital With Nabin';
  const body = payload.notification?.body || 'New message';
  
  self.registration.showNotification(title, {
    body: body,
    icon: 'https://i.postimg.cc/xTSszSb2/fb-photo-nabin.jpg',
    badge: 'https://i.postimg.cc/xTSszSb2/fb-photo-nabin.jpg',
    vibrate: [200, 100, 200],
    tag: 'dwn-msg',
    renotify: true,
    silent: false
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('digitalwithnabin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('https://digitalwithnabin.digital');
      }
    })
  );
});
