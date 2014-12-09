/**
 * Created by Megic
 */
module.exports = function($this,$M){
    return {
        _extend : 'blog/common',
        _init: function * () {//先执行的公共函数
                console.log('公共头部');
          },
        register:function *(){
        var User = $M.D('User');
        var user = yield User.build({
                 phone: $M.POST.phone,
                password: $M.F.encode.md5($M.POST.password)
                }).save();
        if(user) {
            console.log($this.login);
            yield $this.login(user.dataValues);
            console.log(user.dataValues);
            $this.redirect('/home/auth/home');
        }
        },//***************************************************
        login:function *(){
        yield $M.passport.authenticate('local', {
            successRedirect: '/home/auth/home',
            failureRedirect: '/home/auth/index'
          })
        },//***************************************************
        lgout:function *(){
        $this.logout()
        }//***************************************************
    }
}