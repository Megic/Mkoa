//创建数据表

var fs = require('fs');
var _ = require('underscore');//辅助函数
var sConfig = require('./Mkoa/config')(__dirname);
var userConfig = require('./config/config')(__dirname);
_.extend(sConfig, userConfig);
var C = sConfig;

var Sequelize = require('sequelize');
//链接数据库
var sequelize = new Sequelize(C.pgsql.dbName,C.pgsql.username,C.pgsql.password, {
      dialect: "postgres",
      port: C.pgsql.port,
      host: C.pgsql.host,
      logging: C.logger?console.log:false
    });

function walk(path){  
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            walk(path + '/' + item);
        }else{
         sequelize.import(path + '/' + item);

    }});
}
//搜索模块文件夹
var path=__dirname+ '/' +C.application;
    var moudelList = fs.readdirSync(C.application);
    moudelList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            var fpath=path + '/' + item+ '/' + C.models;
            if(fs.existsSync(fpath)) walk(path + '/' + item+ '/' + C.models);//加载模型文件
        }});

sequelize.sync({ force: true });
