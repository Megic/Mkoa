/**
 * Created by Megic
 */
module.exports = function($this,$M){
    return {
        _extend : 'blog/common',
        _init: function *() {//先执行的公共函数
                //console.log('公共头部');
          },
    sms:function *(){//获取注册验证码
        var erro=0;
        if($M.GET['phone']) {//号码是否存在
            var ok=$this.session.codeTime?false:true;//判断是否发过短信
            if(!ok){
                ok=(Math.round(new Date().getTime()/1000)-$this.session.codeTime)>40?true:false;//判断是否超过40秒
            }
            if(ok) {
                $this.session.codeTime=Math.round(new Date().getTime()/1000);//记录发短信时间
                $this.session.code=$M._.random(10000,99999);//生成验证码
                var result = yield $M.request({
                    uri: $M.C.sms,
                    method: 'POST',
                    form: {
                        mobile: $M.GET['phone'],
                        message: '您的验证码是: '+$this.session.code+' 【萌豆】'
                    }
                });
            }
        }else{erro='phone erro'}
        $this.body = { erro:erro}
    },//****************************
    checkLogin:function *(){//判断用户是否已登录
        if ($this.isAuthenticated()) {
          //  console.log($M.USER);
            $this.body ={ erro:0,data:$M.USER}; //已经登录
        }else{
            $this.body ={ erro:1};
        }
    },//****************************
    checkUser:function *(){//判断用户是否被注册
        var erro=1;
        if($M.GET['phone']) {
            var User = $M.D('User');
            var user = yield User.find({
                where: {
                    phone: $M.GET['phone']
                }
            });
            erro=(user==null)?0:1;
            //console.log(user);
        }
        $this.body = { erro:erro}
    },//****************************
        register:function *(){
        var erro= 0,data;
        //if($M.POST.code==$this.session.code&&$M.F.validate.cPhone($M.POST.phone)) {//判断验证码及手机是否正确
        if($M.F.validate.cPhone($M.POST.phone)) {//判断验证码及手机是否正确
            $this.session.code=0;
            var User = $M.D('User');
            var user = yield User.build({
                phone: $M.POST.phone,
                password: $M.F.encode.md5($M.POST.password),
                nickname: $M.POST.nickname,
                sex:$M.POST.sex
            }).save();
          if (!user)erro=1;
            data={
                id:user.id,
                user:{
                    id:user.id,
                    phone:user.phone,
                    nickname:user.nickname,
                    imageurl:user.imageurl
                },
                curBaby:user.curBaby
            };
          yield $this.logIn(data);
        }else{erro='验证码不正确';}
        $this.body = { erro:erro,data:data};
        },//***************************************************
        login:function *(){//用户登录
        yield $M.passport.authenticate('local', function*(err, user, info) {
            if (err) throw err
            if (user === false) {
                $this.body = { erro:'帐号或者密码错误！'}
            } else {
                yield $this.logIn(user);
                $this.body = {erro:0,data:user}
            }
        });
        },//***************************************************
        lgout:function *(){//退出登录
        $this.logout()
        $this.body = { erro:0}
        }//***************************************************
    }
}