/**
 * Created by Administrator on 2016/12/25.
 */
module.exports ={
        '_before':async function ($this){},
        '_after':async function ($this,error){//可以自行对错误信息进行处理或者加工数据$this.POST,$this.GET
           // $this.body=error;
        },
        'normal':{
            method:'GET',//默认为POST   GET/POST
            sanitizeFirst:true,//先转换再校验，默认为先校验后转换
            rules:{name:'required|integer'},//校验
            sanitization:{name:'to_int'},//转换
            messages:{}//提示
        }
};