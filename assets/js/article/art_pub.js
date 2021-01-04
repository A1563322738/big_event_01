$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
        // 1初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl_cate', res)
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    // 2初始化富文本编辑器
    initEditor()
        // 3.1. 初始化图片裁剪器
    var $image = $('#image')
        // 3.2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3.3. 初始化裁剪区域
    $image.cropper(options)
        // 3.4选择封面，模拟人的点击选择图片的行为
    $('#btnChooseImage').on('click', function() {
            $('#files').click();
        })
        // 3.5监听图片改变的事件，选择
    $('#files').on('change', function(e) {
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 5发布文章
    // 5.1定义文章的发布状态
    var art_state = "已发布"
    $('#art_save').on('click', function() {
        art_state = "草稿"
    })

    // 5.2点击上传按钮,监听form表单submit提交事件   
    $('#form-pub').on('submit', function(e) {
            e.preventDefault();
            var fd = new FormData($(this)[0]) //基于form表单，快速创建一个FormData  dom对象
                //5.3 fd只能通过foreach打印出来
            fd.forEach((v) => {
                console.log(v);
            });
            fd.append('state', art_state)
                // 5.4将封面创建过后的图片，输出为一个文件对象
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    fd.append('cover_img', blob)
                    publishArticle(fd) //调用发布文章
                })
        })
        // 5.5定义发布文章的方法
    function publishArticle(fd) {
        //   发送ajax上传
        $.ajax({
            type: "post",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) return layer.msg('发布文章失败')
                layer.msg('发布文章成功');
                location.href = '/article/art_list..html'
            }
        });
    }
})