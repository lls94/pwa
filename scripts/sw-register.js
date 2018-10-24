function swRegister() {
    // console.log('sw注册！');
    // serviceWorker  注册事件
    try {
        navigator.serviceWorker.register("./sw.js?v=0", {
            scope: "./"
        }).then(function (SWRegistration) {
            // reg：Service Worker 服务注册对象
            globalSwReg = SWRegistration;
            if (checkIsSubscribed.bind(SWRegistration)()) {
                console.log("订阅");
            } else {
                console.log("未订阅");
            }
            SWRegistration.update();
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
    }
});
