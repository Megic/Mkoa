/**
 * Created by Administrator on 2016/12/23.
 */
module.exports = function($this){
    let action={};

    function getUserToken(uid,$this){
        let expiresIn= Math.floor(Date.now() / 1000) + (60*60);//1小时过期
        return [$this.jwtSign({uid:uid,groud:1,exp:expiresIn}),expiresIn];
    }

    function getRefreshToken(uid,$this){
        return $this.jwtSign({uid:uid,type:'refresh',exp:Math.floor(Date.now() / 1000) + (60*60*24*30)});//30天过期;
    }

    action['sign']=async function (){
        let uid=11;
        let tonkenArr=getUserToken(uid,$this);
        let refresh_token=getRefreshToken(uid,$this);//30天过期
        $this.body={
            token:tonkenArr[0],
            refresh_token:refresh_token,
            expires_in:tonkenArr[1]
        };
    };
    //验证token
    action['vc']=async function (){
      //  console.log($this.jwtVerify());
        $this.body=$this.jwtVerify();
        //return false;
    };
    //刷新token
    action['refresh']=async function (){
        let res=$this.jwtRefresh();
        let uid=res.uid;
        if(res.type=='refresh'){
            let tonkenArr=getUserToken(uid,$this);
            let refresh_token=getRefreshToken(uid,$this);//30天过期
            $this.body={
                token:tonkenArr[0],
                refresh_token:refresh_token,
                expires_in:tonkenArr[1]
            };
        }else{
            $this.error('token不正确')
        }
    };
    return action;
};