module.exports = function(app,$M){
    $M.passport = require('koa-passport');
    var LocalStrategy = require('passport-local').Strategy;//本地登录
    $M.passport.use(new LocalStrategy(function (username, password, done){
        var where = {
            id:1
        };
       $M.D('ucenter:member').findOne({where: where}, {raw: true}).then(function (user) {
           done(null, false);
        });


    }));

    $M.passport.serializeUser(function(user, done) {//登录成功后执行
        done(null, user)
    });

    $M.passport.deserializeUser(function(user, done) {//如果登录了每次访问执行
        done(null, user)
    });

    app.use($M.passport.initialize());
    app.use($M.passport.session());

    //app.use(function*(next) {
    //    //console.log('测试模块中间件');
    //    yield next;
    //});

};
