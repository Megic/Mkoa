/**
 * Created by megic on 2015-06-11.
 */

module.exports = function($this,$M){
    var main={};
    main['_init']=function *(){//先执行的公共函数
        if(!$this.session.member){
            $this.error(1);//未登录
            return false;//跳过后面
        }else{
            $this.caching=false;
        }
    };
    main['_after']=function *(){//后行的公共函数
        //console.log('公共头部');
    };

    //****************************
    main['changePassword']=function *(){//修改密码
        $this.checkBody('oldpassword').notEmpty('密码不能为空').len(5,20,'密码应在5-20个字符之间').sha1();
        $this.checkBody('password').notEmpty('密码不能为空').len(5,20,'密码应在5-20个字符之间').sha1();
        if ($this.errors) {$this.body = {erro:3,data:$this.errors}; return;}//字段错误
        var res=yield $M.D('member').update({password:$M.POST['password']},{where:{id:$this.session.member.id,password:$M.POST['oldpassword']}});
console.log(res);
       if(res[0]) {
           $this.success();
       }else{
           $this.error('原密码错误!');
       }

    };//*****************************************************
    return main;
};