$(function() {
    //注册账号的连接
    $('#links_reg').on('click', function() {
        $('.login_box').hide();
        $('.reg_box').show();
    })
    $('#links_login').on('click', function() {
            $('.login_box').show();
            $('.reg_box').hide();
        })
        //登陆账号的连接
        //表单校验
    var form = layui.form
    var layer = layui.layer
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            repwd: function(value) {
                //需要获得确认密码的密码，跟密码框的判断是否一致
                var pwd = $('#psd').val()
                if (pwd !== value) return "两次密码需要一致"
            }
        })
        // 注册验证
        // console.log($('#form_reg'));
    $('#form_reg').on('submit', function(e) {
            e.preventDefault();
            var data = {
                username: $('#username').val(),
                password: $('#psd').val()
            }
            $.post("/api/reguser", data,
                function(res) {
                    console.log(data);
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg('注册成功，请登录')
                    $('#form_login').click()
                },
            );
        })
        // 登陆验证
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('登陆失败')
                layer.msg('登陆成功');
                // 把res的字符串永久的保留在浏览器中
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        });
    })
})