module.exports = function(app){
    var fs = require('fs')
        ,fscp = require('co-fs-plus')
        ,Cache = require('../lib/fileCache');//文件夹等操作;
    ///////////////////////缓存中间件/////////////////////////

    //返回或创建缓存文件夹
    $F.getCachePath = function *(curPath) {
        var newPath = $C.cachepath + '/' + curPath;
        if (fs.existsSync(newPath) || (yield fscp.mkdirp(newPath, '0755'))) {//判定文件夹是否存在
            return curPath;
        }
    };
    app.use($F.convert(function*(next) {
        var path = 'file';
        var getPath = encodeURIComponent(this.request.query['$cachePath']);//get参数存在mkoa_cachePath 使用其作为缓存文件夹
        if (getPath != 'undefined')path = yield $F.getCachePath(getPath);
        this.cacheName = encodeURIComponent(this.originalUrl);//缓存文件名
        this.cacheName = path + '/' + this.cacheName;
        this.caching = $C.iscache;
        yield next;
        //console.log(this.caching);
    }));//获取缓存配置

    app.use($F.convert(Cache({folder: $C.cachepath + '/', cacheTime: $C.cacheTime, type: 'html'})));


};
