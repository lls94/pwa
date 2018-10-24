let version = new Date().getTime();
// new Date().getTime();
let cachesList = [
    'res-cache-v' + version,
    'fanyi-cache-v' + version
];

self.addEventListener("install", function (event) {
    console.log('install');
    self.skipWaiting();
    event.waitUntil(
        event.waitUntil(self.skipWaiting())
    );
});


self.addEventListener("activate", function (event) {
    console.log('activate');
    event.waitUntil(Promise.all([
        self.clients.claim(),
        // 删除缓存  资源
        caches.keys().then(function (cacheList) {
            console.log(25);
            return Promise.all(
                cacheList.map(function (cacheName) {
                    if (cachesList.indexOf(cacheName) == -1 || true) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }),
        // 缓存 网页资源
        caches.open(cachesList[0]).then(function (cache) {
            return cache.addAll([
                './',
                './manifest.json',
                './scripts/app.js?v=' + version,
                './scripts/vconsole.min.js',
                './scripts/zepto.js',
                './scripts/md5.js',
                './style/index.css',
                './images/change.png'
            ])
        })
    ]))
});

// 请求 劫持
self.addEventListener("fetch", function (event) {
    // console.log(event.request, 52);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // 响应已缓存
            if (response) {
                return response;
            };
            // 复制请求
            var request = event.request.clone();
            // 返回请求的响应数据
            return fetch(request).then(function (httpRes) {
                // console.log(httpRes, '响应数据');
                // URL对象
                let requestUrl = new URL(event.request.url);
                // 复制 响应
                let responseClone = httpRes.clone();

                if (requestUrl.href.indexOf("api.fanyi.baidu.com/api/trans/vip/translate") != -1) {
                    // 如果 请求 的 是 百度翻译的 接口
                    caches.open(cachesList[1]).then(function (cache) {
                        // 缓存 百度 翻译接口 响应数据
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

// 推送监听 事件
self.addEventListener('push', function (event) {
    console.log('推送已收到！');
    console.log(`推送数据：\n${event.data.text()}`);

    const title = '推送标题';
    const options = {
        body: '推送body',
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// 推送消息 点击 事件
self.addEventListener('notificationclick', function (event) {
    console.log('通知点击');
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://lavas.baidu.com/')
    );
});