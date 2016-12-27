module.exports=function(root){
    return {
        V: '1.0',//版本
        SV: 0//引用版本号，用于刷新ajax缓存，空或者0会生成当前时间戳
        ,delcontrollerCache: 0 //是否清空控制器requireh缓存,开发环境开启修改conttoller文件后可以不用重启服务
        ,defaultLang: "zh-cn" //默认语言
        ,proxy: false//如果用nginx代理，设置为true
        ,host:''//访问域名一般不需要配置
        ,defaultPath:""//默认访问路径
        ,port: 3000 //监听端口
        ,body_config:{formLimit:'1mb',jsonLimit:'1mb'}
        ,session_open:false
        ,session_store:'default'//session数据源 datasources.js文件定义数据源
        ,session_config:{
            key: 'Mkoa:sid',
            prefix: 'Mkoa:sess:',
            rolling: false,
            cookie: {
                maxage:30 * 24 * 60 * 60 * 1000
            }
        }
        ,logger_open:true
        ,loger_config:false
        // ,loger_config:{
        //     file: root + '/cache/log/file.log'
        //     //,size:''
        // }
        ,rewrite_open:false
        ,static_open:true
        ,lang_open:true
        ,lang_default:'zh-cn'
        ,lang_cookie: "mkoa_locale"//存放语言的 cookie 名称
        ,view_open:true
        ,view_engine:'ejs'//视图解析
        ,view_ext:'html'//视图文件后缀
    }
};