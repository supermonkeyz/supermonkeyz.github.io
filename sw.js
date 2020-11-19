importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');
// var workboxSW = new WorkboxSW();
if (workbox) {
  console.log('Workbox is loaded 👌🏼');
  workbox.precaching.precacheAndRoute([]);

  workbox.routing.registerRoute(
    /.*\.(?:js|css)/,
    workbox.strategies.cacheFirst({
      cacheName: 'static-cache-1605757616',
    })
  );

  workbox.routing.registerRoute(
    /.*\.(?:png|gif|jpg)/,
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
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