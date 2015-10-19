module.exports = function(app,$M){
    var send = require('koa-send')
        ,fs = require('fs')
        , statics = require('koa-static');//静态服务器
    /////////////////////////////////////////////////静态文件处理///////////////////////////
    //app.use(favicon($M.ROOT + '/favicon.ico'));//favicon处理
    //设置默认访问路径/输出模块静态文件夹内容
    app.use(function *(next) {

        if (this.request.path == '/' && $M.C.defaultPath)this.request.path = $M.C.defaultPath;//设置默认访问路径
        var _pathArr = this.request.path.split('/');
        var file = $M.ROOT + '/' + $M.C.application + this.request.path;
        if (_pathArr[2] == $M.C.static && _pathArr.length > 3 && fs.existsSync(file)) {
            yield send(this, file);
        } else {
            yield next;
        }

    });
    app.use(statics($M.C.staticpath, {maxAge: 365 * 24 * 60 * 60, buffer: true}));//定义静态文件路径


};
