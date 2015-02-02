
module.exports=function(root){
    return {
        //数据库连接
        mysql:{
             user:'mkoa'
            ,password:'x'
            ,dbName:'mkoa'
            ,prefix:'mkoa_'
            ,host:'x'
        },
        memcached:{
            host:'x'
            ,port:'11211'
            ,username:'x'
            ,password:'x'
        },
        //系统目录
        sms:'x',
        models:root+'/models',
        views:root+'/views',
        controller:root+'/controller',
        static:root+'/static',
        upload:root+'/static/upload',//上传文件夹
        fileType:['jpg','png','gif'],
        maxFieldsSize:'2mb',//最大上传文件
        formLimit:300,//post最大长度
        useUPYun:true,
        UPYun:{
             buckname: 'x'
             ,username: 'x'
             ,password: 'x'
        },
        host:{//服务器地址
            1:'x'//本地存储
            ,2:'x'//又拍云远程
        },
        sessionType:2,//1mysql 2 memcached
        csrf:false,//是否开启csrf验证
        port:80,    //端口设置
        logger:true,    //输出调试内容
 
    }

}