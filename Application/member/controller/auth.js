/**
 * Created by megic on 2015-06-11.
 */

module.exports = function($this,$M){
    var main={};
    main['_init']=function *(){//先执行的公共函数
        //console.log('公共头部');
    };
    main['_after']=function *(){//后行的公共函数
        //console.log('公共头部');
    };
    //****************************
    main['isUsed']=function *(){//判断用户已被使用
        var user = yield $M.D('member').findOne({where:{phone:$M.POST['phone']}});
        if (user) {
            $this.success(1);//已经登录
        }else{
            $this.success(0);//未注册
        }
    };//****************************
    main['checkLogin']=function *(){//判断用户是否已登录
        if ($this.session.member){
            //  console.log($M.USER);
            $this.success($this.session.member);//已经登录
        }else{
            $this.error(1);//未登录
        }
    };//****************************
    main['login']=function *(){//用户登录
      if($M.F.validate.cPhone($M.POST['phone'])) {
          $this.checkBody('password').sha1();
          if ($this.errors) {$this.body = {erro:'信息填写有误',data:$this.errors}; return;}//字段错误
          var user = yield $M.D('member').findOne({where:{phone:$M.POST['phone'], password: $M.POST['password']}},{ raw: true });
          if (user) {
              var userInfo={
                  id:user.id,
                  phone:user.phone,
                  nickname:user.nickname,
                  imageurl:user.imageurl,
                  groupid:user.groupid,
                  sitenumber:user.sitenumber
              };
              $this.session.member=userInfo;
              $this.success(userInfo);//登录成功
          } else {
              $this.error('手机或者密码不正确');//手机或者密码不正确
          }
      }else{
          $this.error('手机号码格式不正确');//手机号码格式不正确
      }
    };//****************************************************

    main['lgout']=function *(){//退出登录
        $this.session=null;
        $this.success();//退出成功
    };//*****************************************************

    main['register']=function *(){
        //if($M.POST.code==$this.session.code&&$M.F.validate.cPhone($M.POST.phone)) {//判断验证码及手机是否正确
        if($M.F.validate.cPhone($M.POST.phone)){//判断验证码及手机是否正确
            $this.checkBody('password').notEmpty('密码不能为空').len(5,20,'密码应在5-20个字符之间').sha1();
            if ($this.errors) {$this.body = {erro:3,data:$this.errors}; return;}//字段错误
            $this.session.code=0;
            var User = $M.D('member');
            var user = yield User.build({
                phone: $M.POST['phone'],
                password: $M.POST['password'],
                nickname: $M.POST['nickname'],
                groupid:$M.POST['groupid'],
                sitenumber:0
            }).save();
            if (user){
                var userInfo={
                    id:user.id,
                    phone:user.phone,
                    nickname:user.nickname,
                    imageurl:user.imageurl,
                    groupid:user.groupid,
                    sitenumber:user.sitenumber
                };
                $this.session.member=userInfo;
                $this.success(userInfo);//注册成功
            }else{
                $this.error('数据插入不正常');//数据插入不正常
            }
        }else{
                $this.error('手机号码或者验证码不正确！');//验证码不正确
        }
    };

    return main;
};