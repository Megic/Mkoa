module.exports = function(app){
      let jwt = require('jsonwebtoken');
    app.use(async (ctx, next) => {
          //加密
        ctx.jwtSign=function(data){
              return jwt.sign(data,$C.jwt_key,$C.jwt_sign_options);
        };
        ctx.jwtVerify=function(){
            let token =  (ctx.request.query && ctx.request.query.access_token) ||(ctx.request.body && ctx.request.body.access_token) || ctx.headers['x-access-token'];
            return jwt.verify(token,$C.jwt_pem,$C.jwt_verify_options);
        };
        ctx.jwtRefresh=function(){
            let token =  (ctx.request.query && ctx.request.query.refresh_token) ||(ctx.request.body && ctx.request.body.refresh_token) || ctx.headers['x-refresh-token'];
            return jwt.verify(token,$C.jwt_pem,$C.jwt_verify_options);
        };
        await next();
    });
};
