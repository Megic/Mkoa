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
        if(e.name=='TokenExpiredError'){code=403;}
        await displayError($this,code,msg);
    }
    app.use(async (ctx, next) => {
        try {
            await next(); // next is now a function
        } catch (err) {
            return errHandler(err,ctx);
        }
    });
    let timmer=0;
    //捕获异步异常,等待所有连接结束后终止程序
    process.on('uncaughtException', function (err) {
        timmer++;
        try {
            console.log(`捕获到第${timmer}次uncaughtException异常 `,err);
            if(timmer>$C.error_uncaught){
                console.log(`uncaughtException异常到达限制次数,30秒后终止进程...`);
                let killTimer = setTimeout(function () {
                    process.exit(1);
                }, 30000);
                killTimer.unref();
                $app.close();
            }
        } catch (e) {
            console.log('error when exit', e.stack);
        }
    })
};
