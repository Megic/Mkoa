//创建数据表

var fs = require('fs');
var C = require('./config/config')(__dirname);
console.log(C.models);
var Sequelize = require('sequelize');
//链接数据库
var sequelize = new Sequelize(C.mysql.dbName,C.mysql.user,C.mysql.password, {
      dialect: "mysql", 
      port: C.mysql.port,
      host: C.mysql.host,
      logging: C.logger?console.log:false
    });

function walk(path){  
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            walk(path + '/' + item);
        }else{
         sequelize.import(path + '/' + item);
        }
    });
}

walk(C.models);
sequelize.sync({ force: true });
