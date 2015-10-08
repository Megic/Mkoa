/**
 * Created by Megic 2014.11.18
 */
/**
 *
 * @param root 根目录
 * @param mpath 库目录
 */
module.exports = function (root, mpath) {
    var koa = require('koa')
        , app = koa()
        , path = require('path')
        , fs = require('fs')
        , fscp = require('co-fs-plus');//文件夹等操作

//===================全局对象===================
    /**
     * $M  全局对象
     * $M.C 全局静态配置
     * $M._ 全局underscore函数对象
     * $M.D  返回sequelize数据模型函数
     * $M.GET  GET数据对象
     * $M.POST  POST数据对象
     * $M.FILES  上传文件数据对象
     * $M.sequelize
     * $M['F'].moment 时间辅助函数（moment）
     * $M['F'].encode md5等函数
     * $M['F'].V Validator函数
     * $M['F'].sizeOf 返回图片规格(image-size)
     * $M['F'].getCachePath  返回/创建缓存文件夹
     * $M.request  co-request//发起http请求等
     * $M.HOST 访问地址
     */

    var $M = {};//全局对象
    $M._ = require('underscore');//辅助函数
    $M.F = {};
    $M.CACHE=require('memory-cache');//缓存
    $M.F.moment = require('moment');//时间格式化
    $M.F.moment.locale('zh-cn'); //默认中文时间
    $M.F.sizeOf = require('image-size');//返回图片规格

    var sysFn = require(mpath + '/functions/init')(mpath);
    $M._.extend($M.F, sysFn); //整合方法
    //$M.passport = require('koa-passport');//登录验证
    $M.request = require('co-request');
    $M.C = {};//全局配置
//===================获取配置内容===================
    var sConfig = require(mpath + '/config')(root);
    var userConfig = require(root + '/config/config')(root);
    $M._.extend(sConfig, userConfig);
    $M.C = sConfig;
    $M.ROOT = root;
    require(mpath + '/middleware/init')(mpath,app,$M);//引入预处理中间件

//////////////////////////////////////////////////主中间件//////////////////////////////////////////////////
    app.use(function *(next) {
        var $this=this;
        $M.GET = this.request.query;//get参数
        $M.POST = this.request.body;//post参数
        $M.HOST = $M.C.host[1] ? $M.C.host[1] : 'http://' + this.host + '/';//访问地址
        $M.filePath=$M.C.upload + '/' + $M.F.moment().format('YYYY/MM/DD/');//当前文件保存地址
        //保存远程文件
        $M.F.saveFile=function *(fileUrl,name){
            if (fs.existsSync($M.filePath) || (yield fscp.mkdirp($M.filePath, '0755'))) {//判定文件夹是否存在
                var newPath = $M.filePath + name;
                function pipeRequest(readable, requestThunk) {
                    return function (cb) {
                        readable.pipe(requestThunk(cb)).pipe(fs.createWriteStream(newPath));
                    }
                }
                yield pipeRequest($this.req, $M.request.get(fileUrl));
                return newPath.replace($M.C.staticpath, '');
            }
        };
//上传文件处理
        //if(this.request.body.files&&this.isAuthenticated()){//登录且包含文件数据
        if (this.request.body.files) {
            //console.log(this.checkFile('file'));
            $M.FILES = {};
            for (key in this.request.body.files) {
                var key = key;
                var val = this.request.body.files[key];
                var type = val.name.split('.')[1].toLowerCase();
                if (type == 'jpeg')type = 'jpg';
                var fileName = val.path.slice(-32);//获取文件名
                $M.FILES[key] = false;
                if (val.size <= $M.C.maxFieldsSize && $M._.indexOf($M.C.fileType, type) > -1) {//判定是否是可上传类型
                    var newPath = $M.filePath;
                    var newFile = newPath + fileName + '.' + type;
                    // if ($M.C.useUPYun) { //又拍云存储
                    //var upyun = new UPYun($M.C.UPYun.buckname, $M.C.UPYun.username, $M.C.UPYun.password);
                    //var fileContent = fs.readFileSync(val.path);
                    //var md5Str = $M.F.encode.md5(fileContent);
                    //upyun.setContentMD5(md5Str);
                    //var yppath = newFile.replace($M.C.upload, '');
                    //function ypRFile(path, file, mkdir) { //又拍云异步写
                    //    return function (callback) {
                    //        upyun.writeFile(path, file, mkdir, callback);
                    //    };
                    //}
                    //yield ypRFile(yppath, fileContent, true);
                    //$M.FILES[key] = {//返回文件对象
                    //    name: val.name,
                    //    type: type,
                    //    path: yppath,
                    //    size: $M.F.sizeOf(val.path)
                    //};
                    //fs.unlinkSync(val.path);//删除文件
                    ////****************************远程存储结束**************************
                    //} else {
                    //本地存储
                    if (fs.existsSync(newPath) || (yield fscp.mkdirp(newPath, '0755'))) {//判定文件夹是否存在
                        $M.FILES[key] = {//返回文件对象
                            name: val.name,
                            type: type,
                            path: newFile.replace($M.C.staticpath, ''),
                            size: $M.F.sizeOf(val.path),
                            oldPath: val.path
                        };
                    }

                    //****************************本地存储结束**************************
                    // }
                } else {
                    fs.unlinkSync(val.path);//删除没通过检测的临时文件
                }
            }
        }
//****************************上传文件处理结束**************************

        var _curPath = this.request.path;//访问路径
        $M.TPL = _curPath.slice(1);//当前controller对应的模板
        var _pathArr = _curPath.split('/');
        var _action = $M._.last(_pathArr);//方法
        var _moudle = _pathArr[1];//模块名称
        $M.moudle = _moudle;
        var _arrLenght = _pathArr.length;
        var _clStr = '';//控制器路径
        for (var i = 2; i < _arrLenght - 1; i++) _clStr = _clStr + '/' + _pathArr[i];
        var _acUrl = $M.ROOT + '/' + $M.C.application + '/' + _moudle + '/' + $M.C.controller + '/' + _clStr + '.js';//控制器文件
        $M.modulePath = $M.ROOT + '/' + $M.C.application + '/' + _moudle + '/';
        $M.TPL = $M.C.application + '/' + _moudle + '/' + $M.C.views + _clStr + '/' + _action;
        //模板处理函数
        this.success = function (data) {//返回成功结构
            this.body = {error: 0, data: data};
        };
        this.error = function (msg,data) {//返回错误结构
            this.body = {error: msg,data: data};
        };
        this.display = function *(tpl, data) {//渲染模板
            var sys = {
                $HOST: $M.HOST,
                $V: $M.C.v,
                $STATIC: $M.HOST + $M.moudle + '/' + $M.C.static + '/'//当前模块静态文件夹地址
            };
            if (tpl && !$M._.isString(tpl)) {//判断有没填模板参数
                data = tpl;
                tpl = '';
            }
            data = $M._.extend(sys, data);
            if (!tpl) {
                tpl = $M.TPL;
            } else {//跨模块模板
                var _tplArr = tpl.split(':');
                var _moudleName = _moudle;
                if (_tplArr.length > 1) {
                    _moudleName = _tplArr[0];
                    tpl = _tplArr[1];
                }
                tpl = $M.C.application + '/' + _moudleName + '/' + $M.C.views + '/' + tpl;
            }
            yield this.render(tpl, data);//渲染模板
        };
        var _404 = false;
        if (fs.existsSync(_acUrl)) { //判定controller是否存在
            var SysFuc = require(_acUrl)(this, $M); //加载controller
            if (SysFuc && $M._.isFunction(SysFuc[_action])) {
                if(!SysFuc['_init'])SysFuc['_init']=function *(){};
                if(!SysFuc['_after'])SysFuc['_after']=function *(){};
                if ($M._.isFunction(SysFuc['_init'])) {
                    if ((yield SysFuc['_init'].call(this,next)) == undefined) {
                        if (this.caching && !this.cacheInfo.expired) {//如果存在缓存就读取缓存
                            yield next;
                        } else {
                            if (!this.body) {//前置函数未有返回
                                yield SysFuc[_action].call(this, next);//执行请求函数
                                if ($M._.isFunction(SysFuc['_after']))yield SysFuc['_after'].call(this, next);//执行after函数
                                this.cacheOptions.type = $M.F.encode.isJSON(this.body) ? 'json' : 'html';
                                if (!this.body)_404 = true;
                            }
                        }
                    }//执行int函数
                }
            } else {
                _404 = true;
            }//404页面
        } else {
            _404 = true;
        }
        //404页面
        if (_404 && fs.existsSync($M.ROOT + '/' + $M.TPL + '.html')) {//存在html
            yield this.display();
        }
        else if (_404) {
            this.status = 404;
            yield this.display('common:404');
            this.caching = false;
        }
    });

    app.listen($M.C.port);//监听端口

};