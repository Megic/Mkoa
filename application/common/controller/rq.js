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
    action['tt']=async function (){
        console.log($this.POST,$this.GET);
        $this.body=$this.GET;
        //return false;
    };

    action['test']=async function (){
        let res=await $API.POST('serverName:common/rq/tt?name=1',{key:'334'});
       // console.log(res)
        $this.body=res;
    };

    return action;
};