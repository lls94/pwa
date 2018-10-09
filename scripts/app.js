const publicKey = 'BEvGz7_mk3I53v_hKzRwYorCKPpzvi1ZvFhnQ3TEHIemI65nzQMVghMCPI3-63V_arOQ_fdRiTWvBFrdNvEsJGY';

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}



function swRegister() {
    navigator.serviceWorker.register("./sw.js", {
        scope: "./"
    }).then(function (reg) {
        globalSwReg = reg;
        if (checkIsSubscribed.bind(reg)()) {
            console.log("订阅");
        } else {
            console.log("未订阅");
        }
        reg.update();
        console.log("注册成功！");
    }).catch(function () {
        console.log("注册失败！");
    })
};

function transJsonp() {
    console.log(this, 20);
    let appid = "20181007000216094";
    let key = "TBtPAVPayrgJKdlRH6b_";
    let salt = (new Date).getTime();
    salt = 1;
    let query = $(this).val().trim();
    $.ajax({
        type: 'get',
        cache: true,
        jsonpCallback: "cbFn",
        dataType: 'jsonp',
        url: "http://api.fanyi.baidu.com/api/trans/vip/translate",
        data: {
            appid: appid,
            salt: salt,
            sign: MD5(appid + query + salt + key),
            q: query,
            from: "auto",
            to: "zh"
        },
        success: function (data) {
            try {
                let transResult = data.trans_result[0].dst;
                $(".result>span").html(transResult);
                console.log(transResult);
            } catch (error) {
                console.log("错了！");
                $(".result>span").html('');
            }

        },
        error: function (err) {
            $(".result>span").html('查询失败！');
        }
    });
}

function addEvent() {
    $(".input>textarea").blur(function () {
        transJsonp.bind(this)();
    });


    $("button").click(function () {
        notifyMe();
    })
}

function checkIsSubscribed() {
    globalSwReg.pushManager.getSubscription().then(function (subscription) {
        if (subscription === null) {
            return false;
        } else {
            return true;
        }
    })
}


$(() => {
    if ("serviceWorker" in navigator && 'PushManager' in window) {
        swRegister();
    }
    addEvent();
});




function notifyMe() {
    console.log(103);

    try {
        globalSwReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(publicKey)
        }).then(function (subscription) {
            console.log('User is subscribed:', subscription);
            console.log(JSON.stringify(subscription), 116);
            isSubscribed = true;
        }).catch(function (err) {
            console.log('Failed to subscribe the user: ', err);
        });
    } catch (error) {
        console.log(error, 116)
    }

    console.log(120);

    return;
    // 先检查浏览器是否支持
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // 检查用户是否同意接受通知
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification("Hi there!");
    }

    // 否则我们需要向用户获取权限
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // 如果用户同意，就可以向他们发送通知
            if (permission === "granted") {
                var notification = new Notification("Hi there!");
            }
        });
    }


    // 最后，如果执行到这里，说明用户已经拒绝对相关通知进行授权
    // 出于尊重，我们不应该再打扰他们了
}