module.exports = function(app){
    let send = require('koa-send')
        ,fs = require('fs')
        , statics = require('koa-static');//静态服务器
    /////////////////////////////////////////////////静态文件处理///////////////////////////
    //设置默认访问路径/输出模块静态文件夹内容
    app.use($F.convert(function *(next) {
        if (this.request.path == '/' && $C.defaultPath)this.request.path = $C.defaultPath;//设置默认访问路径
        let _pathArr = this.request.path.split('/');
        let file = $C.application + this.request.path;
        if (_pathArr[2] == $C.static_pathName && _pathArr.length > 3 && fs.existsSync($C.ROOT + '/' + file)) {
            yield send(this, file);
        } else {
            yield next;
        }

    }));
    app.use(statics($C.ROOT+'/'+$C.static_pathName+'/', $C.static_config));//定义静态文件路径


};
