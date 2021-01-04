// function getUserInfo() {
//     $.ajax({
//         type: "GET",
//         url: "/my/userinfo",
//         // 请求头就是请求头配置对象
//         success: function(res) {
//             console.log(res);
//             if (res.status !== 0) return layui.layer.msg('获取用户信息失败')
//             renderAvatar(res.data)
//         },
//     });
// }
// // 渲染用户的头像
// function renderAvatar(user) {
//     //1.获取用户的昵称
//     var name = user.nickname || user.username;
//     $('#welcome').html('欢迎  ' + name)
//         //3.按需渲染用户的头像  图片头像还是文本头像
//     if (user.user_pic !== null) {
//         // 图片头像
//         $('.layui-nav-img').attr('src', user.user_pic).show();
//         $('.text-avatar').hide();
//     } else {
//         // 渲染文本头像
//         $('.layui-nav-img').hide();
//         var first = name[0].toUpperCase();
//         $('.text-avatar').html(first).show()
//     }
// }
// // 入口函数
// $(function() {
//     getUserInfo();
//     var layer = layui.layer;
//     $('#btnLogout').on('click', function() {
//         layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
//             localStorage.removeItem('token');
//             location.href = '/login.html'
//                 //关闭提示框
//             layer.close(index);
//         });
//     })
// })
// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) return layui.layer.msg('获取信息失败')
            renderAvatar(res.data)
        }
    });
}
// 渲染头像
function renderAvatar(user) {
    var name = user.nickname || user.nickname;
    $('#welcome').html('欢迎  ' + name);
    // console.log(user.user_pic);
    if (user.user_pic !== null) {
        // 如果地址不为空,就成图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 如果为空，就是文本图片
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}
$(function() {
    getUserInfo()
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function(index) {
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        })

    })
})