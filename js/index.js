(function() {
    // 'use strict';

    // window.addEventListener('beforeinstallprompt', function(e) {
    //   outputElement.textContent = 'beforeinstallprompt Event fired';
    // });

    // function registerServiceWorker() {

    //     if (!navigator.serviceWorker) {
    //         return;
    //     }

    //     navigator.serviceWorker.register('/sw.js')
    //         .then(registration => {
    //             console.log('Service Worker: registered');
    //         }).catch(err => {
    //             console.log('Service Worker: registration failed ', err);
    //         });
    // }

    // registerServiceWorker();
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
            console.log(`Service Worker registered! Scope: ${registration.scope}`);
            })
            .catch(err => {
            console.log(`Service Worker registration failed: ${err}`);
            });
      });
    }
})();
