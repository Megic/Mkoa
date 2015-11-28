module.exports = function(app,$M){
    var fs = require('fs')
        , session = require('koa-generic-session');
    /////////////////////////////////////////////////session///////////////////////////
    app.keys = [$M.C.secret];//session支持
    //session配置
    var sessionOptions = {
        key: 'Mkoa:sid',
        prefix: 'Mkoa:sess:',
        rolling: false,
        cookie: {
            maxage: $M.C.maxAge
        }
    };
    if ($M.C.sessionType == 1) {//使用PostgreSQL存储session
        var PgStore = require('koa-pg-session');
        sessionOptions['store']=new PgStore("postgres://" + $M.C.pgsql['username'] + ":" + $M.C.pgsql['password'] + "@" + $M.C.pgsql['host'] + ":" + $M.C.pgsql.port + "/" + $M.C.pgsql['dbName']);
    }
    if ($M.C.sessionType == 3) {
        var MysqlStore = require('koa-mysql-session');// mysql存储session
        sessionOptions['store']=new MysqlStore({
            user: $M.C.mysql.user,
            password: $M.C.mysql.password,
            database: $M.C.mysql.dbName,
            host: $M.C.mysql.host
        });
    }
    if ($M.C.sessionType == 2) {
        var MemStore = require('koa-memcached');// memcached存储session
        sessionOptions['store']=new MemStore($M.C.memcached);
    }
    if ($M.C.sessionType == 4) {
        var redisStore = require('koa-redis');// redis存储session
        sessionOptions['store']=redisStore($M.C.redis);
    }
    //app.use(session(sessionOptions));
    if($M.C.openSocket){//是否开启socket.io
        app.session(sessionOptions);
    }else{
        app.use(session(sessionOptions));
    }
/////////////////////////////////////////////////session.end///////////////////////////
};
