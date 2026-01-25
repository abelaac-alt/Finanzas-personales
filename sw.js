// Nombre de la caché
const CACHE_NAME = 'grupomds-v1';

// Archivos básicos para guardar en memoria del móvil
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché para uso offline');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones para que la app cargue rápido
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo en caché si existe, sino lo descarga
        return response || fetch(event.request);
      })
  );
});
