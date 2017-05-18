module.exports = function(app){
    "use strict";
    //输出logger
    const log4js = require('./logger/index');
    let config={
        appenders: [{type: 'console'}],
        replaceConsole: true
    };
    if($C.loger_config){
        if($C.loger_config.file){
            config={
                appenders: [
                    {
                        type: 'console'
                    },
                    {
                        type: 'file',
                        filename: $C.loger_config.file,
                        maxLogSize: $C.loger_config.size || 10*1024*1024,
                        backups: $C.loger_config.backups || 4,
                        category: [ 'http','console' ]
                    }
                ],
                replaceConsole: true
            };
        }else{config=$C.loger_config}

    }
    log4js.configure(config);
    app.use(log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' }));



};
