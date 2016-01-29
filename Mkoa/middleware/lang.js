module.exports = function(app){
 var fs = require('fs');
var commonLangs={},moduleLangs={};//缓存使用的语言
    app.use($F.convert(function*(next) {
        var lang=this.cookies.get($C.cookie_locale);//获取当前请求语言cookies
        if(!lang)lang=$C.defaultLang;
        this.lang=lang;
        yield next;
    }));
    //设置语言数据
    $SYS.getLangs=function($this,lang){
        //公共配置
        if(!commonLangs[lang]){
            var commonpath=$C.ROOT + '/' + $C.application + '/common/'+$C.langs+'/'+lang;
            if (fs.existsSync(commonpath+'.js')){//存在公共语言文件
                commonLangs[lang]=require(commonpath);
            }else{
                commonLangs[lang]={};
            }
        }
        //当前模块配置
        if(!moduleLangs[lang]){
            var mdpath=$this.modulePath+$C.langs+'/'+lang;
            if (fs.existsSync(mdpath+'.js')){//存在公共语言文件
                moduleLangs[lang]=require(mdpath);
            }else{
                moduleLangs[lang]={};
            }
        }
        $this.langs={};
        $F._.extend($this.langs,commonLangs[lang]);
        $F._.extend($this.langs,moduleLangs[lang]);
    };

};
