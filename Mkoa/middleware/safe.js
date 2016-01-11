module.exports = function(app,$M){
    var  koaBody = require('koa-body');//Post处理
    //app.use(cors());


    app.use($M.convert(koaBody({
        multipart: true,
        formLimit: $M.C.formLimit,
        formidable: {keepExtensions: false, maxFieldsSize: parseInt($M.C.maxFieldsSize), multiples: false}
    })));//body中间件

    if ($M.C.csrf) {//开启csrf
        var csrf = require('koa-csrf');//csrf
        csrf(app);
        app.use(csrf.middleware);
    }

};
