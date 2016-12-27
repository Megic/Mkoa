module.exports = function(app){
    let datasources = $C['U']('datasources');
    let store=$DB[$C.session_store];
    if(store) {
    let fs = require('fs')
        , session = require('koa-generic-session');
    /////////////////////////////////////////////////session///////////////////////////
    //session配置
        let sessionOptions = $C.session_config;

        if (datasources[$C.session_store].type=='sequelize') {
            const SequelizeStore = require('koa-generic-session-sequelize');
            sessionOptions['store'] = new SequelizeStore(store,$C.session_store_config);
        }

        // if ($C.sessionStore.type == 2) {//使用PostgreSQL存储session
        //     let PgStore = require('Mkoa-pg-session');
        //     sessionOptions['store'] = new PgStore("postgres://" + $C.sessionStore.pgsql['username'] + ":" + $C.sessionStore.pgsql['password'] + "@" + $C.sessionStore.pgsql['host'] + ":" + $C.sessionStore.pgsql['port'] + "/" + $C.sessionStore.pgsql['database']);
        //     $SYS.pgSession = sessionOptions['store'];//pgSession 标记
        // }

        // if ($C.sessionStore.type == 3) {
        //     let MemStore = require('koa-memcached');// memcached存储session
        //     sessionOptions['store'] = new MemStore($C.sessionStore.memcached);
        // }
        // if ($C.sessionStore.type == 4) {
        //     let redisStore = require('koa-redis');// redis存储session
        //     sessionOptions['store'] = redisStore($C.sessionStore.redis);
        // }

        $SYS.sessionStore = sessionOptions['store'];
        app.use($F.convert(session(sessionOptions)));
    }
/////////////////////////////////////////////////session.end///////////////////////////
};
