//sokie.io 使用
module.exports = function(app,$M){
    // middleware for connect and disconnect
    app.io.use(function* (next){
        // 用户链接
        //可用this.session配合判断是否登录
        console.log('建立链接');
        //console.log(this.headers)
        yield* next;
        console.log('断开链接');
        // 断开链接
        //    // 通知所有连接客户端
        //    this.broadcast.emit('user left', {
        //        username: this.username,
        //        numUsers: numUsers
        //    });

    });
    //自定义sokie.io事件
    //app.io.route('chat message', function* (next, msg) {
    //    console.log('22');
    //    this.emit('chat message', msg);//通知链接端
    //    this.broadcast.emit('chat message',msg);//通知所有连接客户端
    //})
};
