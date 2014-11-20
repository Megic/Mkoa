/**
 * Created by Megic 2014.11.18
 */
/**
 *
 * @param root 根目录
 * @param mPath 库目录
 */
module.exports = function(root, mpath) {

var koa = require('koa')
  ,app = koa()
  ,path = require('path')
  ,fs = require('fs')
  ,staticCache = require('koa-static-cache')
  ,favicon = require('koa-favi')
  ,baseRender = require('koa-ejs')
  ,koaBody = require('koa-body');

  var $M={};//全局对象
  $M.F= require('underscore');//辅助函数
  $M.C={};//全局配置

//===================获取配置内容===================
 var sConfig = require(mpath + '/config')(root);
 var userConfig = require(root + '/config/config')(root);
 $M.F.extend(sConfig, userConfig);
 $M.C = sConfig;

//调试
if($M.C.logger){ 
var logger = require('koa-logger');app.use(logger());
}

  //定义静态文件路径
 app.use(staticCache($M.C.static+'/', {
  maxAge: 365 * 24 * 60 * 60
}));

app.use(favicon(root+'/favicon.ico'));//favicon处理

app.use(koaBody());//body中间件


//定义模板
baseRender(app, {
  root:$M.C.views,
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: true
});



app.use(function *(next){

$M.GET=this.request.query;//get参数
$M.POST=this.request.body;//post参数
$M.TPL=this.request.path.slice(1);//当前controller对应的模板


var action=$M.F.last(this.request.path.split('/'));//方法
var cpath=this.request.path.replace( "/"+action,""); //controller
var acUrl=$M.C.controller+cpath+'.js';
if(fs.existsSync(acUrl)){ //判定controller是否存在
  var SysFuc=require(acUrl)(this,$M); //加载controller
   if(!SysFuc) return yield next; //404
   if ($M.F.isFunction(SysFuc[action]))  yield SysFuc[action]();//执行请求函数
}else{ yield next; }

});


app.use(function *page404(next){//404页面
  yield this.render('404',{title:'找不到该页面！'});
});

 app.on('error', function(err) {//系统错误处理
        console.log('server error', err);
    });

app.listen(3000);



}