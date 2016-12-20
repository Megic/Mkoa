module.exports = {
    V :'1.0',//版本
    SV:0,//引用版本号，用于刷新ajax缓存，空或者0会生成当前时间戳
    models:'models',//模型文件夹名
    views: 'views',//模板文件夹名
    langs:'langs',//语言文件夹名称
    middleware:'middleware',//中间件文件夹名称
    application:'application',//模块文件夹
    controller:'controller'//控制器文件夹名
    ,delcontrollerCache:0 //是否清空控制器requireh缓存,开发环境开启修改conttoller文件后可以不用重启服务
};