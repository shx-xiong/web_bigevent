$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    //定义查询参数对象
    var q = {
        pagenum: 1,  // 页码值
        pagesize: 2, //  每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: ''    //文章的状态，可选值有：已发布、草稿
    }

    //定义时间过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    //初始化文章列表
    initTable()
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类
    initCate()
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //筛选文章
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })

    //渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //删除文章
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var Id = $(this).data('id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    if (len === 1 && q.pagenum > 1) {
                        q.pagenum--
                    }
                    initTable()
                    layer.msg(res.message)
                }
            })
            layer.close(index);
        })
    })
})