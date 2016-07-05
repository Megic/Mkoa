/**
 * npm，对根目录及模块目录进行npm安装 运行node npm.js
 */
var fs = require('fs');
$C={};
$C.application='Application';//模块文件夹名

var cprocess = require('child_process');
console.log('设置npm源......');
cprocess.execSync('npm config set registry http://registry.npm.taobao.org/',{cwd:__dirname});//设置安装源
console.log('安装全局依赖...');
cprocess.execSync('npm install',{cwd:__dirname});//执行npm安装

//搜索模块文件夹
var path=__dirname+ '/' +$C.application;
var moudelList = fs.readdirSync($C.application);//搜索模块目录

moudelList.forEach(function(item){
    if(fs.statSync(path + '/' + item).isDirectory()){
        var fpath=path + '/' + item+ '/package.json';//存在package文件
        if(fs.existsSync(fpath)) {
            console.log('正在安装'+item+'模块依赖...');
            cprocess.execSync('npm install', {cwd: path + '/' + item + '/'});
        }//执行npm安装
    }});

console.log('所有依赖安装完成！');