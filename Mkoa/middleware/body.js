let buddy = require('co-body');
let localStorage = require('../lib/storage-filesystem');

module.exports = function(app){
    app.use(requestbody($C.body_config));//body中间件
    //存储服务编写
    let storages = $C['U']('storages');
    $F._.each(storages,function(el, key){
        if(el.type=='filesystem'){//创建本地存储服务
            $ST[key]=localStorage(el.options);
        }else{
            $ST[key]=require(el.type)(el.options);//其他的加载服务
        }
    });
};




/**
 *
 * @param {Object} options
 * @see https://github.com/dlau/koa-body
 * @api public
 */
function requestbody(opts) {
    opts = opts || {};
    opts.onError = 'onError' in opts ? opts.onError : false;
    opts.multipart = 'multipart' in opts ? opts.multipart : false;
    opts.urlencoded = 'urlencoded' in opts ? opts.urlencoded : true;
    opts.json = 'json' in opts ? opts.json : true;
    opts.text = 'text' in opts ? opts.text : true;
    opts.encoding = 'encoding' in opts ? opts.encoding : 'utf-8';
    opts.jsonLimit = 'jsonLimit' in opts ? opts.jsonLimit : '1mb';
    opts.formLimit = 'formLimit' in opts ? opts.formLimit : '56kb';
    opts.textLimit = 'textLimit' in opts ? opts.textLimit : '56kb';
    opts.strict = 'strict' in opts ? opts.strict : true;

    return function (ctx, next) {
        let bodyPromise;
        // so don't parse the body in strict mode
        if (!opts.strict || ["GET", "HEAD", "DELETE"].indexOf(ctx.method.toUpperCase()) === -1) {
            try {
                if (opts.json && ctx.is('json')) {
                    bodyPromise = buddy.json(ctx, {
                        encoding: opts.encoding,
                        limit: opts.jsonLimit
                    });
                } else if (opts.urlencoded && ctx.is('urlencoded')) {
                    bodyPromise = buddy.form(ctx, {
                        encoding: opts.encoding,
                        limit: opts.formLimit
                    });
                } else if (opts.text && ctx.is('text')) {
                    bodyPromise = buddy.text(ctx, {
                        encoding: opts.encoding,
                        limit: opts.textLimit
                    });
                }
                // else if (opts.multipart && ctx.is('multipart')) {
                //     bodyPromise = formy(ctx, opts.formidable);
                // }
            } catch (parsingError) {
                if (typeof opts.onError === 'function') {
                    opts.onError(parsingError, ctx);
                } else {
                    throw parsingError;
                }
            }
        }

        bodyPromise = bodyPromise || Promise.resolve({});
        return bodyPromise.then(function(body) {
                ctx.request.body = body;
            return next();
        })
            .catch(function(parsingError) {
                if (typeof opts.onError === 'function') {
                    opts.onError(parsingError, ctx);
                } else {
                    throw parsingError;
                }
                return next();
            })
    };
}
