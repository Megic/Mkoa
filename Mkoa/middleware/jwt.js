module.exports = function(app){
      let jwt = require('jsonwebtoken');
    app.use(async (ctx, next) => {
          //加密
        ctx.jwtSign=function(data){
              return jwt.sign(data,$C.jwt_key,$C.jwt_sign_options);
        };
        //验证
        ctx.jwtVerify=function(){
            let token =  (ctx.request.query && ctx.request.query.access_token) ||(ctx.request.body && ctx.request.body.access_token) || ctx.headers['x-access-token'];
            return jwt.verify(token,$C.jwt_pem,$C.jwt_verify_options);
        };
        //刷新token
        ctx.jwtRefresh=function(){
            let token =  (ctx.request.query && ctx.request.query.refresh_token) ||(ctx.request.body && ctx.request.body.refresh_token) || ctx.headers['x-refresh-token'];
            return jwt.verify(token,$C.jwt_pem,$C.jwt_verify_options);
        };
        //获取用户信息
        ctx.getLoginInfo =async function(){
            if($C.getLoginInfoByToken){
                let res=await ctx.jwtVerify();
                return res.user;
            }else{
                return this.req.user;
            }
        };
        //验证用户组
        ctx.getCheckAuth =async function(role){
            let userInfo,status=false;
            if($C.getLoginInfoByToken){
                let res=await ctx.jwtVerify();
                userInfo= res.user;
            }else{
                userInfo=this.req.user;
            }
            if(userInfo&&userInfo.roles){//用户信息获取
                if(userInfo.roles.indexOf(role)>-1)status=true;
            }
            if(!status) {throw new Error('No auth');}
            return userInfo;
        };
        await next();
    });
};
