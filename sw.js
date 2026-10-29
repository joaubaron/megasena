var CACHE = 'megasena-v5';
var ARQ = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ARQ)}));
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k !== CACHE}).map(function(k){return caches.delete(k)}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then(function(r){return r || fetch(e.request)}));
});
