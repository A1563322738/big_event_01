//把每一次的地址拼接起来
$.ajaxPrefilter(function(options) {
    // console.log(options);
    //options代表配置对象
    options.url = 'http://ajax.frontend.itheima.net' + options.url
        // console.log(options.url);
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 不管成功还是失败，最终都会调用complete函数
    options.complete = function(res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            //强制清空token   
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})