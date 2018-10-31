// let v = 5;

function swRegister(v = '') {
    // serviceWorker  注册事件
    try {
        // sw.js 可能会因为浏览器 缓存 得不到更新，可以增加个 版本号
        navigator.serviceWorker.register("./sw.js" + v, {
            scope: "./"
        }).then(function (SWRegistration) {
            console.log(SWRegistration, 11);
            $("button").eq(2).click(() => {
                SWRegistration.update(); //24小时 至少会更新一次   https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorkerRegistration/update
            });

            // reg：Service Worker 服务注册对象
            globalSwReg = SWRegistration;
            if (checkIsSubscribed.bind(SWRegistration)()) {
                console.log("订阅");
            } else {
                console.log("未订阅");
            }
            console.log("注册成功！");
        }).catch(function () {
            console.log("注册失败！");
        })
    } catch (error) {
        console.log(error);
    }
};

$(() => { // 注册 serviceWorker
    if ("serviceWorker" in navigator) {
        swRegister();
        return;
        $("button").eq(3).click(() => {
            let v;
            v = "?v=" + new Date().getTime();
            swRegister(v);
        });
    }
});