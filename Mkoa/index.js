/**
 * Created by Megic 2014.11.18
 */
/**
 *
 * @param options
 */

module.exports = function (options) {
    console.log('正在启动MKOA项目...');
    let root=options.root;//项目根目录
    let mpath=__dirname;
    let path = require('path')
        , fs = require('fs-extra');//扩展文件夹等操作
//=================================全局对象====================================================//
    global.$app='';global.$M={};global.$S={};global.$F={};global.$C={};global.$SYS={};global.$DB={};global.$ST={};//定义全局变量
    $F._ = require('underscore');//辅助函数
    $F.fs=fs;//扩展后的fs
    //配置信息获取
    //=================================配置信息====================================================//
    let sysConfig = require(mpath + '/config')(root);
    let configCache={};//配置缓存
    sysConfig.configTag=options.env;
    sysConfig.U=function(urlStr){//获取配置文件地址，处理tag情况
        if(!urlStr){console.log('配置文件不正确!');return{};}
        if(!$C.delcontrollerCache&&configCache[urlStr])return configCache[urlStr];//读取缓存
        let urlTag=sysConfig.configTag?sysConfig.configTag+'/':'';
        let urlArr = urlStr.split(':');
        let firestPath=options.baseConfigPath?options.baseConfigPath:root + '/config/';//默认调用根目录公共配置文件
        if (urlArr.length > 1){
            firestPath=root  + '/' + $C.application + '/' + urlArr[0]+'/config/';
            urlStr=urlArr[1];
        }
        let resPath=firestPath+urlTag+urlStr;
        let curPath=(urlTag&&(fs.existsSync(resPath)||fs.existsSync(resPath+'.js')))?resPath:(firestPath+urlStr);
        let redata={};
        if(fs.existsSync(curPath+'.js')){
            if($C.delcontrollerCache)delete require.cache[require.resolve(curPath)];//删除缓存
            redata=require(curPath);
        }
        configCache[urlStr]=(typeof redata =='function')?redata(root):redata;//获取配置信息
        return configCache[urlStr];
    };
    let userConfig = sysConfig.U('config');//获取全局配置
    $F._.extend(sysConfig, userConfig);//合并默认配置
    $C = sysConfig;
    //console.log(sysConfig)
    //=================================F函数====================================================//
    $F.co=require('co');
    $F.convert = require('koa-convert');//koa 旧风格中间件转换
    $F.moment = require('moment');//时间格式化
    $F.moment.locale($C.lang_default); //默认中文时间
    $F.indicative = require('indicative');//自动校验
    let sysFn = require(mpath + '/functions/init')(mpath);
    $F._.extend($F, sysFn); //整合系统方法
    let koa= require('koa'),app;
    app = new koa();
    app.proxy=$C.proxy;
    app.keys = $C.keys;


    //执行控制器方法
    async function callAction(action,$this){
        let  args= Array.prototype.slice.call(arguments);args.shift();//传递参数
        switch (action.constructor.name){
            case 'Function'://普通函数
                return await action.apply($this,args);
                break;
            case 'GeneratorFunction'://生成器
                return await $F.co.wrap(function *(){ return yield action.apply($this,args);})();
                break;
            case 'AsyncFunction'://Async
                return await action.apply($this,args);
                break;
        }
    }

    if($C.socket_open){//socket准备
        let IO = require('koa-socket');
        $S.socket = new IO();
        $S.socket.attach(app);
    }
    require(mpath + '/middleware/init')(mpath,app);//引入预处理中间件
    if($C.socket_open) {
        //是否开启socket.io
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
                let matches = new RegExp(cookieName +'=([^;]+);', 'gmi').exec(cookieString);
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
            let obj=this.data;//socket数据
            if(obj.path){
                this.SDATA=obj.data;
                let $this=this;
                mkoaRouter($this,'/'+obj.path);//路径处理
                let _404 = false;
                if (fs.existsSync(this.actionUrl)){ //判定controller是否存在
                    if($C.delcontrollerCache)delete require.cache[require.resolve(this.actionUrl)];//删除缓存
                    let SysFuc = require(this.actionUrl)(this); //加载controller
                    if (SysFuc && $F._.isFunction(SysFuc[this.actionName])) {
                        if(!SysFuc['_before'])SysFuc['_before']=function *(){};
                        if(!SysFuc['_after'])SysFuc['_after']=function *(){};
                        if ($F._.isFunction(SysFuc['_before'])) {
                            if ((yield SysFuc['_before'].call(this,next)) == undefined) {
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
    app.use(async (ctx, next) => {
        let $this=ctx;//引用
        $this.GET = $this.request.query;//get参数
        $this.POST = $this.request.body;//post参数
        $this.params=$this.request.body;//post参数

        $C.host=$C.host?$C.host:'http://' + $this.host + '/';
        $this.HOSTURL = $C.host;//访问地址
        mkoaRouter($this,$this.request.path);//路径处理
        if($C.lang_open)$SYS.getLangs($this,$this.lang);//获取语言
        //模板处理函数
        $this.success = function (data) {//返回成功结构
            $this.body = {error: 0, data: data};
        };
        $this.error = function (code,data) {//返回错误结构
            $this.body = {error: code,data: data};
        };
        $this.display = function (tpl, data,option) {//渲染模板
            let sys = {
                $U:function(mdPath){
                    let _mdArr = mdPath.split(':');
                    if (_mdArr.length > 1){
                        //非当前模块模型
                        mdPath = $C.ROOT + '/' + $C.application + '/' + _mdArr[0] + '/' + $C. views + '/' + _mdArr[1];
                    }
                    return mdPath;
                },
                $HOST: $this.HOSTURL,
                $V: $C.V,
                $SV:$C.SV?$C.SV:new Date().getTime(),
                $MOUDLE:$this.moudle,
                $PATH:$this.request.path,
                $STATIC: $this.HOSTURL + $this.moudle + '/' + $C.static_pathName + '/'//当前模块静态文件夹地址
            };
            if (tpl && !$F._.isString(tpl)) {//判断有没填模板参数
                option=data;
                data = tpl;
                tpl = '';
            }
            option=option?option:{};
            data = $F._.extend(sys, data);
            if (!tpl) {
                tpl = $this.TPL+ '.'+$C.view_ext;
            } else {//跨模块模板
                let _tplArr = tpl.split(':');
                let _moudleName = $this.moudle;
                if (_tplArr.length > 1) {
                    _moudleName = _tplArr[0];
                    tpl = _tplArr[1];
                }
                tpl = $C.application + '/' + _moudleName + '/' + $C.views + '/' + tpl;
            }
            return $this.render(tpl, data,option);//渲染模板
        };

        let _404 = false;
        if (fs.existsSync($this.actionUrl)) { //判定controller是否存在
            if($C.delcontrollerCache)delete require.cache[require.resolve($this.actionUrl)];//删除缓存
            let actionFile=require($this.actionUrl);
            let SysFuc = $F._.isFunction(actionFile)?actionFile($this):actionFile; //加载controller
            if (SysFuc && $F._.isFunction(SysFuc[$this.actionName])){//存在控制器
                if(!SysFuc['_before'])SysFuc['_before']=function (){};
                if(!SysFuc['_after'])SysFuc['_after']=function (){};
                if ($F._.isFunction(SysFuc['_before'])){
                    if ((await callAction(SysFuc['_before'],$this)) == undefined) {
                        if(ctx.cacheBodyString){$this.body=ctx.cacheBodyString;return;}//存在缓存
                        if(!$this.body){//不存在输出信息
                        ///************************自动校验*************************/
                        let errorsmsg=false;// 校验错误信息
                        if($C.logic_open&&fs.existsSync($this.logicUrl)){ //开启自动校验
                            if($C.delcontrollerCache)delete require.cache[require.resolve($this.logicUrl)];//删除缓存
                            let logicFn= require($this.logicUrl);//校验规则
                            let logicData=logicFn[$this.actionName];
                            if(logicData){//存在校验规则
                                if ($F._.isFunction(logicFn['_before']))await callAction(logicFn['_before'],$this);//存在前置函数
                                logicData.method=logicData.method?logicData.method:'POST';//默认方法
                                let data=logicData.method=='GET'?$this.request.query:$this.request.body;//检验数据
                                if(logicData.method==$this.method){
                                logicData.rules=logicData.rules||{};
                                logicData.messages=logicData.messages||{};
                                logicData.sanitizeFirst=logicData.sanitizeFirst||false;
                                if(logicData.sanitizeFirst&&logicData.sanitization)data=$F.indicative.sanitize(data,logicData.sanitization);//转换
                                await $F.indicative.validate(data,logicData.rules,logicData.messages).catch(function (errors) {errorsmsg=errors;});
                                if(!logicData.sanitizeFirst&&logicData.sanitization)data=$F.indicative.sanitize(data,logicData.sanitization);//后转换

                               // $this[logicData.method=='GET'?'GET':'POST']=data;//重新赋予转换后的数据

                                if ($F._.isFunction(logicFn['_after']))await callAction(logicFn['_after'],$this,errorsmsg);//执行after函数
                                if (!$this.body&&errorsmsg)$this.error(400,errorsmsg);//返回错误信息
                                }else{
                                    throw new Error(500,'method error');
                                }
                            }
                        }
                        ///************************自动校验.end*************************/
                        }
                            if (!$this.body) {//前置函数未有返回
                                await callAction(SysFuc[$this.actionName],$this);
                                if ($F._.isFunction(SysFuc['_after']))await callAction(SysFuc['_after'],$this);//执行after函数
                                if (!$this.body&&!$this.response.header.location&&$this.status!=304)_404 = true;
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

        if (_404 && fs.existsSync($C.ROOT + '/' + $this.TPL + '.'+$C.view_ext)) {//存在html
           await $this.display();
        }
        else if (_404) {
            $this.status = 404;
            throw new Error(404,'Not Fount');
        }

    });

//mkoa路径处理函数
    function mkoaRouter($this,actionPath){
        let _curPath = actionPath;//访问路径
        $this.TPL = _curPath.slice(1);//当前controller对应的模板
        let _pathArr = _curPath.split('/');
        $this.actionName= $F._.last(_pathArr);//方法
        let _moudle = _pathArr[1];//模块名称
        $this.moudle = _moudle;
        let _arrLenght = _pathArr.length;
        let _clStr = '';//控制器路径
        for (let i = 2; i < _arrLenght - 1; i++) _clStr = _clStr + '/' + _pathArr[i];
        $this.actionUrl = $C.ROOT + '/' + $C.application + '/' + _moudle + '/' + $C.controller + '/' + _clStr + '.js';//控制器文件
        $this.logicUrl = $C.ROOT + '/' + $C.application + '/' + _moudle + '/' + $C.logic + '/' + _clStr + '.js';//控制器文件
        $this.modulePath = $C.ROOT + '/' + $C.application + '/' + _moudle + '/';
        $this.TPL = $C.application + '/' + _moudle + '/' + $C.views + _clStr + '/' + $this.actionName;
    }
    let port=process.env.PORT?process.env.PORT:$C.port;//启动端口
    console.log(`启动成功!监听端口:`+port);
    //监听端口
        if($C.socket_open) {
            $app=app.server.listen(port);//监听端口
        }else{
            $app=app.listen(port);//监听端口
        }

};