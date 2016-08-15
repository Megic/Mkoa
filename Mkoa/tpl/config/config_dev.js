
module.exports=function(root){
    return {
        V :'1.0',//版本
        // $common:{//模块相关常用修改配置建议以$开头，避免冲突
        //   key:'sdf'
        // },
        prefix:'mkoa_',//数据表前缀
        ormStore:{//orm数据库配置,default为默认链接配置
            // 'default':{//默认
            //     username:'postgres'
            //     ,password:'root'
            //     ,database:'Mkoa'
            //     ,option:{
            //         dialect:'postgres' //'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
            //         ,host:'localhost'
            //         ,port:5432
            //     }
            // }
        },
        //cookie session配置
        sessionStore:{
            // type:2 //1 mysql 2pgsql  3 memcached  4 redis
            // ,pgsql:{
            //     username:'postgres'
            //     ,password:'root'
            //     ,database:'Mkoa'
            //     ,host:'localhost'
            //     ,port:5432
            // }
        },
        proxy:false,//如果用nginx代理，设置为true
        fileType:['gif','jpg','png'],//允许上传文件的类型
        host:'',//访问域名，模板使用
        openSocket:false,//是否开启socket.io
        openRewrite:false,
        port:3000,    //端口设置
        logger:true,   //输出调试内容
        loggerType:1,//1：console 2file
        controllerCache:1,//是否关闭控制器缓存，方便开发,正式环境设为0
        //执行默认模块
        defaultPath:"index.html"//默认访问路径
    }

};