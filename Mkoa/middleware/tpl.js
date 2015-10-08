module.exports = function(app,$M){
    var  baseRender = require('koa-ejs')//ejs模板解析
        , json = require('koa-json');//json输出
    /////////////////////////////////////////////////静态文件处理///////////////////////////
    //定义模板
    baseRender(app, {
        root: $M.ROOT,
        layout: false,
        viewExt: 'html',
        cache: false,
        debug: true
    });
    app.use(json());//json输出

};
