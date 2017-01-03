module.exports=function(root){
    return {
        V: '1.0',//版本
        SV: 0,//引用版本号，用于刷新ajax缓存，空或者0会生成当前时间戳
        ROOT:root,//物理根目录
        models: 'models',//模型文件夹名
        views: 'views',//模板文件夹名
        langs: 'langs',//语言文件夹名称
        middleware: 'middleware',//中间件文件夹名称
        application: 'application',//模块文件夹
        controller: 'controller'//控制器文件夹名
        , logic: 'logic'//logic校验文件夹名
        , delcontrollerCache: 0 //是否清空控制器requireh缓存,开发环境开启修改conttoller文件后可以不用重启服务
        , defaultLang: "zh-cn" //默认语言
        , proxy: false//如果用nginx代理，设置为true
        , keys: ['*&$^*&(*&$%@#@#$@!#$@%((()*()^#$%$#%@#$%@#$%$#', 'sdf454547#123sdf(8&^123369']//cookieskey
        // ,uploadDir:root + '/cache/tmp/'//上传文件临时文件夹
        // ,maxFieldsSize: 200*1024//最大上传文件
        ,port: 3000 //监听端口
        ,host:''//访问域名一般不需要配置
        ,defaultPath:""//默认访问路径
        ,apiProxy_open:false
        ,apiProxy_prefix:{} //API调用配置{servicName:prefix}
        ,apiProxy_proxy:{
            timeout: 15000// 超时配置
        }//proxy 补充配置项
        ,apiProxy_request:{}//request配置项
        ,body_config:{formLimit:'1mb',jsonLimit:'1mb'}
        ,body_strict:true
        ,install_check:false
        ,db_open:false
        ,session_open:false
        ,session_store:'default'//session数据源 datasources.js文件定义数据源
        ,session_store_config:{//session 模型额外配置
            tableName:'Sessions',
            modelName:'Session',
            browserSessionLifetime:60 * 60 * 24 * 14// 2星期
        }//配置模型koa-generic-session-sequelize
        ,session_config:{
            key: 'Mkoa:sid',
            prefix: 'Mkoa:sess:',
            rolling: false,
            cookie: {
                maxage:30 * 24 * 60 * 60 * 1000
            }
        }
        ,cors_open:false
        ,cors_config:{
        //     origin:'',//允许发来请求的域名，对应响应的`Access-Control-Allow-Origin`，
        //     allowMethods:'',//允许的方法，默认'GET,HEAD,PUT,POST,DELETE'，对应`Access-Control-Allow-Methods`，
        //     exposeHeaders:'',//允许客户端从响应头里读取的字段，对应`Access-Control-Expose-Headers`，
        //     allowHeaders:'',//这个字段只会在预请求的时候才会返回给客户端，标示了哪些请求头是可以带过来的，对应`Access-Control-Allow-Headers`，
        //     maxAge:'',//也是在预请求的时候才会返回，标明了这个预请求的响应所返回信息的最长有效期，对应`Access-Control-Max-Age`
        //     credentials:''//标示该响应是合法的，对应`Access-Control-Allow-Credentials`
        }
        ,logger_open:true
        ,loger_config:false
        // ,loger_config:{
        //     file: root + '/file.log'
        //     //,size:''
        // }
        ,jwt_open:false
        ,jwt_key:'shhhmkoa'//加密
        ,jwt_pem:'shhhmkoa'//解密
        ,jwt_sign_options:{}
        ,jwt_verify_options:{}
        ,rewrite_open:false
        ,cache_open:false
        ,cache_store:'cache'
        ,logic_open:false //自动校验数据
        ,static_open:true
        ,static_pathName:'static'
        ,static_config:{maxAge: 365 * 24 * 60 * 60, buffer: true}
        ,lang_open:true
        ,lang_default:'zh-cn'
        ,lang_cookie: "mkoa_locale"//存放语言的 cookie 名称
        ,view_open:true
        ,view_engine:'ejs'//视图解析
        ,view_ext:'html'//视图文件后缀
        ,socket_open:false
        ,socket_config:root + '/config/socket',//socket配置文件路径
    }
};