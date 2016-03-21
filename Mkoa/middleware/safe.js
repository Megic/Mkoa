module.exports = function(app){
    var  koaBody = require('koa-body');//Post处理
    //app.use(cors());


    app.use($F.convert(koaBody({
        multipart: true,
        formLimit: $C.formLimit,
        formidable: {uploadDir:$C.uploadDir,keepExtensions: false, maxFieldsSize: parseInt($C.maxFieldsSize), multiples: false}
    })));//body中间件

    if ($C.csrf) {//开启csrf
        var csrf = require('koa-csrf');//csrf
        csrf(app);
        app.use(csrf.middleware);
    }

};
