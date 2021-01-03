$(function() {
    // 1.登陆名字校验
    var form = layui.form
    var layer = layui.layer
    form.verify({
            nickname: function(value) {
                if (value.length > 6) return '昵称长度必须在1-6字符之间'
            }
        })
        //2. 初始化用户的基本信息
    innitUserInfo()
        //2.1 更新用户的基本信息
    function innitUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg('获取用户信息失败')
                form.val('formUserInfo', res.data)
            }
        });
    }

    // 实现表单的重置效果
    $('#btnReset').on('submit', function(e) {
            e.preventDefault()
            innitUserInfo();
        })
        //3.阻止表单的默认提交行为，并发起数据请求
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('获取用户信息失败')
                layer.msg('更新用户信息成功!')
                    // 调用父页面的方法使用window.parent
                window.parent.getUserInfo()
            }
        });
    })
})