/**
 * Created by Megic
 */
module.exports = function($this,$M){
    return {
        _extend : 'blog/common',
        login:function *(){
            yield  $this.render($M.TPL,{title:$M.GET['title']});
        }   
        
    }
}