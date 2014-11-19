/**
 * Created by Megic 2014.11.18
 */
/**
 *
 * @param root 根目录
 * @param mPath 库目录
 */
module.exports = function(root, mpath) {

var SYS={};//全局对象
var koa = require('koa')
  // , router = require('koa-router')
  ,app = koa()
  ,path = require('path')
  ,fs = require('fs')
  ,staticCache = require('koa-static-cache')
  ,favicon = require('koa-favi')
  ,render = require('koa-swig')
  ,koaBody = require('koa-body')()
  ,SYS.F= require('underscore');

 
  SYS.C={};//全局配置

//===================获取配置内容
 var systemConfig = require(mpath + '/config')(root);
 var clientConfig = require(root + '/config/config')(root);
 SYS.F.extend(systemConfig, clientConfig);
 SYS.C = systemConfig;

//调试
if(SYS.C.logger){ 
var logger = require('koa-logger');app.use(logger());
}



  //定义静态文件路径
 app.use(staticCache(path.join(root, 'static'), {
  maxAge: 365 * 24 * 60 * 60
}));

app.use(favicon(root+'/favicon.ico'));

//定义模板
render(app, {
  root: path.join(root, 'views'),
  autoescape: true,
  cache: 'memory',  // disable, set to false
  ext: 'html'
});


app.use(function *(next){

var action=_.last(this.request.path.split('/'));//方法
var cpath=this.request.path.replace( "/"+action,""); //controller
var acUrl=SYS.C.controller+cpath+'.js';
if(fs.existsSync(acUrl)){ //判定controller是否存在
  var sysFuc=require(acUrl)(this,render); //加载controller
   if(!sysFuc) return yield next; //404
   if (SYS.F.isFunction(sysFuc[action]))  yield sysFuc[action]();
}else{ yield next; }


});




app.use(function *page404(next){
  yield this.render('404');
});

 app.on('error', function(err) {
        console.log('server error', err);
    });

app.listen(3000);



}