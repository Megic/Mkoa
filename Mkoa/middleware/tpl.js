module.exports = function(app){
    /////////////////////////////////////////////////静态文件处理///////////////////////////
    let views = require('koa-views');
    app.use(views($C.ROOT, {
      //  viewExt: 'html',
        map: {
            html:$C.view_engine
        }
    }));


};
