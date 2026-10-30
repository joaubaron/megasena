// Service Workers
// A versão é atualizada automaticamente pelo deploy.yml
const CACHE_VERSION = '30.10.2026-0823'; // O robô vai mudar isso
const CACHE_NAME = `megasena-${CACHE_VERSION}`;
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './logo.png'];

self.addEventListener('install', function(e){
e.waitUntil(caches.open(CACHE_NAME).then(function(c){return c.addAll(ASSETS)}));
self.skipWaiting(); // Força o novo SW a instalar imediatamente
});

self.addEventListener('activate', function(e){
e.waitUntil(caches.keys().then(function(ks){
return Promise.all(
ks.filter(function(k){ return k !== CACHE_NAME; })
.map(function(k){ return caches.delete(k); })
);
}).then(function(){
return self.clients.claim(); // Força o novo SW a assumir o controle das abas abertas
}));
});

self.addEventListener('fetch', function(e){
if (e.request.method !== 'GET') return;
if (new URL(e.request.url).origin !== location.origin) return;

// ESTRATÉGIA NETWORK FIRST: Tenta a rede, se falhar (offline) usa o cache.
e.respondWith(
fetch(e.request, {cache: 'no-cache'})
.then(function(response){
// Se a resposta for boa, salva no cache para uso offline futuro
if (response && response.status === 200) {
var responseClone = response.clone();
caches.open(CACHE_NAME).then(function(cache){
cache.put(e.request, responseClone);
});
}
return response;
})
.catch(function(){
return caches.match(e.request, {ignoreSearch: true});
})
);
});
