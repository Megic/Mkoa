/**
 * Created by Megic on 14-11-30.
 */
module.exports = function(mpath,app,$M){
  var path=mpath+'/middleware/';
   require(path+'logger')(app,$M);//logger与错误输出部分
    require(path+'static')(app,$M);//静态文件处理部分
    require(path+'session')(app,$M);//session处理部分
    require(path+'db')(app,$M);//数据库orm处理部分
    require(path+'safe')(app,$M);//安全及输入部分
    require(path+'cache')(app,$M);//缓存处理部分
    require(path+'tpl')(app,$M);//输出处理部分
    require($M.ROOT+ '/config/middleware')(app,$M);//用户自定义中间件
};