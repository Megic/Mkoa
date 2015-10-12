/**
 * Created by Megic on 14-11-30.
 */
module.exports = function(mpath,app,$M){
    var fs = require('fs');
    var path=mpath+'/middleware/';
    require(path+'logger')(app,$M);//logger与错误输出部分
    require(path+'static')(app,$M);//静态文件处理部分
    require(path+'session')(app,$M);//session处理部分
    require(path+'db')(app,$M);//数据库orm处理部分
    require(path+'safe')(app,$M);//安全及输入部分
    require(path+'cache')(app,$M);//缓存处理部分
    require(path+'tpl')(app,$M);//输出处理部分
    require($M.ROOT+ '/config/middleware')(app,$M);//用户自定义中间件


    //***************************自动加载模块目录下中间件***********************

    function walk(apppath){
        var dirList = fs.readdirSync(apppath);
        dirList.forEach(function(item){
            if(fs.statSync(apppath + '/' + item).isDirectory()){
                walk(apppath + '/' + item);
            }else{
                require(apppath + '/' + item)(app,$M);//加载模块中间件
            }});
    }
//搜索模块文件夹
    var apppath=$M.ROOT+ '/' +$M.C.application;
    var moudelList = fs.readdirSync($M.C.application);
    moudelList.forEach(function(item){
        if(fs.statSync(apppath + '/' + item).isDirectory()){
            var fpath=apppath + '/' + item+ '/' + $M.C.middleware;
            if(fs.existsSync(fpath)) walk(apppath + '/' + item+ '/' + $M.C.middleware);
        }});


};