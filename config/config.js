
module.exports=function(root){
    return {
        //数据库连接
        mysql:{
             user:'root'
            ,password:''
            ,dbName:'mkoa'
            ,prefix:'mkoa_'
        },
        //系统目录
        models:root+'/models',
        views:root+'/views',
        controller:root+'/controller',
        static:root+'/static',
        csrf:true,//是否开启csrf验证
        //端口设置
        port:3000,
        logger:true,
        //执行默认模块
        default_mod:['blog','blog','index'],
    }

}