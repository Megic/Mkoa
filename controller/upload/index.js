/**
 * Created by Megic
 */
module.exports = function($this,$M){
    return {
        _init: function *() {//先执行的公共函数
                //console.log('公共头部');
          },
    growimage:function *(){//成长上传图片
        //console.log($M.FILES)
        var erro= 1,data;
        if($M.FILES&&$M.GET.growkey){
            erro=0;
            var hostid=$M.C.useUPYun?2:1;
            var userPicture = $M.D('Grow_picture');
            var pic = yield userPicture.build({
                path: $M.FILES.file.path,
                title: $M.FILES.file.name,
                width:$M.FILES.file.size.width,
                height:$M.FILES.file.size.height,
                userid:$M.USER.id,
                hostid:hostid,
                growkey:$M.GET.growkey
            }).save();
            if (!pic)erro=1;
            data={
                file:{
                    id:pic.id,
                    url:pic.path
                }
            }
        }
        console.log(data)
        $this.body = { erro:erro,data:data}
    },//***************************************************
        image:function *(){//普通上传图片
        //console.log($M.FILES)
        var erro= 1,data;
        if($M.FILES){
            erro=0;
            var hostid=$M.C.useUPYun?2:1;
            var userPicture = $M.D('User_picture');
            var pic = yield userPicture.build({
                path: $M.FILES.file.path,
                title: $M.FILES.file.name,
                userid:$M.USER.id,
                width:$M.FILES.file.size.width,
                height:$M.FILES.file.size.height,
                hostid:hostid
            }).save();
            if (!pic)erro=1;
            data={
                file:{
                    id:pic.id,
                    url:pic.path
                }
            }
        }
        console.log($M.FILES.file)
        $this.body = { erro:erro,data:data}
        }//***************************************************
    }
}