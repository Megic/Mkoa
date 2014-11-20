
module.exports=function(root){
    return {
        //数据库连接
        mongo:'mongodb://acount:pwd@url:27017/db',
        //系统目录
        model:root+'/model',
        views:root+'/views',
        controller:root+'/controller',
        lib:root+'/lib',
        static:root+'/static',
        //cookie session
        maxAge: 259200000,
        secret:'*&$^*&(*&$%@#@#$@!#$@%((()*()^#$%$#%@#$%@#$%$#',
        //端口设置
        port:3388,
        //执行默认模块
        default_mod:['blog','blog','index'],
    }

}