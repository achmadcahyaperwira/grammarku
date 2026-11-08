/* Cay's English - service worker untuk mode offline.
 * Naikkan CACHE_VERSION setiap kali file aplikasi atau materi berubah,
 * agar HP mengambil versi baru. Progres tidak terpengaruh (tersimpan di localStorage).
 */
var CACHE_VERSION = 'v1.0.1-u18';
var CACHE = 'cays-english-' + CACHE_VERSION;
var SHELL = [
  './',
  'index.html',
  'style.css',
  'grading.js',
  'app.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'content/index.json',
  'content/placement.json'
];

self.addEventListener('install', function (event) {
  // v1.0.1: langsung aktif supaya folder /v2/ (Cay's English V2) tidak lagi tertahan versi lama.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(SHELL.map(function (u) { return new Request(u, { cache: 'reload' }); })).then(function () {
        return fetch('content/index.json', { cache: 'reload' }).then(function (r) { return r.json(); });
      }).then(function (index) {
        var files = index.units.filter(function (u) { return u.available; }).map(function (u) { return 'content/units/' + u.file; });
        return cache.addAll(files.map(function (u) { return new Request(u, { cache: 'reload' }); }));
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return /^cays-english-/.test(k) && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); }).then(function () {
      // Tab /v2/ yang sempat dilayani versi lama dimuat ulang agar langsung membuka Cay's English V2.
      return self.clients.matchAll({ type: 'window' }).then(function (cs) {
        cs.forEach(function (c) { if (c.url.indexOf('/v2/') !== -1 && c.navigate) c.navigate(c.url); });
      });
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

// Cache dulu, lalu jaringan. Halaman utama selalu dilayani dari cache agar bisa dibuka offline.
self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Aplikasi V2 di folder /v2/ punya service worker sendiri. Jangan dilayani oleh aplikasi lama.
  if (url.pathname.indexOf('/v2/') !== -1) return;
  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      var key = req.mode === 'navigate' ? 'index.html' : req;
      return cache.match(key, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
          return res;
        });
      });
    })
  );
});
