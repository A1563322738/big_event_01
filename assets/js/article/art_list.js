$(function() {
    // 定义时间补零的函数
    var laypage = layui.laypage
    var form = layui.form
    var layer = layui.layer
    var q = {
        pagenum: 1, //页码值,起始位1
        pagesize: 2, //每页显示几条
        cate_id: '', // 文章分类的id
        state: '' //文章的发布状态
    }

    function padZero(n) {
        return n < 10 ? "0" + n : n
    }
    // var now = new Date()
    // console.log(now);
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var nn = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + nn
    }
    initTable()
        // 1.初始化后台获取渲染筛选界面
    function initTable() {
        $.ajax({
            type: "get",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取信息失败')
                console.log(res);
                pageRender(res.total)
                var htmlstr = template('tpl_table', res)
                console.log(htmlstr);
                $('tbody').html(htmlstr)

            }
        });
    }

    initCate()

    // 初始化文章分类的方法
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
    // 2.表单提交，筛选提交
    $('#form_search').on('submit', function(e) {
            e.preventDefault()
            var cate_id = $('[name= cate_id]').val();
            var state = $('[name=state]').val();
            q.cate_id = cate_id;
            q.state = state;
            initTable();
        })
        // 3.分页

    function pageRender(total) {
        laypage.render({
            elem: 'pageBox',
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                    //首次不执行
                if (!first) {
                    initTable()
                }
            }
        });
    }
    // 4.删除文章
    $('tbody').on('click', '.btn_delete', function() {
            console.log(111);
            var id = $(this).attr('data-id');
            var len = $('.btn_delete').length
                // 询问是否删除
            layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    type: "get",
                    url: "/my/article/delete/" + id,
                    success: function(res) {
                        console.log(res);
                        if (res.status !== 0) {
                            return layer.msg('删除文章失败！')
                        }
                        layer.msg('删除文章成功！')
                        if (len === 1) {
                            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                            // 页码值最小必须是 1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }

                        initTable()
                    }
                });
                layer.close(index)
            })

        })
        // 编辑文章

    $('tbody').on('click', '.btn_edit', function() {
            var id = $(this).attr('data-id')
            location.href = '/article/art_pub.html'
            console.log(id);
            // 根据id获得文章分类
            $.ajax({
                type: "get",
                url: "/my/article/" + id,
                success: function(res) {
                    console.log(res);
                    form.val('form_edit', res.data) //不对，不会做
                }
            });
        })
        // 编辑代理form提交

})