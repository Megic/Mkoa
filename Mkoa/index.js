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

    global.$M={};global.$S={};global.$F={};global.$C={};global.$SYS={};//定义全局变量

    $F._ = require('underscore');//辅助函数
//===================获取配置内容===================
    var sConfig = require(mpath + '/config')(root);
    var userConfig = require(root + '/config/config')(root);
    $F._.extend(sConfig, userConfig);
    $C = sConfig;

    $F.convert = require('koa-convert');//koa 旧风格中间件转换
    $F.co=require('co');
    $F.moment = require('moment');//时间格式化
    $F.moment.locale($C.defaultLang); //默认中文时间
    $F.sizeOf = require('image-size');//返回图片规格
    var sysFn = require(mpath + '/functions/init')(mpath);
    $F._.extend($F, sysFn); //整合系统方法
    $F.request = require('co-request');
    $SYS.modelPath={};//数据模型路径


    var koa,app;
    koa = require('koa');
    app = new koa();
    if($C.openSocket){
        var IO = require('koa-socket');
        $S.socket = new IO();
        $S.socket.attach(app);
    }
    require(mpath + '/middleware/init')(mpath,app);//引入预处理中间件
    if($C.openSocket) {//是否开启socket.io
        //session处理
        $S.socket.use($F.co.wrap(function *(ctx, next) {
            if($S.socketUID[ctx.socket.id]){
            ctx.session=yield $SYS.sessionStore.get('Mkoa:sess:'+$S.socketUID[ctx.socket.id]);
            ctx.sessionSave=function *(){
                yield $SYS.sessionStore.set('Mkoa:sess:'+$S.socketUID[ctx.socket.id],ctx.session);
            };}else{
                ctx.session={};
            }
            yield next();
        }));
        require($C.socketConfig)();//用户socket.io中间件
        $S.socketUID={};
        //进入事件
        $S.socket.on('connection', ctx => {
            $S.socketUID[ctx.socket.id]=getSessionId(ctx.socket.request.headers.cookie,'Mkoa:sid');
            if($S.socketConnection)$S.socketConnection(ctx);
            //获取sessiondid
            function getSessionId(cookieString, cookieName) {
                var matches = new RegExp(cookieName +'=([^;]+);', 'gmi').exec(cookieString);
                return matches&&matches[1] ? matches[1] : null;
            }
        });

        //退出事件
        $S.socket.on('disconnect', ctx => {
            if($S.socketDisconnect)$S.socketDisconnect(ctx);
            $S.socketUID[ctx.socket.id]=null;
            delete  $S.socketUID[ctx.socket.id];
        });

        ///////////////////////////MKOA默认socket事件//////////////////////
        $S.socket.on('MKOA',$F.convert(function *(next){
            var obj=this.data;//socket数据
            if(obj.path){
                this.SDATA=obj.data;
                var $this=this;
                mkoaRouter($this,'/'+obj.path);//路径处理
                var _404 = false;
                if (fs.existsSync(this.actionUrl)){ //判定controller是否存在
                    var SysFuc = require(this.actionUrl)(this); //加载controller
                    if (SysFuc && $F._.isFunction(SysFuc[this.actionName])) {
                        if(!SysFuc['_init'])SysFuc['_init']=function *(){};
                        if(!SysFuc['_after'])SysFuc['_after']=function *(){};
                        if ($F._.isFunction(SysFuc['_init'])) {
                            if ((yield SysFuc['_init'].call(this,next)) == undefined) {
                                yield SysFuc[this.actionName].call(this, next);//执行请求函数
                                if ($F._.isFunction(SysFuc['_after']))yield SysFuc['_after'].call(this, next);//执行after函数
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


    app.use($F.convert(function *(next) {
        this.GET = this.request.query;//get参数
        this.POST = this.request.body;//post参数
        this.HOSTURL = $C.host ? $C.host : 'http://' + this.host + '/';//访问地址
        this.filePath=$C.upload + '/' + $F.moment().format('YYYY/MM/DD/');//当前文件保存地址
        var $this=this;
        //保存远程文件
        $F.saveFile=function *(fileUrl,name){
            if (fs.existsSync($this.filePath) || (yield fscp.mkdirp($this.filePath, '0755'))) {//判定文件夹是否存在
                var newPath = $this.filePath + name;
                function pipeRequest(readable, requestThunk) {
                    return function (cb) {
                        readable.pipe(requestThunk(cb)).pipe(fs.createWriteStream(newPath));
                    }
                }
                yield pipeRequest($this.req, $F.request.get(fileUrl));
                return newPath.replace($C.staticpath, '');
            }
        };
//上传文件处理
        if (this.request.body.files){
            this.FILES = {};
            for (key in this.request.body.files) {
                var key = key;
                var val = this.request.body.files[key];
                var type = val.name.split('.')[1].toLowerCase();
                if (type == 'jpeg')type = 'jpg';
                var fileName = val.path.slice(-32);//获取文件名
                this.FILES[key] = false;
                if (val.size <= $C.maxFieldsSize && $F._.indexOf($C.fileType, type) > -1) {//判定是否是可上传类型
                    var newPath = $this.filePath;
                    var newFile = newPath + fileName + '.' + type;
                    if (fs.existsSync(newPath) || (yield fscp.mkdirp(newPath, '0755'))) {//判定文件夹是否存在
                        this.FILES[key] = {//返回文件对象
                            name: val.name,
                            type: type,
                            path: newFile.replace($C.staticpath, ''),
                            //size: $F.sizeOf(val.path),
                            oldPath: val.path
                        };
                    }

                } else {
                    fs.unlinkSync(val.path);//删除没通过检测的临时文件
                }
            }
        }
//****************************上传文件处理结束**************************

        mkoaRouter($this,this.request.path);//路径处理
        $SYS.getLangs($this,this.lang);
        //模板处理函数
        this.success = function (data) {//返回成功结构
            this.body = {error: 0, data: data};
        };
        this.error = function (msg,data) {//返回错误结构
            this.body = {error: msg,data: data};
        };
        this.display = function *(tpl, data,option) {//渲染模板
            var sys = {
                $U:function(mdPath){
                    var _mdArr = mdPath.split(':');
                    if (_mdArr.length > 1){
                        //非当前模块模型
                        mdPath = $C.ROOT + '/' + $C.application + '/' + _mdArr[0] + '/' + $C. views + '/' + _mdArr[1];
                    }
                    return mdPath;
                },
                $HOST: $this.HOSTURL,
                $V: $C.v,
                $STATIC: $this.HOSTURL + $this.moudle + '/' + $C.staticName + '/'//当前模块静态文件夹地址
            };
            if (tpl && !$F._.isString(tpl)) {//判断有没填模板参数
                option=data;
                data = tpl;
                tpl = '';
            }
            option=option?option:{};
            data = $F._.extend(sys, data);
            if (!tpl) {
                tpl = $this.TPL;
            } else {//跨模块模板
                var _tplArr = tpl.split(':');
                var _moudleName = $this.moudle;
                if (_tplArr.length > 1) {
                    _moudleName = _tplArr[0];
                    tpl = _tplArr[1];
                }
                tpl = $C.application + '/' + _moudleName + '/' + $C.views + '/' + tpl;
            }
            yield this.render(tpl, data,option);//渲染模板
        };
        var _404 = false;
        if (fs.existsSync($this.actionUrl)) { //判定controller是否存在
            var SysFuc = require($this.actionUrl)(this); //加载controller
            if (SysFuc && $F._.isFunction(SysFuc[$this.actionName])) {
                if(!SysFuc['_init'])SysFuc['_init']=function *(){};
                if(!SysFuc['_after'])SysFuc['_after']=function *(){};
                if ($F._.isFunction(SysFuc['_init'])) {
                    if ((yield SysFuc['_init'].call(this,next)) == undefined) {
                        if (this.caching && !this.cacheInfo.expired) {//如果存在缓存就读取缓存
                            yield next;
                        } else {
                            if (!this.body) {//前置函数未有返回
                                yield SysFuc[$this.actionName].call(this, next);//执行请求函数
                                if ($F._.isFunction(SysFuc['_after']))yield SysFuc['_after'].call(this, next);//执行after函数
                                this.cacheOptions.type = $F.encode.isJSON(this.body) ? 'json' : 'html';
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
        if (_404 && fs.existsSync($C.ROOT + '/' + $this.TPL + '.html')) {//存在html
            yield this.display();
        }
        else if (_404) {
            this.status = 404;
            yield this.display('common:404');
            this.caching = false;
        }
    }));

//mkoa路径处理函数
    function mkoaRouter($this,actionPath){
        var _curPath = actionPath;//访问路径
        $this.TPL = _curPath.slice(1);//当前controller对应的模板
        var _pathArr = _curPath.split('/');
        $this.actionName= $F._.last(_pathArr);//方法
        var _moudle = _pathArr[1];//模块名称
        $this.moudle = _moudle;
        var _arrLenght = _pathArr.length;
        var _clStr = '';//控制器路径
        for (var i = 2; i < _arrLenght - 1; i++) _clStr = _clStr + '/' + _pathArr[i];
        $this.actionUrl = $C.ROOT + '/' + $C.application + '/' + _moudle + '/' + $C.controller + '/' + _clStr + '.js';//控制器文件
        $this.modulePath = $C.ROOT + '/' + $C.application + '/' + _moudle + '/';
        $this.TPL = $C.application + '/' + _moudle + '/' + $C.views + _clStr + '/' + $this.actionName;
    }



    //postgreSession 处理
    if($SYS.pgSession){
        $SYS.pgSession.setup().then(function(){runListen();});
    }else{
        runListen();
    }
    //监听端口
    function runListen(){
        if($C.openSocket) {
            app.server.listen($C.port);//监听端口
        }else{
            app.listen($C.port);//监听端口
        }
    }

};