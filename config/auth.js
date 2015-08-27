/**
 * Created by Megic 2014.11.18
 * koa-passport  配置
 */
module.exports=function ($M){
        var LocalStrategy = require('passport-local').Strategy;//本地登录
        $M.passport.use(new LocalStrategy(function(username, password, done){
          var User = $M.D('User');
          User.find({
            where: $M.sequelize.or(//查找phone或者email
              {phone:username},
              {email:username}
            )
          }).success(function (user){
          if (user&&$M.F.encode.md5(password) == user.password) {//判定密码是否正确
            done(null,{
                id:user.id,
                user:{
                    id:user.id,
                    phone:user.phone,
                    nickname:user.nickname,
                    imageurl:user.imageurl
                },
                curBaby:user.curBaby
            })
          } else {
            done(null, false)
          }
          });
        }));

      $M.passport.serializeUser(function(user, done) {//登录成功后执行
          done(null, user)
        })

        $M.passport.deserializeUser(function(user, done) {//如果登录了每次访问执行
          done(null, user)
        })
        
}