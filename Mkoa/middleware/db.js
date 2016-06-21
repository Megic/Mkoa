module.exports = function(app){
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
    var sequelize;
    if($C.sqlType==1){//sql
        sequelize = new SequelizeOBJ($C.mysql.dbName,$C.mysql.username,$C.mysql.password, {
            dialect: "mysql",
            host: $C.mysql.host,
            port: $C.mysql.port,
            logging: $C.logger?console.log:false
        });
    }
    if($C.sqlType==2){//postgres
        sequelize = new SequelizeOBJ($C.pgsql.dbName, $C.pgsql.username, $C.pgsql.password, {
            dialect: "postgres",
            host: $C.pgsql.host,
            port: $C.pgsql.port,
            logging: $C.logger ? console.log : false
        });
    }
    $SYS.sequelize = sequelize;
    global.$D = function (model){
        return sequelize.import($SYS.modelPath[model]);
    };//模型加载


    $F.transaction = function *(fn,options) {
        options=options?options:{};
        yield $SYS.sequelize.transaction(options,function (t) {
            return co(function *() {
                yield fn()
            });
        });
    };
};
