module.exports = function(app){
    var  json = require('koa-json');//json输出
    /////////////////////////////////////////////////静态文件处理///////////////////////////
    var views = require('koa-views');
    app.use($F.convert(views($C.ROOT, {
      //  viewExt: 'html',
        map: {
            html:$C.defaultTPL
        }
    })));

    app.use($F.convert(json()));//json输出

};
