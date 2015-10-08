module.exports = function(app,$M){
    "use strict";
    //输出logger
    if ($M.C.logger) {
        var logger = require('koa-logger');
        app.use(logger());
    }
//===================系统错误处理===================
    app.use(function*(next) {
        try {
            yield next
        } catch (e) {
            console.log('错误' + e);
            return this.body = {error: 500, data: e.message || e.name || e};//输出错误
        }
    });

};
