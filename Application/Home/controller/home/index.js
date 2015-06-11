/**
 * Created by Megic
 */
module.exports = function($this,$M){
    var main={};
    main['_init']=function *(){//先执行的公共函数不会被缓存部分
   console.log('公共部分');
    };
    main['home']=function *(){
        console.log(22222);
        //$this.body = {erro: 1, data: '超级用户已经存在！'};
        var User = $M.D('User');
        var user = yield User.build({
            phone: 15521286592,
            password: $M.F.encode.md5('123456'),
            nickname:'哈2哈',
            sex:0
        }).save();
        yield $this.display('home',{user:'123'});
    };


    return main;
};