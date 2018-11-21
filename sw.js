// const cacheName = 'cache-v00';

// const cacheFiles = [
//   '/css/main.css',
//   '/js/index.js',
//   '/offline/'
// ];

// self.addEventListener('install', (event) => {
//     console.info('Event: Install');

//     event.waitUntil(
//       caches.open(cacheName)
//       .then((cache) => {
//         //[] of files to cache & if any of the file not present `addAll` will fail
//         return cache.addAll(cacheFiles)
//         .then(() => {
//           console.info('All files are cached');
//           return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
//         })
//         .catch((error) =>  {
//           console.error('Failed to cache', error);
//         })
//       })
//     );
//   });


//   self.addEventListener('fetch', (event) => {
//     console.info('Event: Fetch');

//     var request = event.request;

//     // Always fetch non-GET requests from the network.
//     if (request.method !== 'GET') {
//         event.respondWith(fetch(request));
//         return;
//     }

//     // For HTML requests, try the network first else fall back to the offline page.
//     if (request.headers.get('Accept').indexOf('text/html') !== -1) {
//         event.respondWith(
//             fetch(request).catch(() => caches.match('/offline/'))
//         );
//         return;
//     }

//     //Tell the browser to wait for newtwork request and respond with below
//     event.respondWith(
//       //If request is already in cache, return it
//       caches.match(request).then((response) => {
//         if (response) {
//           return response;
//         }

//         //if request is not cached, add it to cache
//         return fetch(request).then((response) => {
//           var responseToCache = response.clone();
//           caches.open(cacheName).then((cache) => {
//               cache.put(request, responseToCache).catch((err) => {
//                 console.warn(request.url + ': ' + err.message);
//               });
//             });

//           return response;
//         });
//       })
//     );
//   });

//   /*
//     ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
//   */

//   //Adding `activate` event listener
//   self.addEventListener('activate', (event) => {
//     console.info('Event: Activate');

//     //Remove old and unwanted caches
//     event.waitUntil(
//       caches.keys().then((cacheNames) => {
//         return Promise.all(
//           cacheNames.map((cache) => {
//             if (cache !== cacheName) {     //cacheName = 'cache-v1'
//               return caches.delete(cache); //Deleting the cache
//             }
//           })
//         );
//       })
//     );
//   });


importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');
// var workboxSW = new WorkboxSW();
if (workbox) {
  console.log('Workbox is loaded 👌🏼');
  workbox.precaching.precacheAndRoute([]);

  workbox.routing.registerRoute(
    /.*\.(?:js|css)/,
    workbox.strategies.cacheFirst({
      cacheName: 'static-cache-2018-11-21',
    })
  );

  workbox.routing.registerRoute(
    /.*\.(?:png|gif|jpg)/,
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        })
      ]
    })
  );

  const articleHandler = workbox.strategies.networkFirst({
    cacheName: 'articles-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10,
      })
    ]
  });

  workbox.routing.registerRoute(/\.*/, args => {
    return articleHandler.handle(args).then(response => {
      if (!response) {
        return caches.match('/offline.html');
      } else if (response.status === 404) {
        return caches.match('/offline.html');
      }
      return response;
    });
  });
}