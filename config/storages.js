//文件存储源定义
module.exports= {
    default:{
        name:'本地存储',
        type:'filesystem',//本地存储存储
        options:{
            root:require('path').join(__dirname,'../static/storage/'),//本地存储地址
            ext:['.png'],//允许上传的格式后缀,小写
            keepExtensions:true
            ,maxFieldsSize:2 * 1024 * 1024 //2M 数据大小
            ,maxFields:1000
        }
    }
};