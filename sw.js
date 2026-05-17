// sw.js — AUTh Library Map Service Worker
const SW_VERSION = 'v1';
const STATIC_CACHE = `auth-library-static-${SW_VERSION}`;
const IMAGE_CACHE  = `auth-library-images-${SW_VERSION}`;

// Assets to precache on install (shell)
const PRECACHE = [
  './map.html',
];

// ── Install: precache shell ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: delete old caches ──────────────────────────────────────────────
self.addEventListener('activate', event => {
  const keep = [STATIC_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !keep.includes(k)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: routing strategy ──────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Images → Cache First (they're large and stable)
  if (request.destination === 'image' || /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(IMAGE_CACHE, request));
    return;
  }

  // HTML, JS, CSS → Stale While Revalidate (serve fast, update in background)
  if (/\.(html|js|css)$/i.test(url.pathname) || url.pathname.endsWith('/')) {
    event.respondWith(staleWhileRevalidate(STATIC_CACHE, request));
    return;
  }
});

// ── Strategies ───────────────────────────────────────────────────────────────
async function cacheFirst(cacheName, request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    // Offline and not cached — nothing we can do
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(cacheName, request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || fetchPromise;
}
