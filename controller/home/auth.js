/**
 * Created by Megic
 */
module.exports = function($this,$M){
    return {
        _extend : 'blog/common',
        _init: function * () {//先执行的公共函数
                console.log('呵呵');
          },
        index:function *(){
            // var User = $M.D('User');
            // $this.session['xx']=null;
  // yield sequelize.sync({ force: true });
// var user = yield User.build({
//   name: '321',
//   ip: '117.0.0.1'
// }).save();
// $this.checkQuery('name').empty().len(2,20,"bad name.").trim().toLow().md5() ;
// $this.checkQuery('kname').len(2,20,"bad name.").trim().toLow().md5() ;
// if ($this.errors) {
//         $this.body = $this.errors;
//         return ;
//     }

  // console.log($this.csrf);
    // $this.body = $this.query;
    console.log($M.FILES);
      yield  $this.render('login',{csrf:$this.csrf});
        } ,//***************************************************
        home:function *(){
            console.log($M.USER);
            if ($this.isAuthenticated()) {
                $this.body ={ success:'已经登录'};
            }else{
               $this.body ={ success:'未登录' };
            }
        },//***************************************************
        login:function *(){
        // yield $M.passport.authenticate('local', {
        //     successRedirect: '/home/auth/home',
        //     failureRedirect: '/home/auth/index'
        //   })
        yield $M.passport.authenticate('local', function*(err, user, info) {
            if (err) throw err
            if (user === false) {
              $this.status = 401
              $this.body = { success: false }
            } else {
              yield $this.logIn(user);
              $this.body = { success: true }
            }
          });
        },//***************************************************
        sms:function *(){
            console.log(1);
            var result = yield $M.request({
            uri:$M.C.sms,
            method: 'POST',
            form:{
                 mobile:'15521286598',
                 message:'您的验证码是: 321123 【萌豆】'
            }
          });
            console.log(result);
        },//**
        reg:function *(){
        yield  $this.render('reg',{csrf:$this.csrf});
        },//***************************************************
        lgout:function *(){
        $this.logout()
        $this.body = { success: '退出' }
        }//***************************************************
    }
}