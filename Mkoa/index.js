/**
 * Created by Megic 2014.11.18
 */
/**
 *
 * @param root 根目录
 * @param mpath 库目录
 */
module.exports = function (root, mpath) {
    var path = require('path')
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
    $M.convert = require('koa-convert');//koa 旧风格中间件转换
    $M.co=require('co');
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
    var koa,app;
    koa = require('koa');
    app = new koa();
    if($M.C.openSocket){
        const co = $M.co;
        const IO = require('koa-socket');
        $M.socket = new IO();
        $M.socket.attach(app);
    }
    require(mpath + '/middleware/init')(mpath,app,$M);//引入预处理中间件
    if($M.C.openSocket) {//是否开启socket.io
        //session处理
        $M.socket.use($M.co.wrap(function *(ctx, next) {
            if($M.socketUID[ctx.socket.id]){
            ctx.session=yield $M.sessionStore.get('Mkoa:sess:'+$M.socketUID[ctx.socket.id]);
            ctx.sessionSave=function *(){
                yield $M.sessionStore.set('Mkoa:sess:'+$M.socketUID[ctx.socket.id],ctx.session);
            };}else{
                ctx.session={};
            }
            yield next();
        }));
        require($M.C.socketConfig)($M);//用户socket.io中间件
        $M.socketUID={};
        //进入事件
        $M.socket.on('connection', ctx => {
            $M.socketUID[ctx.socket.id]=getSessionId(ctx.socket.request.headers.cookie,'Mkoa:sid');
            if($M.socketConnection)$M.socketConnection(ctx);
            //获取sessiondid
            function getSessionId(cookieString, cookieName) {
                var matches = new RegExp(cookieName +
                    '=([^;]+);', 'gmi').exec(cookieString);
                return matches&&matches[1] ? matches[1] : null;
            }
        });

        //退出事件
        $M.socket.on('disconnect', ctx => {
            if($M.socketDisconnect)$M.socketDisconnect(ctx);
            $M.socketUID[ctx.socket.id]=null;
            delete  $M.socketUID[ctx.socket.id];
        });

        ///////////////////////////MKOA默认socket事件//////////////////////
        $M.socket.on('MKOA',$M.convert(function *(next){
            var obj=this.data;//socket数据
            if(obj.path){
                $M.DATA=obj.data;
                mkoaRouter($M,'/'+obj.path);//路径处理
                var _404 = false;
                if (fs.existsSync($M.actionUrl)) { //判定controller是否存在
                    var SysFuc = require($M.actionUrl)(this,$M); //加载controller
                    if (SysFuc && $M._.isFunction(SysFuc[$M.actionName])) {
                        if(!SysFuc['_init'])SysFuc['_init']=function *(){};
                        if(!SysFuc['_after'])SysFuc['_after']=function *(){};
                        if ($M._.isFunction(SysFuc['_init'])) {
                            if ((yield SysFuc['_init'].call(this,next)) == undefined) {
                                yield SysFuc[$M.actionName].call(this, next);//执行请求函数
                                if ($M._.isFunction(SysFuc['_after']))yield SysFuc['_after'].call(this, next);//执行after函数
                            }//执行int函数
                            //yield this.sessionSave();//保存session
                        }
                    } else {
                        _404 = true;
                    }//404页面
                } else {
                    _404 = true;
                }
                //404页面处理
                if(_404){
                    this.socket.emit('MKOA',{error:'404'});//没有相关处理方法
                }
            }
        }));
    }



    app.use($M.convert(function *(next) {
        var $this=this;
        $M.GET = this.request.query;//get参数
        $M.POST = this.request.body;//post参数
        $M.HOST = $M.C.host ? $M.C.host : 'http://' + this.host + '/';//访问地址
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
        if (this.request.body.files){
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
                    if (fs.existsSync(newPath) || (yield fscp.mkdirp(newPath, '0755'))) {//判定文件夹是否存在
                        $M.FILES[key] = {//返回文件对象
                            name: val.name,
                            type: type,
                            path: newFile.replace($M.C.staticpath, ''),
                            size: $M.F.sizeOf(val.path),
                            oldPath: val.path
                        };
                    }

                } else {
                    fs.unlinkSync(val.path);//删除没通过检测的临时文件
                }
            }
        }
//****************************上传文件处理结束**************************

        mkoaRouter($M,this.request.path);//路径处理
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
                $STATIC: $M.HOST + $M.moudle + '/' + $M.C.staticName + '/'//当前模块静态文件夹地址
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
                var _moudleName = $M.moudle;
                if (_tplArr.length > 1) {
                    _moudleName = _tplArr[0];
                    tpl = _tplArr[1];
                }
                tpl = $M.C.application + '/' + _moudleName + '/' + $M.C.views + '/' + tpl;
            }
            yield this.render(tpl, data);//渲染模板
        };
        var _404 = false;
        if (fs.existsSync($M.actionUrl)) { //判定controller是否存在
            var SysFuc = require($M.actionUrl)(this, $M); //加载controller
            if (SysFuc && $M._.isFunction(SysFuc[$M.actionName])) {
                if(!SysFuc['_init'])SysFuc['_init']=function *(){};
                if(!SysFuc['_after'])SysFuc['_after']=function *(){};
                if ($M._.isFunction(SysFuc['_init'])) {
                    if ((yield SysFuc['_init'].call(this,next)) == undefined) {
                        if (this.caching && !this.cacheInfo.expired) {//如果存在缓存就读取缓存
                            yield next;
                        } else {
                            if (!this.body) {//前置函数未有返回
                                yield SysFuc[$M.actionName].call(this, next);//执行请求函数
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
        //404页面处理
        if (_404 && fs.existsSync($M.ROOT + '/' + $M.TPL + '.html')) {//存在html
            yield this.display();
        }
        else if (_404) {
            this.status = 404;
            yield this.display('common:404');
            this.caching = false;
        }
    }));

//mkoa路径处理函数
    function mkoaRouter($M,actionPath){
        var _curPath = actionPath;//访问路径
        $M.TPL = _curPath.slice(1);//当前controller对应的模板
        var _pathArr = _curPath.split('/');
        $M.actionName= $M._.last(_pathArr);//方法
        var _moudle = _pathArr[1];//模块名称
        $M.moudle = _moudle;
        var _arrLenght = _pathArr.length;
        var _clStr = '';//控制器路径
        for (var i = 2; i < _arrLenght - 1; i++) _clStr = _clStr + '/' + _pathArr[i];
        $M.actionUrl = $M.ROOT + '/' + $M.C.application + '/' + _moudle + '/' + $M.C.controller + '/' + _clStr + '.js';//控制器文件
        $M.modulePath = $M.ROOT + '/' + $M.C.application + '/' + _moudle + '/';
        $M.TPL = $M.C.application + '/' + _moudle + '/' + $M.C.views + _clStr + '/' + $M.actionName;
    }



    //postgreSession 处理
    if($M.pgSession){
        $M.pgSession.setup().then(function(){runListen();});
    }else{
        runListen();
    }
    //监听端口
    function runListen(){
        if($M.C.openSocket) {
            app.server.listen($M.C.port);//监听端口
        }else{
            app.listen($M.C.port);//监听端口
        }
    }

};