module.exports = function (root) {
    return {
        //系统目录
        V :'1.0',//版本
        SV:0,//引用版本号，用于刷新ajax缓存，空或者0会生成当前时间戳
        models:'models',//模型文件夹名
        views: 'views',//模板文件夹名
        langs:'langs',//语言文件夹名称
        middleware:'middleware',//中间件文件夹名称
        application:'Application',//模块文件夹
        controller:'controller',//控制器文件夹名
        lib: root + '/lib',
        staticName:'static',
        staticpath: root + '/static/',
        cachepath:root + '/cache',
        socketConfig:root + '/config/socket',//socket配置文件路径
        iscache:false,//缓存全局设置
        cahceTime:1000*60*60*24,//全局缓存时间-天
        upload: root + '/static/upload',//上传文件夹
        uploadDir:root + '/cache/tmp/',//上传文件临时文件夹
        maxFieldsSize: 200*1024,//最大上传文件
        formLimit: 3000,//post最大长度
        fileType: ['jpg', 'png', 'gif'],//上传文件类型
        openSocket:false,//是否开启socket.io
        proxy:false,//如果用nginx代理，设置为true
        csrf: false,
        syncModel:false,//是否同步模型到数据库,开发时可以开启，开启后，如果数据表不存在，返回错误并自动建表
        //数据库ORM链接配置 default为$D函数默认链接数据
        ormStore:{
            // 'default':{//默认
            //      username:''
            //     ,password:''
            //     ,database:''
            //     ,option:{
            //          dialect:'postgres' //'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
            //         ,host:'localhost'
            //         ,port:5432
            //     }
            // }
        },
        //cookie session
        sessionStore:{
            // type:1 //1 mysql 2pgsql  3 memcached  4 redis
            // ,mysql:{
            //     // user:'',
            //     // password: '',
            //     // database:'',
            //     // host:3306
            // }
            // ,pgsql{},memcached:{},redis:{}
        },
        sessionConfig:{
            key: 'Mkoa:sid',
            prefix: 'Mkoa:sess:',
            rolling: false,
            cookie: {
                maxage:30 * 24 * 60 * 60 * 1000
            }
        },
        secret: '*&$^*&(*&$%@#@#$@!#$@%((()*()^#$%$#%@#$%@#$%$#',//session Key
        host:'',
        //端口设置
        port: 3000,
        logger: true,
        loggerType:1,//1：default 2 lib
        logerConfig:{
            file: root + '/cache/log/file.log'
            //,size:''
        },
        controllerCache:0,//是否清空controllerCache,开发环境开启修改conttoller文件后可以不用重启服务
        openRewrite:false,//是否开启rewrite
        cookie_locale: "mkoa_locale",//存放语言的 cookie 名称
        defaultLang: "zh-cn", //默认语言
        defaultTPL: "ejs", //默认模板
        viewExt:'html',//模板后缀
        ROOT:root,//物理根目录
        //执行默认模块
        defaultPath:""//默认访问路径
    }

};