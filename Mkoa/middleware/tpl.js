module.exports = function(app){
    var  baseRender = require('koa-ejs')//ejs模板解析
        , json = require('koa-json');//json输出
    /////////////////////////////////////////////////静态文件处理///////////////////////////
    //定义模板
    baseRender(app, {
        root: $C.ROOT,
        layout: false,
        viewExt: 'html',
        cache: false,
        debug: $C.logger
    });
    app.use($F.convert(json()));//json输出

};
