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
  self.registration.showNotification(
    payload.notification?.title || 'Digital With Nabin',
    {
      body: payload.notification?.body || 'New message',
      icon: 'https://i.postimg.cc/xTSszSb2/fb-photo-nabin.jpg',
      badge: 'https://i.postimg.cc/xTSszSb2/fb-photo-nabin.jpg',
      vibrate: [200, 100, 200],
      tag: 'dwn-msg',
      renotify: true
    }
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
