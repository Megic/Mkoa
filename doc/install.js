//创建数据表


var fs = require('fs');
var _ = require('underscore');//辅助函数
var sConfig = require('./Mkoa/config')(__dirname);
var userConfig = require('./config/config')(__dirname);
_.extend(sConfig, userConfig);
var C = sConfig;

//记录已经创建数据表的模型
var filePath='install.json';
var modelData=[];
if(fs.existsSync(filePath)){
    var res=fs.readFileSync(filePath,'utf-8');
    if(res)modelData=JSON.parse(res);
}else{
    fs.writeFile(filePath,JSON.stringify(modelData), function (error) {
        if (error)console.log('生成install.json文件失败！');
        console.log('生成install.json文件');
    });
}



var Sequelize = require('sequelize');
//链接数据库
var sequelize;
if(C.sqlType==1){//sql
    sequelize = new Sequelize(C.mysql.dbName,C.mysql.username,C.mysql.password, {
        dialect: "mysql",
        host: C.mysql.host,
        port: C.mysql.port,
        logging: C.logger?console.log:false
    });
}
if(C.sqlType==2){//postgres
    sequelize = new Sequelize(C.pgsql.dbName, C.pgsql.username, C.pgsql.password, {
        dialect: "postgres",
        host: C.pgsql.host,
        port: C.pgsql.port,
        logging: C.logger ? console.log : false,
        autocommit: false,
        isolationLevel: 'REPEATABLE_READ',
        deferrable: 'NOT DEFERRABLE' // implicit default of postgres
    });
}

function walk(path){  
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            walk(path + '/' + item);
        }else{
            if(modelData.indexOf(item)==-1){
                sequelize.import(path + '/' + item);
                modelData.push(item);
            }

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

fs.writeFile(filePath,JSON.stringify(modelData), function (error) {
    if (error)console.log('写入install.json文件失败！');
    console.log('锁定数据模型');
});