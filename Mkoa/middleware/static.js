module.exports = function(app){
    var send = require('koa-send')
        ,fs = require('fs')
        , statics = require('koa-static');//静态服务器
    /////////////////////////////////////////////////静态文件处理///////////////////////////
    //设置默认访问路径/输出模块静态文件夹内容
    app.use($F.convert(function *(next) {
        if (this.request.path == '/' && $C.defaultPath)this.request.path = $C.defaultPath;//设置默认访问路径
        var _pathArr = this.request.path.split('/');
        var file = $C.application + this.request.path;
        if (_pathArr[2] == $C.staticName && _pathArr.length > 3 && fs.existsSync($C.ROOT + '/' + file)) {
            yield send(this, file);
        } else {
            yield next;
        }

    }));
    app.use($F.convert(statics($C.staticpath, {maxAge: 365 * 24 * 60 * 60, buffer: true})));//定义静态文件路径


};
