$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
        // 后台渲染列表
    function initArtCateList() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function(res) {
                var htmlstr = template('tpl_table', res)
                $('tbody').html(htmlstr)
            }
        });
    }
    // 为1.添加类别注册点击事件

    var indexAdd = null
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '200px'],
                title: '添加文章分类',
                content: $('#dialog_add').html() //这里content是一个普通的String
            });
        })
        // 1.1通过代理，为form——add绑定代理事件
    $('body').on('submit', "#form_add", function(e) {
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('添加失败')
                    // 成功的话渲染到页面
                initArtCateList()
                layer.msg('添加成功')
                layer.close(indexAdd) //根据索引关闭
            }
        });
    })


    // 2.通过代理，为btn_edit绑定代理事件，编辑弹出层
    var indexEdit = null
    $('tbody').on('click', '.btn_edit', function(e) {
            e.preventDefault();
            var indexEdit = layer.open({
                type: 1,
                area: ['500px', '200px'],
                title: '编辑文章',
                content: $('#dialog_edit').html() //这里content是一个普通的String
            });
            // 为修改文章分类的弹出层填充表单数据
            var id = $(this).attr('data-id')
            console.log(id);
            $.ajax({
                type: "get",
                url: "/my/article/cates/" + id,
                success: function(res) {
                    console.log(res);
                    console.log(res.data);
                    // 成功之后为表单赋值res.data
                    form.val('form_edit', res.data)
                }
            })
        })
        //2.1 通过代理为表单代理提交更新文章分类数据，
    $('body').on('submit', '#form_edit', function(e) {
        e.preventDefault();
        console.log($(this).serialize());
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg('更新文章失败')
                layer.msg('更新文章成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        });

    });
    // 3.代理删除表单
    $('tbody').on('click', '.btn_delete', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-id')
        console.log(id);
        $.ajax({
            type: "GET",
            url: "/my/article/deletecate/" + id,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg('删除失败')
                layer.msg('删除成功')
                initArtCateList()
            }
        });
    })
})