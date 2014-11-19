/**
 * Created by Megic
 */
module.exports = function(_CS,render){
    return {
        _extend : 'blog/common',

        login:function *(){
            console.log('33');
            yield  _CS.render('login');
        }   


    }
}