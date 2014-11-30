
module.exports=function(root){
    return {
        //数据库连接
        mysql:{
             user:''
            ,password:''
            ,dbName:'mkoa'
            ,prefix:'mkoa_'
            ,port:3306
        },
        //系统目录
        models:root+'/models',
        views:root+'/views',
        controller:root+'/controller',
        lib:root+'/lib',
        static:root+'/static',
        upload:root+'/static/upload',//上传文件夹
        maxFieldsSize:'2mb',//最大上传文件
        fileType:['jpg','png','gif'],
        //cookie session
        csrf:true,
        useUPYun:false,
        UPYun:{
            buckname: '',
             username: '',
             password: ''
        },
        maxAge: 30 * 60 * 1000,
        secret:'*&$^*&(*&$%@#@#$@!#$@%((()*()^#$%$#%@#$%@#$%$#',//session Key
        //端口设置
        port:3000,
        logger:true,
        //执行默认模块
        default_mod:['blog','blog','index'],
    }

}