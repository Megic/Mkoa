module.exports = function(app){
    "use strict";
    //输出logger
        let logger = require('koa-log4js');
        if(!$C.loger_config){
            app.use($F.convert(logger()));
        }

        if($C.loger_config){
            app.use($F.convert(logger($C.loger_config)));
        }

};
