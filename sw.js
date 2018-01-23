---
---

const version = '{{site.time | date: '%Y%m%d%H%M%S'}}';
const cacheName = `cache-v${version}`;

const cacheFiles = [
  '{{ "/css/main.css" | prepend: site.baseurl }}',
  '{{ "/js/index.js" | prepend: site.baseurl }}',
  '/offline/'
];

self.addEventListener('install', (event) => {
    console.info('Event: Install');

    event.waitUntil(
      caches.open(cacheName)
      .then((cache) => {
        //[] of files to cache & if any of the file not present `addAll` will fail
        return cache.addAll(cacheFiles)
        .then(() => {
          console.info('All files are cached');
          return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
        })
        .catch((error) =>  {
          console.error('Failed to cache', error);
        })
      })
    );
  });
