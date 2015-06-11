
module.exports=function(root){
    return {
        //数据库连接
        pgsql:{
             username:'postgres'
            ,password:'root'
            ,dbName:'Mkoa'
            ,prefix:'mkoa_'
            ,host:'localhost'
        },
        memcached:{
            host:'x'
            ,port:'11211'
            ,username:'x'
            ,password:'x'
        },
        //系统目录
        sms:'x',
        models:'models',
        views: 'views',//模板文件夹名
        application:'Application',//模块文件夹
        controller:'controller',//控制器文件夹
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
        sessionType:1,//1pgsql 2 memcached
        csrf:false,//是否开启csrf验证
        port:3000,    //端口设置
        logger:true,    //输出调试内容
 
    }

}