//sokie.io 使用
module.exports = function($M){

    $M.socketConnection=function(ctx){
        console.log('进入链接:'+ctx.socket.id);
    };
    $M.socketDisconnect=function(ctx){
        console.log('断开链接:'+ ctx.socket.id);
    };


    $M.socket.use($M.co.wrap(function *(ctx, next) {
        console.log('公共前置处理');
        yield next();//下一个中间件
    }));

    //$M.socket.use(co.wrap(function *(ctx, next) {
    //    console.log('soket中间件')
    //    yield next();//下一个中间件
    //    console.log('soket中间件返回')
    //}));

    //自定义sokie.io事件

    //$M.socket.on('data', (ctx, data) => {
    //    console.log('data event', data)
    //    console.log('ctx:', ctx.event, ctx.data, ctx.socket.id)
    //    console.log('ctx.teststring:', ctx.teststring)
    //    ctx.socket.emit('response', {
    //        message: '回复内容!'
    //    })
    //});
};
