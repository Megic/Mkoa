module.exports = function(app){
    "use strict";
    //输出logger
    if ($C.logger) {
        var logger = require('koa-log4js');
        if($C.loggerType==1){
            app.use($F.convert(logger()));
        }
        if($C.loggerType==2){
            app.use($F.convert(logger($C.logerConfig)));
        }
    }

//===================系统错误处理===================
    function errHandler(e,$this) {
        console.log('错误'+e);
        return $this.body = {error: 500, data: e.message || e.name || e};//输出错误
    }
    app.use($F.convert(function*(next) {
        try {
            yield next
        } catch (e) {
            return errHandler(e,this);
        }
    }));

};
