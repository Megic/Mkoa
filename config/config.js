
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
        sms:'https://api:key-9e6096ea51f6a365ad978df7f108de9a@sms-api.luosimao.com/v1/send.json',
        models:root+'/models',
        views:root+'/views',
        controller:root+'/controller',
        static:root+'/static',
        upload:root+'/static/upload',//上传文件夹
        fileType:['jpg','png','gif'],
        maxFieldsSize:'2mb',//最大上传文件
        useUPYun:false,
        UPYun:{
             buckname: 'aichi8pic'
             ,username: 'megic'
             ,password: 'k7727719'
        },
        csrf:false,//是否开启csrf验证
        port:3000,    //端口设置
        logger:true,    //输出调试内容
 
    }

}