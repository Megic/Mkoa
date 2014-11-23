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
  ,staticCache = require('koa-static-cache')//静态服务器
  ,favicon = require('koa-favi')//favicon处理
  ,baseRender = require('koa-ejs')//ejs模板解析
  ,koaBody = require('koa-body')//Post处理
  ,validate=require('koa-validate')//参数过滤
  ,json = require('koa-json')//json输出
  ,session = require('koa-generic-session')//session
  ,MysqlStore = require('koa-mysql-session')// mysql存储session  //有时间可以使用sequelize改写
 ,Sequelize = require('sequelize');//ORM框架

//===================全局对象===================
 /**
     * $M  全局对象
     * $M.C 全局静态配置
     * $M.F 全局underscore函数对象
     * $M.D  返回sequelize数据模型函数
     * $M.TPL 对应请求的模板路径
     * $M.GET  GET数据对象
     * $M.POST  POST数据对象
     */

  var $M={};//全局对象
  $M.F= require('underscore');//辅助函数
  $M.C={};//全局配置

//===================获取配置内容===================
 var sConfig = require(mpath + '/config')(root);
 var userConfig = require(root + '/config/config')(root);
 $M.F.extend(sConfig, userConfig);
 $M.C = sConfig;

//输出logger
if($M.C.logger){ var logger = require('koa-logger');app.use(logger()); }
app.use(function* (next) {//系统错误处理
  try {
    yield next
  } catch(e) {
    console.log(e);
    return this.body = e.message||e.name||e;//输出错误
  }
});

app.keys = [$M.C.secret];//session支持
//使用mysql存储session  _mysql_session_store
app.use(session({
        store: new MysqlStore({
        user:$M.C.mysql.user,
        password:$M.C.mysql.password,
        database: $M.C.mysql.dbName,
        host: $M.C.mysql.port
        }),
        rolling: true,
        cookie: {
            maxage:$M.C.maxAge
        }
}))

if($M.C.csrf){//开启csrf
var csrf = require('koa-csrf')//csrf
csrf(app); app.use(csrf.middleware);
}

app.use(staticCache($M.C.static+'/', {maxAge: 365 * 24 * 60 * 60}));  //定义静态文件路径
app.use(favicon(root+'/favicon.ico'));//favicon处理
app.use(json());//json输出
app.use(koaBody({multipart: true,formLimit: 200,formidable:{uploadDir: root,keepExtensions:true}}));//body中间件
app.use(validate());//参数过滤

//定义模板
baseRender(app, {
  root:$M.C.views,
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: true
});



//链接数据库
var sequelize = new Sequelize($M.C.mysql.dbName,$M.C.mysql.user,$M.C.mysql.password, {
      dialect: "mysql", 
      port: $M.C.mysql.port, 
      logging: $M.C.logger?console.log:false
    });

$M.D=function(model){ return sequelize.import($M.C.models+'/'+model);}//模型加载



//主中间件
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

 // app.on('error', function(err) {//系统错误处理
 //        console.log('server error', err);
 //    });

app.listen($M.C.port);



}