
module.exports=function(root){
    return {
        //数据库连接
        mysql:{
             user:'root'
            ,password:''
            ,dbName:'Mkoa'
            ,prefix:'M_'
            ,port:3306
        },
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
        port:3000,
        logger:true,
        //执行默认模块
        default_mod:['blog','blog','index'],
    }

}