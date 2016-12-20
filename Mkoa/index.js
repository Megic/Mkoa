/**
 * Created by Megic 2014.11.18
 */
/**
 *
 * @param options 配置信息
 */
module.exports = function (options) {
    let root=options.root;//项目根目录
    let mpath=__dirname;
    let path = require('path')
        , fs = require('fs-extra');//扩展文件夹等操作
//=================================全局对象====================================================//
    global.$M={};global.$S={};global.$F={};global.$C={};global.$SYS={};//定义全局变量
    //首次启动创建默认文件夹
    // if(!fs.existsSync(root + '/config')){//首次启动
    //     console.log('首次启动，正在初始化...');
    //     fse.copySync(mpath+'/tpl/',root);
    // }
    $F._ = require('underscore');//辅助函数
    //配置信息获取
    //=================================配置信息====================================================//
    let sysConfig = require(mpath + '/config');
    let configCache={};//配置缓存
    sysConfig.configTag=options.env;
    sysConfig.U=function(urlStr){//获取配置文件地址，处理tag情况
        if(!urlStr){console.log('配置文件不正确!');return{};}
        if(!$C.delcontrollerCache&&configCache[urlStr])return configCache[urlStr];//读取缓存
        let urlTag=sysConfig.configTag?sysConfig.configTag+'/':'';
        let urlArr = urlStr.split(':');
        let firestPath=root + '/config/';//默认调用根目录公共配置文件
        if (urlArr.length > 1){
            firestPath=root  + '/' + $C.application + '/' + urlArr[0]+'/config/';
            urlStr=urlArr[1];
        }
        let resPath=firestPath+urlTag+urlStr;
        let curPath=(urlTag&&(fs.existsSync(resPath)||fs.existsSync(resPath+'.js')))?resPath:(firestPath+urlStr);
        if($C.delcontrollerCache)delete require.cache[require.resolve(curPath)];//删除缓存
        configCache[urlStr]=require(curPath);//获取配置信息
        return configCache[urlStr];
    };
    let userConfig = sysConfig.U('config');//获取全局配置
    $F._.extend(sysConfig, userConfig);//合并默认配置
    $C = sysConfig;
    //=================================F函数====================================================//
    $F.co=require('co');
    $F.convert = require('koa-convert');//koa 旧风格中间件转换
    $F.moment = require('moment');//时间格式化
    $F.moment.locale($C.defaultLang); //默认中文时间
    let sysFn = require(mpath + '/functions/init')(mpath);
    $F._.extend($F, sysFn); //整合系统方法
    let koa= require('koa'),app;
    app = new koa();
    app.proxy=$C.proxy;
};