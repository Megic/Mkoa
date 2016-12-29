/**
 * Created by Administrator on 2016/12/23.
 */
module.exports = function($this){
    let action={};
    action['_before']=async function (){
       // console.log('xxx');
        //return false;
    };
    action['_after']=async function (){
        // console.log('xxx');
        //return false;
    };
    action['file']=async function (){
        await $ST['default'].upload($this,'user');//default源接收上传文件按默认方式存储到user容器
        // await $ST['default'].upload($this,'user',{
        //     file:{filename:'2016/xxx.jpg'}//自定义上传文件路径
        // });
        $this.body=$this.POST;//返回相关信息
    };
    action['piece']=async function (){//分片上传
        let status=$this.POST['status'];//步骤检查
        if(!status) {//上传片段
            let fileInfo=await $ST['default'].uploadChunks($this,'user',{uid:''});
            $this.body={"status":0};
        }else if(status== "md5Check"){  //秒传校验
            if($this.POST['md5'] == "b0201e4d41b2eeefc7d3d355a44c6f5a"){
                $this.body={"ifExist":1, "path":"kazaff2.jpg"};
            }else{
                $this.body={"ifExist":0};
            }
        }else if(status== "chunkCheck"){  //分片校验
            let res=await $ST['default'].chunkCheck('user',{key:$this.POST['name'],chunkIndex:$this.POST['chunkIndex'],size:$this.POST['size']});
            $this.body={"ifExist":res?1:0};//返回分片是否存在
        }else if(status== "chunksMerge"){   //分片合并
            let file=await $ST['default'].chunksMerge('user',{key:$this.POST['name'],chunks:$this.POST['chunks'],ext:$this.POST['ext']});
            $this.body=file;
        }
       // $this.body=$this.POST;//返回相关信息
    };
    return action;
};