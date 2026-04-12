/* VChron Service Worker v4 — PWA with offline support, sync queue, push notifications */
const CACHE_VERSION = 'vchron-v4';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const OFFLINE_URL = '/app/offline';
const SYNC_TAG = 'sync-attendance';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo72.png',
  '/logo96.png',
  '/logo128.png',
  '/logo144.png',
  '/logo152.png',
  '/logo192.png',
  '/logo384.png',
  '/logo512.png',
  '/install',
  '/app/offline',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(PRECACHE_ASSETS).catch((err) =>
        console.warn('[SW] Pre-cache partial failure:', err)
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.hostname === 'api.vcron.cloud' || url.pathname.startsWith('/api/')) return;
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const indexCached = await caches.match('/index.html');
          return indexCached || caches.match(OFFLINE_URL) || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
        })
    );
    return;
  }

  if (url.pathname.startsWith('/assets/') || request.destination === 'script' || request.destination === 'style' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
          return res;
        });
      })
    );
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone));
          return res;
        }).catch(() => caches.match('/logo192.png'));
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone));
        return res;
      })
      .catch(() => caches.match(request))
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(
      self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
        clients.forEach((client) => client.postMessage({ type: 'SYNC_ATTENDANCE' }));
      })
    );
  }
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'VChron', {
      body: data.body || 'You have a new notification from VChron',
      icon: '/logo192.png',
      badge: '/logo96.png',
      tag: data.tag || 'vchron-notif',
      data: { url: data.url || '/app/dashboard' },
      vibrate: [100, 50, 100],
      requireInteraction: data.requireInteraction || false,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/app/dashboard';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(targetUrl) && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'REGISTER_SYNC') self.registration.sync?.register(SYNC_TAG).catch(() => {});
});
