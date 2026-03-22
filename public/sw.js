/* VChron Service Worker v3 — PWA with offline support */
const CACHE_VERSION = 'vchron-v3';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const OFFLINE_URL = '/app/offline';

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/app/offline',
];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Never intercept API calls — always network
  if (
    url.hostname === 'api.vcron.cloud' ||
    url.pathname.startsWith('/api/')
  ) return;

  // 2. Skip non-GET, non-http(s), and browser-extension requests
  if (
    request.method !== 'GET' ||
    !request.url.startsWith('http')
  ) return;

  // 3. HTML navigation requests — network first, offline fallback
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
          // Serve /index.html for all app routes (SPA fallback)
          const indexCached = await caches.match('/index.html');
          return indexCached || new Response('<h1>Offline</h1>', {
            headers: { 'Content-Type': 'text/html' },
          });
        })
    );
    return;
  }

  // 4. JS/CSS/font assets — cache first (they're content-hashed by Vite)
  if (
    url.pathname.startsWith('/assets/') ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
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

  // 5. Images — cache first, network fallback
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

  // 6. Everything else — network first, cache fallback
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

// ─── Background Sync ──────────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-attendance') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({ type: 'SYNC_ATTENDANCE' })
        );
      })
    );
  }
});

// ─── Push Notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'VChron', {
      body: data.body || 'You have a new notification',
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: data.tag || 'vchron-notif',
      data: { url: data.url || '/app/dashboard' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data?.url || '/app/dashboard')
  );
});
