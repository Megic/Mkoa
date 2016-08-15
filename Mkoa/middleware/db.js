module.exports = function(app){
    if($C['ormStore']['default']) {
        var SequelizeOBJ = require('sequelize');//ORM框架
        ////////////数据库事务支持
        var cls = require('continuation-local-storage');
        var co = require('co');
        var namespace;
        if (SequelizeOBJ.cls) {
            namespace = SequelizeOBJ.cls;
        } else {
            namespace = cls.createNamespace('koa-sequelize-transaction');
            SequelizeOBJ.cls = namespace;
        }
        /////////////////////////////////////////////////静态文件处理///////////////////////////
        //链接数据库
        $SYS.sequelizes = {};//sequelize链接组
        function buildSequelize(key) {//创建sequelize实例
            var linkOpts = $C['ormStore'][key];
            linkOpts.option || (linkOpts.option = {});
            linkOpts.option.logging = $C.logger ? console.log : false;
            return new SequelizeOBJ(linkOpts.database, linkOpts.username, linkOpts.password, linkOpts.option);
        }

        $SYS.getSequelize = function (key) {//返回sequelize实例
            if (!$SYS.sequelizes[key])$SYS.sequelizes[key] = buildSequelize(key);
            return $SYS.sequelizes[key];
        };
        $SYS.sequelize = $SYS.getSequelize('default');//默认链接

        global.$D = function (model, key) {
            if (!key)key = 'default';
            if (!$SYS.sequelizes[key])$SYS.sequelizes[key] = buildSequelize(key);
            var LoadModel = $SYS.sequelizes[key].import($SYS.modelPath[model]);
            if ($C.syncModel)LoadModel.sync();//同步数据表
            return LoadModel;
        };//模型加载
        $F.transaction = function *(fn, options) {//自动事务
            options = options ? options : {};
            var key = options.key ? options.key : 'default';
            yield $SYS.sequelize[key].transaction(options, function (t) {
                return co(function *() {
                    yield fn(t)
                });
            });
        };
    }
};
