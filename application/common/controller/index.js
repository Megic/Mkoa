/**
 * Created by Administrator on 2016/12/23.
 */
module.exports = function($this){
    let action={};
    action['_before']=async function (){
       // console.log('xxx');
        //return false;
    };
    action['_after']=async function (){
        // console.log('xxx');
        //return false;
    };
    action['Generator']=function *(){
        // let list=yield $D('user').findOne({raw:true});
        // console.log(list)
        // return $this.display(list);
      //  $this.body='Generator!'
    };
    action['normal']=function (){
        // return $D('user').findOne({raw:true}).then(function(user){
        //     console.log(user)
        //     return $this.display();
        // });
       // console.log('xxxx')
      //  $this.body='normal';
        // await $this.render('user.jade');
        //$this.error('不错!');
    };
    action['async']=async function (){
        await  $ST['default'].destroyContainer('userinfo',function(){
            console.log('xx2')
        });
        console.log('xx1')
      // //  let list=await $D('user').findOne({raw:true});
      //   await $D('user').create({name:'123'});
      //  // console.log(list)
      //  console.log('xxx222')
      //   $this.cachettl=50;
      //   await $this.display();
    };
    action['upload']=async function (){
        await $ST['default'].upload($this,'user');//接收上传文件
        console.log($this.POST)
        $this.body=$this.POST;
    };
    return action;
};