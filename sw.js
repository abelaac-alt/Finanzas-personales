const CACHE_NAME = 'mds-v15';

// Añade aquí TODOS los archivos que tu app necesita para funcionar sin internet
const assets = [
    './',             // Importante: cachea la raíz
    './index.html', 
    './manifest.json',
    './icon-192.png', // Añade tus iconos
    './icon-512.png'
];

// Evento Install: Descarga y guarda los archivos en caché
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(assets))
            .then(() => self.skipWaiting()) // Obliga al SW a tomar el control inmediatamente
    );
});

// Evento Activate: Limpia las cachés de versiones anteriores (ej. mds-v14)
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // Asegura que el SW controle las páginas abiertas inmediatamente
    return self.clients.claim(); 
});

// Evento Fetch: Intercepta las peticiones. Si está en caché lo sirve, si no, va a internet
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(res => res || fetch(e.request))
            .catch(() => {
                // Opcional: Aquí podrías devolver una página de "Offline" si falla la red
                console.log('Fallo al obtener el recurso y no está en caché');
            })
    );
});
