module.exports = function(app,$M){
    $M.passport = require('koa-passport');
    var LocalStrategy = require('passport-local').Strategy;//���ص�¼
    $M.passport.use(new LocalStrategy(function (username, password, done){
        var where = {
            id:1
        };
       $M.D('ucenter:member').findOne({where: where}, {raw: true}).then(function (user) {
           done(null, false);
        });


    }));

    $M.passport.serializeUser(function(user, done) {//��¼�ɹ���ִ��
        done(null, user)
    });

    $M.passport.deserializeUser(function(user, done) {//�����¼��ÿ�η���ִ��
        done(null, user)
    });

    app.use($M.passport.initialize());
    app.use($M.passport.session());

    //app.use(function*(next) {
    //    //console.log('����ģ���м��');
    //    yield next;
    //});

};
