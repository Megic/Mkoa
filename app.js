/**
 * Created by Administrator on 2016/12/19.
 */

require('./Mkoa/index')({
    root:__dirname,//根目录
    env:process.env.NODE_ENV?process.env.NODE_ENV:'development'//配置环境
});

//
// let koa = require('koa');
// let co = require('co');
// const app = new koa();
//
// let sleep = function (time) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             resolve();
//         }, time);
//     })
// };
// let cc={
//     l1:function(){
//         console.log('hhhh1')
//     },
//     l2:function *(){
//         console.log('start');
//         yield sleep(3000);
//         console.log('end');
//     },
//     l3:async function(){
//         console.log('start');
//         await sleep(3000);
//         console.log('end');
//     }
// };
//
// // logger
//
// app.use(async (ctx, next) => {
//     try {
//         await next(); // next is now a function
//     } catch (err) {
//         ctx.body = { message: err.message };
//         ctx.status = err.status || 500;
//     }
// });
// //console.log(cc.l1.constructor.name)
// app.use(async ctx => {
//     //await cc.l2();
//     await co.wrap(function *(){
//         yield cc.l2();
//     })();
//     // console.log(cc.l3)
//     console.log(ctx);
//     let ss= await cc.l3();
//     // const user = await User.getById(ctx.session.userid); // await instead of yield
//     // ctx.body = user; // ctx instead of this
// });

// app.listen(3000);