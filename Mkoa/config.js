module.exports = function (root) {
    return {
        //系统目录
        sqlType:1,//ORM框架数据库 1 mysql  2 pgsql
        sessionType:1,//1 mysql 2pgsql  3 memcached  4 redis
        mysql:{
            user:''
            ,password:''
            ,dbName:''
            ,prefix:''
            ,host:'localhost'
        },
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
        formLimit: 300,//post最大长度
        fileType: ['jpg', 'png', 'gif'],//上传文件类型
        openSocket:false,//是否开启socket.io
        //cookie session
        csrf: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secret: '*&$^*&(*&$%@#@#$@!#$@%((()*()^#$%$#%@#$%@#$%$#',//session Key
        //端口设置
        port: 3000,
        logger: true,
        loggerType:1,//1：default 2 config
        logerConfig:{
           file: root + '/cache/log/file.log'
            //,size:''
        },
        openRewrite:false,//是否开启rewrite
        cookie_locale: "mkoa_locale",//存放语言的 cookie 名称
        defaultLang: "zh-cn", //默认语言
        defaultTPL: "ejs", //默认模板
        ROOT:root,//物理根目录
        //执行默认模块
        defaultPath:""//默认访问路径
    }

};