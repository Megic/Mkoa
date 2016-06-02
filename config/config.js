
module.exports=function(root){
    return {
        V :'1.0',//版本
        //数据库连接
        //sqlType:1,//ORM框架数据库 1 mysql  2 pgsql
        //sessionType:3,//1pgsql  2memcached 3 mysql 4 redis
        //mysql:{
        //    username:'root'
        //    ,password:'root'
        //    ,dbName:'mkoa'
        //    ,prefix:'mkoa_'
        //    ,host:'localhost'
        //},
        sqlType:2,//ORM框架数据库 1 mysql  2 pgsql
        sessionType:2,//1 mysql 2pgsql  3 memcached  4 redis
        pgsql:{
             username:'postgres'
            ,password:'root'
            ,dbName:'Mkoa'
            ,prefix:'mkoa_'
            ,host:'localhost'
            ,port:5432
        },
        //memcached:{
        //     host:'x'
        //    ,port:'11211'
        //    ,username:'x'
        //    ,password:'x'
        //},
        //redis:{
        //    host:'127.0.0.1',
        //    port:6379,
        //    socket:'',
        //    db:'',
        //    pass:'e6c925a8eeb04856:ADmegic2015'
        //},
        //系统目录
        fileType:['gif','jpg','png'],//允许上传文件的类型
        host:'http://localhost/',//访问域名，模板使用
        openSocket:true,//是否开启socket.io
        openRewrite:true,
        port:80,    //端口设置
        logger:true,   //输出调试内容
        loggerType:1,//1：console 2file
        controllerCache:1,//是否关闭控制器缓存，方便开发,正式环境设为0
        //执行默认模块
        defaultPath:"index.html"//默认访问路径
    }

};