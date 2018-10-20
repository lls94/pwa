'v1';
self.addEventListener("install", function (event) {
    event.waitUntil(
        event.waitUntil(self.skipWaiting())
    );
});

let cachesList = [
    'res-cache-v1',
    'fanyi-cache-v1'
];

self.addEventListener("activate", function (event) {
    event.waitUntil(Promise.all([
        self.clients.claim(),
        caches.keys().then(function (cacheList) {
            return Promise.all(
                cacheList.map(function (cacheName) {
                    if (cachesList.indexOf(cacheName) == -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }),
        caches.open(cachesList[0]).then(function (cache) {
            console.log(4);
            return cache.addAll([
                './',
                './manifest.json',
                './scripts/app.js',
                './scripts/zepto.js',
                './scripts/md5.js',
                './style/index.css',
                './images/change.png'
            ])
        })
    ]))
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {

            if (response) {
                return response;
            };

            var request = event.request.clone();

            return fetch(request).then(function (httpRes) {

                let requestUrl = new URL(event.request.url);
                let responseClone = httpRes.clone();

                if (requestUrl.href.indexOf("api.fanyi.baidu.com/api/trans/vip/translate") != -1) {
                    console.log(34);
                    caches.open(cachesList[1]).then(function (cache) {
                        cache.put(event.request, responseClone);
                    });
                } else if (!httpRes || httpRes.status !== 200) {
                    return httpRes;
                }

                return httpRes;
            })
        })
    )
});

self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'Push Codelab';
    const options = {
        body: 'Yay it works.',
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});



self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://developers.google.com/web/')
    );
});
