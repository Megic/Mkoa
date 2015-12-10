/**
 * Created by Megic on 2015/11/25 0025.
 */
module.exports = function ($this, $M) {
    var main = {};
    main['_init'] = function *() {//先执行的公共函数
        //console.log('公共头部');
    };
    main['_after'] = function *() {//后行的公共函数
        //console.log('公共头部');
    };
    //****************************
    main['checkLogin']=function *(){//判断用户是否已登录
        if (this.isAuthenticated()){
            this.body ={ erro:0,data:this.req.user}; //已经登录
        }else{
            this.body ={ erro:1};
        }
    };//****************************
    //****************************
    main['login']=function *(){//用户登录
        yield $M.passport.authenticate('local', function*(err, user) {
            if (err) throw err;
            if (user === false) {
                $this.body = { erro:'帐号或者密码错误！'}
            } else {
                yield $this.logIn(user);
                $this.body = {erro:0,data:user}
            }
        });
    };//***************************************************
    main['lgout']=function *(){//退出登录
        this.logout();
        this.body = { erro:0}
    };//***************************************************

    return main;
};