// Health-Sync AI Service Worker
// Enables offline functionality and app caching

const CACHE_NAME = 'healthsync-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './Styles.css',
  './manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Don't cache API calls
  if (event.request.url.includes('openfoodfacts.org')) {
    return event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response(
            JSON.stringify({ error: 'Offline - cached data not available' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
  }

  // Cache first, then network for everything else
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(error => {
        console.log('Fetch failed:', error);
        // Return offline page or cached response
        return caches.match(event.request);
      });
    })
  );
});

// Background sync (future feature)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-health-data') {
    event.waitUntil(
      // Sync data when back online
      Promise.resolve()
    );
  }
});

console.log('Service Worker registered');
