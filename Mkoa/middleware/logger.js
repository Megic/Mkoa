module.exports = function(app,$M){
    "use strict";
    //输出logger
    if ($M.C.logger) {
        var logger = require('koa-log4js');
        if($M.C.loggerType==1){
            app.use($M.convert(logger()));
        }
        if($M.C.loggerType==2){
            app.use($M.convert(logger($M.C.logerConfig)));
        }
    }
//===================系统错误处理===================
    app.use($M.convert(function*(next) {
        try {
            yield next
        } catch (e) {
            console.log('错误' + e);
            return this.body = {error: 500, data: e.message || e.name || e};//输出错误
        }
    }));

};
