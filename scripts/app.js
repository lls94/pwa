// var vConsole = new VConsole();
const PublicKey = 'BEvGz7_mk3I53v_hKzRwYorCKPpzvi1ZvFhnQ3TEHIemI65nzQMVghMCPI3-63V_arOQ_fdRiTWvBFrdNvEsJGY';
let pushStatus = (Notification && Notification.permission) || 'denied';
console.log(pushStatus)
let to = "zh";

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

function transJsonp() { // 百度翻译接口
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
        url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
        data: {
            appid: appid,
            salt: salt,
            sign: MD5(appid + query + salt + key),
            q: query,
            from: "auto",
            to: to
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
    // 百度翻译接口
};

function init() {

    $(".status").text({
        default: '询问',
        granted: '允许',
        denied: '禁止'
    } [Notification.permission]);

    $(".input>textarea").blur(function () { // 失焦翻译文字
        transJsonp.bind(this)();
    });

    $(".change").click(function () {
        to = {
            true: 'en',
            false: 'zh'
        } [to == 'zh'];
        console.log(to, 77);
        let lang = {
            zh: '中文',
            en: '英语'
        };
        $('.from').text($('.to').text());
        $('.to').text(lang[to]);
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





function notifyMe() {
    // 订阅 推送服务
    if (!'PushManager' in window) {
        alert("浏览器不支持推送服务！");
        return false;
    }
    try {
        globalSwReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(PublicKey)
        }).then(function (PushSubscription) {
            if (pushStatus != 'granted' && Notification.permission == 'granted') {
                new Notification('推送服务订阅成功！');
            }
            console.log(JSON.stringify(PushSubscription), '订阅推送配置数据');
            isSubscribed = true;
        }).catch(function (err) {
            new Notification('推送服务订阅失败！');
            console.log('获取订阅服务失败', err);
        });
    } catch (error) {
        console.log(error, 116)
    }
    return;
};

function cancel() {
    globalSwReg.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                new Notification('取消订阅成功');
                return subscription.unsubscribe();
            }
        })
        .catch(function (error) {
            console.log('取消失败', error);
        })
};


$("<script>").attr({
    src: './scripts/sw-register.js?v=' + (new Date().getTime())
}).appendTo($("body"));

$(() => {
    init();
})