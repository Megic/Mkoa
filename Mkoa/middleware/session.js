module.exports = function(app){
    var fs = require('fs')
        , session = require('koa-generic-session');
    /////////////////////////////////////////////////session///////////////////////////
    app.keys = [$C.secret];//session支持
    //session配置
    var sessionOptions = {
        key: 'Mkoa:sid',
        prefix: 'Mkoa:sess:',
        rolling: false,
        cookie: {
            maxage: $C.maxAge
        }
    };
    if ($C.sessionType == 1) {
        var MysqlStore = require('koa-mysql-session');// mysql存储session
        sessionOptions['store']=new MysqlStore({
            user: $C.mysql.username,
            password: $C.mysql.password,
            database: $C.mysql.dbName,
            host: $C.mysql.host
        });
    }
    if ($C.sessionType == 2) {//使用PostgreSQL存储session
        var PgStore = require('koa-pg-session');
        sessionOptions['store']=new PgStore("postgres://" + $C.pgsql['username'] + ":" + $C.pgsql['password'] + "@" + $C.pgsql['host'] + ":" + $C.pgsql.port + "/" + $C.pgsql['dbName']);
        $SYS.pgSession=sessionOptions['store'];//pgSession 标记
    }
    if ($C.sessionType == 3) {
        var MemStore = require('koa-memcached');// memcached存储session
        sessionOptions['store']=new MemStore($C.memcached);
    }
    if ($C.sessionType == 4) {
        var redisStore = require('koa-redis');// redis存储session
        sessionOptions['store']=redisStore($C.redis);
    }
    $SYS.sessionStore=sessionOptions['store'];
   app.use($F.convert(session(sessionOptions)));
/////////////////////////////////////////////////session.end///////////////////////////
};
