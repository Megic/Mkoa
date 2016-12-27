module.exports = function(app){
    let fs = require('fs');
    let commonLangs={},moduleLangs={};//缓存使用的语言
    app.use(async (ctx, next) => {
        let lang=ctx.cookies.get($C.lang_cookie);//获取当前请求语言cookies
        if(!lang)lang=$C.lang_default;
        ctx.lang=lang;
        await next();
    });
    //设置语言数据
    $SYS.getLangs=function($this,lang){
        //公共配置
        if(!commonLangs[lang]){
            let commonpath=$C.ROOT + '/' + $C.application + '/common/'+$C.langs+'/'+lang;
            if (fs.existsSync(commonpath+'.js')){//存在公共语言文件
                commonLangs[lang]=require(commonpath);
            }else{
                commonLangs[lang]={};
            }
        }
        //当前模块配置
        if(!moduleLangs[$this.moudle+lang]){
            let mdpath=$this.modulePath+$C.langs+'/'+lang;
            if (fs.existsSync(mdpath+'.js')){//存在公共语言文件
                moduleLangs[$this.moudle+lang]=require(mdpath);
            }else{
                moduleLangs[$this.moudle+lang]={};
            }
        }
        $this.langs={};
        $F._.extend($this.langs,commonLangs[lang]);
        $F._.extend($this.langs,moduleLangs[$this.moudle+lang]);
    };

};
