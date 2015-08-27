/**
 * Created by megic on 2015-06-11.
 */

module.exports = function($this,$M){
    var main={};
    main['_init']=function *(){//先执行的公共函数不会被缓存部分
    };
    main['_after']=function *(){//后行的公共函数
        //console.log('公共头部');
    };

    main['add']=function *(){
        var mInfo = $M.D('memberInfo');
        var info;
        var count = yield mInfo.count({//是否已经存在记录
            where: {
                mid:$this.session.member.id
            }
        });
       if(count){//存在就更新数据
           info= yield mInfo.update({info:$M.POST},{where:{ mid:$this.session.member.id}});
       }else{
          info = yield mInfo.build({
               mid:$this.session.member.id,
               info:$M.POST
           }).save();
       }
        if(info){
            $this.success();//写入成功
        }else{
            $this.error('写入失败');//手机或者密码不正确
        }
    };
    main['find']=function *(){
        var info = yield $M.D('memberInfo').findOne({where:{mid:$this.session.member.id}},{raw:true});
        if(info){
            $this.success(info.info);//存在信息
        }else{
            $this.error(1);//没有信息
        }

    };
    return main;
};