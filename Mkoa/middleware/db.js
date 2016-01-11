module.exports = function(app,$M){
    var SequelizeOBJ = require('sequelize');//ORM框架
    /////////////////////////////////////////////////静态文件处理///////////////////////////
    //链接数据库
    var sequelize;
    if($M.C.sqlType==1){//sql
        sequelize = new SequelizeOBJ($M.C.mysql.dbName,$M.C.mysql.username,$M.C.mysql.password, {
            dialect: "mysql",
            host: $M.C.mysql.host,
            port: $M.C.mysql.port,
            logging: $M.C.logger?console.log:false
        });
    }
    if($M.C.sqlType==2){//postgres
        sequelize = new SequelizeOBJ($M.C.pgsql.dbName, $M.C.pgsql.username, $M.C.pgsql.password, {
            dialect: "postgres",
            host: $M.C.pgsql.host,
            port: $M.C.pgsql.port,
            logging: $M.C.logger ? console.log : false,
            autocommit: false,
            isolationLevel: 'REPEATABLE_READ',
            deferrable: 'NOT DEFERRABLE' // implicit default of postgres
        });
    }
    $M.sequelize = sequelize;
    $M.D = function (model) {
        var mdPath = $M.ROOT + '/' + $M.C.application + '/' + $M.moudle + '/' + $M.C.models + '/' + model;
        var _mdArr = model.split(':');
        if (_mdArr.length > 1) {
            //非当前模块模型
            mdPath = $M.ROOT + '/' + $M.C.application + '/' + _mdArr[0] + '/' + $M.C.models + '/' + _mdArr[1];
        }
        return sequelize.import(mdPath);
    };//模型加载

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
    $M.transaction = function *(fn) {
        yield $M.sequelize.transaction(function (t) {
            return co(function *() {
                yield fn()
            });
        });
    };
};
