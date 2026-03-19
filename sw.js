/* Minimal offline cache for Aoki Portfolio */
const CACHE = 'aoki-portfolio-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/css/base.css',
  '/assets/css/main.css',
  '/assets/css/style.css',
  '/assets/js/site-data.js',
  '/assets/js/incparts.js',
  '/assets/js/common.js',
  '/assets/js/main-page.js',
  '/assets/js/portfolio-rebuild.js',
  '/assets/img/logo-256.png',
  '/assets/img/logo-512.png',
  '/assets/img/hero-bg.jpg',
  '/assets/img/ogp.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // Only cache GET same-origin requests
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => hit))
  );
});
