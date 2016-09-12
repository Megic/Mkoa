/**
 * Created by Megic on 14-11-30.
 */
module.exports = function(mpath,app){
    var fs = require('fs');
    var path=mpath+'/middleware/';
    require(path+'cors')(app);//cors请求部分,用
    require(path+'logger')(app);//logger与错误输出部分
    require(path+'rewrite')(app);//rewrite处理部分
    require(path+'static')(app);//静态文件处理部分
    require(path+'session')(app);//session处理部分
    require(path+'db')(app);//数据库orm处理部分
    require(path+'safe')(app);//安全及输入部分
    require(path+'cache')(app);//缓存处理部分
    require(path+'tpl')(app);//输出处理部分
    require(path+'lang')(app);//语言处理部分
    require(path+'low')(app);//low文件内存数据库
    require($C['U']('middleware'))(app);//用户自定义中间件


    //***************************自动加载模块目录下中间件***********************
    var apppath=$C.ROOT+ '/' +$C.application;

    function walk(apppath,callback){
        var dirList = fs.readdirSync(apppath);
        dirList.forEach(function(item){
            if(fs.statSync(apppath + '/' + item).isDirectory()){
                walk(apppath + '/' + item);
            }else{
                callback(apppath + '/' + item,item);
            }});
    }

    //加载模块目录中间件
    var moudelList = fs.readdirSync($C.application);
    moudelList.forEach(function(item){
        if(fs.statSync(apppath + '/' + item).isDirectory()){
            var fpath=apppath + '/' + item+ '/' + $C.middleware;
            if(fs.existsSync(fpath)){
                var isAdd=1;
                if(fs.existsSync(apppath + '/' + item+'/package.json')){
                    if(!fs.existsSync(apppath + '/' + item+'/node_modules/'))isAdd=0;//没有安装依赖
                }
                if(isAdd)walk(fpath,function(filePath){
                    require(filePath)(app);//加载模块中间件
                });
            }

            var mdPath=apppath + '/' + item+ '/' + $C.models;//加载数据模型数据
            if(fs.existsSync(mdPath)) walk(mdPath,function(filePath,fileName){
                var nameArr=fileName.split('.');
                $SYS.modelPath[nameArr[0]]=filePath;//把模型文件地址放到变量
                if ($C.syncModel)$SYS.sequelize.import(filePath);//加载数据表
            });
        }});
    if ($C.syncModel)$SYS.sequelize.sync({});//同步模型到数据表

};