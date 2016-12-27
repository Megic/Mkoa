module.exports = function(app){
    let fs = require('fs');
    let path = require('path');
//===================系统错误处理===================
    async function displayError($this,code,msg){
        if(fs.existsSync(path.join($C.ROOT,$C.application,'common',$C.views,code+'.'+$C.view_ext))&&$this.display){//存在错误处理方式
           await $this.display('common:'+code);
        }else{
            $this.body = {error:code, data:msg}; //输出错误
        }
    }
    async function errHandler(e,$this) {
        let msg='systemError';
        if(!$C.loger_config){msg= e.message || e.name || e; console.log(e);}
        let code=500;
        if(e.message==404){code=$this.status;}
        await displayError($this,code,msg);
    }
    app.use(async (ctx, next) => {
        try {
            await next(); // next is now a function
        } catch (err) {
            return errHandler(err,ctx);
        }
    });

};
