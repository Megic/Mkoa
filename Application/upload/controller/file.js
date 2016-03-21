/**
 * Created by Megic on 2016/3/21 0021.
 */
module.exports = function ($this) {
    var fs = require('fs');
    var wu = require("../lib/webuploader");
    var path = require("path");
    var fscp = require('co-fs-plus');//文件夹等操作
    var cs = require('co-stream');
    var main = {};
    //用于分片合并时的同步标识位
    var lockMark = [];
    main['_init'] = function *() {//先执行的公共函数
        //console.log('公共头部');
    };
    main['_after'] = function *() {//后行的公共函数
        //console.log('公共头部');
    };
    //****************************
    main['add'] = function *() {

        var fields=$this.POST['fields'];
        var status=$this.POST['status'];
        if(!status){//上传
            var filePath=$C.staticpath+$this.FILES.file.path;
            var isChunks = !(!fields['chunks'] || parseInt(fields['chunks']) <= 0);

            if(isChunks){//分片
                var upDir = $C.upload+'/'+ wu.createUniqueFileName(fields);//新命名
                if (fs.existsSync(upDir) || (yield fscp.mkdirp(upDir, '0755'))) {//创建分片文件夹
                    //更新tmp文件的修改时间
                    fs.open(upDir+".tmp", "w", function(err, fd){
                        if(err){
                            console.error(err);
                        }else{
                            var time = new Date();
                            fs.futimes(fd, time, time, function(err){
                                if(err){
                                    console.error(err);
                                }
                                fs.close(fd);
                            });
                        }
                    });
                    filePath=upDir+'/'+fields['chunk'];//分片名字
                }else{
                    $this.body={"status":0};
                }
            }
            var rn=fs.renameSync($this.FILES.file.oldPath,filePath);
            if(rn){
                $this.body={"status":1, "path":$this.FILES.file.path};
            }else{
                $this.body={"status":0};
            }
            //fs.unlinkSync($this.FILES.file.oldPath);
            //var readStream = fs.createReadStream($this.FILES.file.oldPath);
            //readStream.pipe(fs.createWriteStream(filePath),function() {//复制临时文件到指定路径
            //    fs.unlinkSync($this.FILES.file.oldPath);
            //    $this.body={"status":1, "path":'+ $this.FILES.file.path +'};
            //});


        }else if(status== "md5Check"){  //秒传校验
            //todo 模拟去数据库中校验md5是否存在
            if($this.POST.md5 == "b0201e4d41b2eeefc7d3d355a44c6f5a"){
                $this.body={"ifExist":1, "path":"kazaff2.jpg"};
            }else{
                $this.body={"ifExist":0};
            }
        }else if(status== "chunkCheck") {  //分片校验
            var pic=path.join($C.upload, $this.POST['name'], $this.POST['chunkIndex']);
            var check=false;
            if(fs.existsSync(pic)){
                var stats=fs.statSync(pic);
                if(stats.size == $this.POST.size){
                    check=true;
                }
            }
            if(check){
                $this.body={"ifExist":1};
            }else{
                $this.body={"ifExist":0};
            }

        }else if(status== "chunksMerge") {   //分片合并
            var name=$this.POST['name'];
            //同步机制
            if($F._.contains(lockMark,name)){
                $this.body={"status":0};
            }else{
                lockMark.push(name);
                var newFileName = $this.filePath+wu.randomFileName($this.POST.ext);
                var targetStream = fs.createWriteStream(newFileName);
                var cout = new (cs.Writer)(targetStream);
                var dir=path.join($C.upload,name);
                for(var i=0;i<$this.POST.chunks;i++){
                    var chunkFile=path.join(dir,i.toString());
                    console.log(chunkFile)
                    var input = fs.createReadStream(chunkFile);
                    var cin = new (cs.Reader)(input);
                    var txt='';
                    while (txt = yield cin.read('utf8')) {
                        yield cout.write(txt); // or: yield cout.writeline(txt)
                    }
                    //yield* cs.wait(input);
                    fs.unlinkSync(chunkFile);//删除文件
                }
                //yield* cs.wait(targetStream);
                fs.unlinkSync(path.join($C.upload, name) + ".tmp");//删除tmp文件
                fs.rmdirSync(path.join($C.upload, name));//删除切片文件夹
                // todo 这里其实需要把该文件和其前端校验的md5保存在数据库中，供秒传功能检索
                lockMark = $F._.without(lockMark,name);
                $this.body={"status":1, "path":"' + newFileName + '"};

            }


        }

    };//****************************

    return main;
};