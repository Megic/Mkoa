module.exports = function(app,$M){
    var send = require('koa-send')
        ,fs = require('fs')
        , statics = require('koa-static');//静态服务器
    /////////////////////////////////////////////////静态文件处理///////////////////////////
    //app.use(favicon($M.ROOT + '/favicon.ico'));//favicon处理
    //设置默认访问路径/输出模块静态文件夹内容
    app.use($M.convert(function *(next) {

        if (this.request.path == '/' && $M.C.defaultPath)this.request.path = $M.C.defaultPath;//设置默认访问路径
        var _pathArr = this.request.path.split('/');
        var file = $M.C.application + this.request.path;
        if (_pathArr[2] == $M.C.staticName && _pathArr.length > 3 && fs.existsSync($M.ROOT + '/' + file)) {
            yield send(this, file);
        } else {
            yield next;
        }

    }));
    app.use($M.convert(statics($M.C.staticpath, {maxAge: 365 * 24 * 60 * 60, buffer: true})));//定义静态文件路径


};
