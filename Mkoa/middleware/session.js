module.exports = function(app){
    if($C.sessionStore.type) {
    var fs = require('fs')
        , session = require('koa-generic-session');
    /////////////////////////////////////////////////session///////////////////////////
    app.keys = [$C.secret];//session支持
    //session配置
        var sessionOptions = $C.sessionConfig;
        if ($C.sessionStore.type == 1) {
            var MysqlStore = require('koa-mysql-session');// mysql存储session
            sessionOptions['store'] = new MysqlStore($C.sessionStore.mysql);
        }
        if ($C.sessionStore.type == 2) {//使用PostgreSQL存储session
            var PgStore = require('Mkoa-pg-session');
            sessionOptions['store'] = new PgStore("postgres://" + $C.sessionStore.pgsql['username'] + ":" + $C.sessionStore.pgsql['password'] + "@" + $C.sessionStore.pgsql['host'] + ":" + $C.sessionStore.pgsql['port'] + "/" + $C.sessionStore.pgsql['database']);
            $SYS.pgSession = sessionOptions['store'];//pgSession 标记
        }

        if ($C.sessionStore.type == 3) {
            var MemStore = require('koa-memcached');// memcached存储session
            sessionOptions['store'] = new MemStore($C.sessionStore.memcached);
        }
        if ($C.sessionStore.type == 4) {
            var redisStore = require('koa-redis');// redis存储session
            sessionOptions['store'] = redisStore($C.sessionStore.redis);
        }
        $SYS.sessionStore = sessionOptions['store'];
        app.use($F.convert(session(sessionOptions)));
    }
/////////////////////////////////////////////////session.end///////////////////////////
};
