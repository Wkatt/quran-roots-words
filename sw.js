// ===== مستكشف القرآن العظيم — Service Worker =====
// غيّر هذا الرقم مع كل deploy جديد لإجبار التحديث
const CACHE_VERSION = 'quran-v3';

const STATIC_ASSETS = [
  '/', '/index.html', '/browse.html', '/roots.html', '/fields.html',
  '/stats.html', '/stats-roots.html', '/stats-words.html',
  '/offline.html', '/manifest.json',
  '/icons/icon-192.png', '/icons/icon-512.png'
];

self.addEventListener('install', function(e) {
  self.skipWaiting(); // تولَّ السيطرة فوراً بدون انتظار
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function(c) {
      return c.addAll(STATIC_ASSETS).catch(function() {
        return c.addAll(['/index.html', '/browse.html']);
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_VERSION; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim(); // تحكّم في كل التبويبات المفتوحة فوراً
    })
  );
});

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  // خارجي (CDN, fonts, analytics) — network only
  if (url.origin !== self.location.origin) {
    e.respondWith(fetch(e.request).catch(function() { return new Response('', {status:408}); }));
    return;
  }

  // xlsx — network only
  if (url.pathname.endsWith('.xlsx')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // HTML — network first (يضمن أحدث نسخة دائماً)
  if (e.request.headers.get('accept') && e.request.headers.get('accept').includes('text/html')) {
    e.respondWith(
      fetch(e.request).then(function(r) {
        var cl = r.clone();
        caches.open(CACHE_VERSION).then(function(c) { c.put(e.request, cl); });
        return r;
      }).catch(function() {
        return caches.match(e.request).then(function(c) { return c || caches.match('/offline.html'); });
      })
    );
    return;
  }

  // باقي الملفات — cache first
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(r) {
        if (r.ok) { var cl=r.clone(); caches.open(CACHE_VERSION).then(function(c){c.put(e.request,cl);}); }
        return r;
      });
    })
  );
});

self.addEventListener('message', function(e) {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
