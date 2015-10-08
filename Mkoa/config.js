module.exports = function (root) {
    return {
        //系统目录
        sqlType:1,//ORM框架数据库 1 mysql  2 pgsql
        mysql:{
            user:''
            ,password:''
            ,dbName:''
            ,prefix:''
            ,host:'localhost'
        },
        models:'models',//模型文件夹名
        views: 'views',//模板文件夹名
        application:'Application',//模块文件夹
        controller:'controller',//控制器文件夹名
        lib: root + '/lib',
        static:'static',
        staticpath: root + '/static/',
        cachepath:root + '/cache',
        iscache:false,//缓存全局设置
        cahceTime:1000*60*60*24,//全局缓存时间-天
        upload: root + '/static/upload',//上传文件夹
        maxFieldsSize: 200*1024,//最大上传文件
        formLimit: 300,//post最大长度
        fileType: ['jpg', 'png', 'gif'],//上传文件类型
        authUpload:false,//是否登录后才能上传文件
        openSocket:false,//是否开启socket.io
        //cookie session
        csrf: true,
        adminName:'ADmegic',//超级管理员名称
        useUPYun: false,
        UPYun: {
            buckname: '',
            username: '',
            password: ''
        },
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secret: '*&$^*&(*&$%@#@#$@!#$@%((()*()^#$%$#%@#$%@#$%$#',//session Key
        sessionType: 1,//1 pgsql 2 memcached
        //端口设置
        port: 3000,
        logger: true,
        //执行默认模块
        defaultPath:""//默认访问路径
    }

};