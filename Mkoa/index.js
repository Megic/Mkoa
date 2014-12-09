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
  ,fscp = require('co-fs-plus')//文件夹等操作
  ,UPYun = require(mpath+'lib/upyun').UPYun//又拍云
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
     * $M._ 全局underscore函数对象
     * $M.D  返回sequelize数据模型函数
     * $M.TPL 对应请求的模板路径
     * $M.GET  GET数据对象
     * $M.POST  POST数据对象
     * $M.FILES  上传文件数据对象
     */

  var $M={};//全局对象
  $M._= require('underscore');//辅助函数
  $M.F={};
  $M.F.moment = require('moment');//时间格式化
  $M.F.moment.locale('zh-cn');//默认中文时间
  var sysFn = require(mpath + '/functions/init')(mpath);
  $M._.extend($M.F, sysFn);//整合方法
  $M.passport = require('koa-passport')//登录验证

  $M.C={};//全局配置

//===================获取配置内容===================
 var sConfig = require(mpath + '/config')(root);
 var userConfig = require(root + '/config/config')(root);
 $M._.extend(sConfig, userConfig);
 $M.C = sConfig;

//输出logger
if($M.C.logger){ var logger = require('koa-logger');app.use(logger()); }

//===================系统错误处理===================
app.use(function* (next) {
  try {
    yield next
  } catch(e) {
    console.log(e);
    return this.body = e.message||e.name||e;//输出错误
  }
});



app.use(staticCache($M.C.static+'/', {maxAge: 365 * 24 * 60 * 60}));  //定义静态文件路径
app.use(favicon(root+'/favicon.ico'));//favicon处理
app.use(json());//json输出
app.use(koaBody({multipart: true,formLimit: 200,formidable:{uploadDir:mpath+'cache',keepExtensions:false,maxFieldsSize:$M.C.maxFieldsSize}}));//body中间件
app.use(validate());//参数过滤

app.keys = [$M.C.secret];//session支持
//使用mysql存储session  _mysql_session_store
app.use(session({
        key:'Mkoa:sid',
        prefix:'Mkoa:sess:',
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
$M.sequelize=sequelize;
$M.D=function(model){ return sequelize.import($M.C.models+'/'+model);}//模型加载

//登录中间件
if(fs.existsSync(root + '/config/auth.js')){
require(root+'/config/auth')($M);
}else{
require(mpath+'/lib/auth')($M);
}
app.use($M.passport.initialize());
app.use($M.passport.session());

//主中间件
app.use(function *(next){

$M.USER=this.req.user;//登录后user对象
$M.GET=this.request.query;//get参数
$M.POST=this.request.body;//post参数
$M.TPL=this.request.path.slice(1);//当前controller对应的模板

//上传文件处理
if(this.request.body.files){
  $M.FILES={};
for (key in this.request.body.files)
{
  var key=key;
  var val=this.request.body.files[key];
      var type=val.type.split('/')[1];
    if(type=='jpeg')type='jpg';
    var fileName=val.path.slice(-32);//获取文件名
      $M.FILES[key]=false;
    if($M._.indexOf($M.C.fileType, type)>-1){//判定是否是可上传类型
      var newPath=$M.C.upload+'/'+$M.F.moment().format('YYYY/MM/DD/');
      var newFile=newPath+fileName+'.'+type;
      if($M.C.useUPYun){ //又拍云存储
      var upyun = new UPYun($M.C.UPYun.buckname,$M.C.UPYun.username,$M.C.UPYun.password);
      var fileContent = fs.readFileSync(val.path);
      var md5Str = $M.F.encode.md5(fileContent);
      upyun.setContentMD5(md5Str);
      var yppath=newFile.replace($M.C.upload,'');

      function ypRFile(path,file,mkdir) { //又拍云异步写
          return function(callback) {upyun.writeFile(path,file,mkdir,callback); };
      }
      yield ypRFile(yppath, fileContent,true);
      $M.FILES[key]={//返回文件对象
                  name:val.name,
                  type:type,
                  path:yppath
                };
      fs.unlinkSync(val.path);//删除文件
    //****************************远程存储结束**************************
      }else{//本地存储
      if(fs.existsSync(newPath)){//判定文件夹是否存在
        fs.renameSync(val.path,newFile);//转移临时文件
      }else{
       if(yield fscp.mkdirp(newPath, 0755))fs.renameSync(val.path,newFile);//转移临时文件   
      }
      $M.FILES[key]={//返回文件对象
        name:val.name,
        type:type,
        path:newFile.replace($M.C.static,'')
      };
      //****************************本地存储结束**************************
     }
    }else{ 
    fs.unlinkSync(val.path);//删除没通过检测的临时文件
    }
}
}
//****************************上传文件处理结束**************************

var action=$M._.last(this.request.path.split('/'));//方法
var cpath=this.request.path.substring(0,this.request.path.lastIndexOf("/"+action)); //controller
var acUrl=$M.C.controller+cpath+'.js';
if(fs.existsSync(acUrl)){ //判定controller是否存在
  var SysFuc=require(acUrl)(this,$M); //加载controller
   if (SysFuc&&$M._.isFunction(SysFuc[action])){ 
   if($M._.isFunction(SysFuc['_init']))yield SysFuc['_init']();//执行int函数
    yield SysFuc[action]();//执行请求函数
 }else{yield next;}//404页面
}else{ yield next; }//404页面

});


app.use(function *page404(next){//404页面
  yield this.render('404',{title:'找不到该页面！'});
});


app.listen($M.C.port);



}