//开发环境
var baseURl = 'http://ajax.frontend.itheima.net'
//测试环境
//var baseURl = 'http://ajax.frontend.itheima.net'
//生产环境
//var baseURl = 'http://ajax.frontend.itheima.net'
$.ajaxPrefilter(function (options) {
    options.url = baseURl + options.url
})