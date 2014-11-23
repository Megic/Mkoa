/**
 * Created by Megic
 */
module.exports = function($this,$M){
    return {
        _extend : 'blog/common',
        login:function *(){
            // var User = $M.D('User');
            // $this.session['xx']=null;
  // yield sequelize.sync({ force: true });
// var user = yield User.build({
//   name: '321',
//   ip: '117.0.0.1'
// }).save();
// $this.checkQuery('name').empty().len(2,20,"bad name.").trim().toLow().md5() ;
// $this.checkQuery('kname').len(2,20,"bad name.").trim().toLow().md5() ;
// if ($this.errors) {
//         $this.body = $this.errors;
//         return ;
//     }

  // console.log($this.csrf);
    // $this.body = $this.query;
    // console.log($this.request.body.files);

      yield  $this.render('login',{csrf:$this.csrf});
        } ,
        post:function *(){
        $this.assertCSRF($this.request.body._csrf);
        }
        
    }
}