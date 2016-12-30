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
    action['pr']=async function (){
        let res=await $this.proxy('http://localhost:3000/common/rq/tt?name=1');
        console.log(res);
        $this.body=res;
        //return false;
    };
    action['tt']=async function (){
      //  console.log($this.POST,$this.GET);
        $this.body=$this.GET;
        //return false;
    };
    action['img.jpg']=async function (){
        await this.fetch('http://avatars.githubusercontent.com/u/1962352?v=3 ');
       // $this.body=1;
        //console.log($this.status)
    };
    action['test']=async function (){
        let res=await $API.POST('serverName:common/rq/tt?name=1',{key:'334'});
       // console.log(res)
        $this.body=res;
    };

    return action;
};