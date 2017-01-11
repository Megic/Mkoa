/**
 * Created by Megic on 14-11-30.
 */
module.exports = function(mpath,app){
    let fs = require('fs');
    let path=mpath+'/middleware/';
    if($C.cors_open)require(path+'cors')(app);//cors请求部分,用
    if($C.logger_open)require(path+'logger')(app);//logger
    require(path+'error')(app);//错误处理
    if($C.jwt_open)require(path+'jwt')(app);//权限处理部分
    if($C.apiProxy_open)require(path+'proxy')(app);//权限处理部分
    if($C.rewrite_open)require(path+'rewrite')(app);//rewrite处理部分
    if($C.static_open)require(path+'static')(app);//静态文件处理部分
    if($C.db_open)require(path+'db')(app);//数据源处理
    if($C.lang_open)require(path+'lang')(app);//语言处理部分
    if($C.db_open&&$C.session_open)require(path+'session')(app);//session处理部分
    require(path+'body')(app);//安全及输入部分
    if($C.cache_open)require(path+'cache')(app);//缓存处理部分
    if($C.view_open)require(path+'tpl')(app);//输出处理部分

    //***************************自动加载模块目录下中间件***********************//
    let apppath=$C.ROOT+ '/' +$C.application;

    function walk(apppath,callback){
        let dirList = fs.readdirSync(apppath);
        dirList.forEach(function(item){
            if(fs.statSync(apppath + '/' + item).isDirectory()){
                walk(apppath + '/' + item);
            }else{
                callback(apppath + '/' + item,item);
            }});
    }
//
    let installArr=[];//需要安装的模块
    //加载模块目录中间件
    let moudelList = fs.readdirSync(apppath);
    let dataSources=$C['U']('datasources');
    let modelsAfter=[];//模型初始化后执行
    let mongoose,Schema;
    let sequelizeModelNum=0;//模型计数，用于判断生成数据表


    moudelList.forEach(function(item){
        if(fs.statSync(apppath + '/' + item).isDirectory()){
            let fpath=apppath + '/' + item+ '/' + $C.middleware;
            if(fs.existsSync(fpath)){
                let isAdd=1;
                if(fs.existsSync(apppath + '/' + item+'/package.json')){
                    if(!fs.existsSync(apppath + '/' + item+'/node_modules/'))isAdd=0;//没有安装依赖
                }
                if(isAdd)walk(fpath,function(filePath){//依赖安装后加载中间件
                    require(filePath)(app);//加载模块中间件
                });
            }
            if($C.install_check){//是否存在需要安装的模块
                let installPath=apppath + '/' + item+ '/install/';
                if(fs.existsSync(installPath)&&!fs.existsSync(installPath+'lock')){
                    installArr.push(installPath);
                }
            }

            if($C.db_open) {
                //加载各模块模型文件
                let mdPath = apppath + '/' + item + '/' + $C.models;//加载数据模型数据
                if (fs.existsSync(mdPath)) walk(mdPath, function (filePath, fileName) {
                    let nameArr = fileName.split('.');//拆分文件名
                    getModelByPath(filePath, nameArr[0]);//加载模型文件
                });
            }
        }});

    function getModelByPath(filePath,name){
        let model=require(filePath);//加载模型文件
        model.datasources=model.datasources?model.datasources:'default';//默认数据源
        model.name=model.name?model.name:name;//模型名称默认使用模型文件名
        model.extend=model.extend?model.extend:{};//扩展
        model.prefix=dataSources[model.datasources].prefix?dataSources[model.datasources].prefix:'';//表前缀
        if(dataSources[model.datasources].type=='sequelize'){//数据模型源类型
            sequelizeModelNum++;
            model.extend.tableName=model.extend.tableName?model.prefix+model.extend.tableName:model.prefix+model.name;//数据表名
            $SYS.model[model.datasources][model.name]=$DB[model.datasources].define(model.name,model.model,model.extend);//缓存定义模型数据
        }
        if(dataSources[model.datasources].type=='mongoose'){//数据模型源类型
            if(!mongoose){mongoose = require('mongoose');Schema = mongoose.Schema;}
            let curSchema=new Schema(model.model,model.extend);
            if(model.schema)$F._.extend(curSchema,model.schema);//合并方法
            $SYS.model[model.datasources][model.name]=$DB[model.datasources].model(model.name,curSchema);//缓存定义模型数据
        }
        if(model['_after']){//存在模型处理
            modelsAfter.push({
                datasources:model.datasources,
                '_after':model['_after']
            });
        }
    }
    if($C.db_open) {

        $F._.each(modelsAfter, function (el, key) {
            el['_after']($SYS.model[el.datasources]);
        });

        let sYncmodel=0;
        $F._.each(dataSources, async function (el, key) {
            if (el.type == 'sequelize' && el.sync){
                if($C.install_check){ $DB[key].addHook('afterSync', function () {
                    sYncmodel++;
                    callInstall();
                });}
                $DB[key].sync({});
            }
            //同步数据表
        });

        //执行安装
        if($C.install_check){callInstall();}

        function callInstall() {//执行安装文件
            if(sYncmodel==sequelizeModelNum)$F._.each(installArr, async function (el, key) {
                await require(el+'index')();//安装
                //生成lock文件，避免重复安装
                fs.writeFile(el+'lock','',(err) => {
                    if (err) throw err;
                });
            });
        }
    }

};