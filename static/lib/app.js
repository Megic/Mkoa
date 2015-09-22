/**
 * Created by megic on 2015-06-16.
 */
avalon.library("mkoa", {
    $ready: function () {
        avalon.log("mkoa框架加载完成")
    }
});

var $HOST='http://'+window.location.host+'/';
var app=avalon.define({
    $id:'app',
    $v:'1.0',//版本用于全局刷新
    $host:$HOST,
    $lib:$HOST+'js/',//公共插件库地址
    //islogin:'#',
    closeMenu:0,//左侧菜单开关
    module:[],//模块对象存放
    $cache:[]//系统缓存对象
});



require.config({//编辑器加载配置
    paths: {
        layer:app.$lib+'layer/layer',
        kindeditor: "../editor/kindeditor-all-min.js"
        ,kindezh: "../editor/lang/zh-CN.js"//语言包
        ,jquery: "../jquery-1.11.3.min.js"//语言包
        ,masonry: "../jquery.masonry.js"//语言包
        ,Mfocus:'../Mfocus.min.js'
        ,highcharts:"../highcharts/highcharts.js"
        ,exporting:"../highcharts/modules/exporting.js"
    },
    shim: {
        jquery: {
            exports: "$"
        },
        Mfocus: ['jquery'],//指定它的依赖项
        masonry: ['jquery'],//指定它的依赖项
        highcharts: ['jquery'],//指定它的依赖项
        exporting: ['jquery'],//指定它的依赖项
        kindeditor: {
            exports: "KindEditor"
        },
        kindezh: {
            exports: "KindEditor"
        }
    }
});