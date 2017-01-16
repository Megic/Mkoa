let forms = require('formidable');
let path=require('path');
let _ = require('underscore');//辅助函数
let fs = require('fs-extra');//扩展文件夹等操作
let moment = require('moment');//时间格式化
let crypto = require("crypto");

module.exports = function(options){
    let fileRoot=options.root;
    fs.mkdirsSync(fileRoot);//创建文件夹
    let storage={};
    //创建容器
    storage.createContainer=function(options){
        fs.mkdirsSync(path.join(fileRoot,options.name));//创建文件夹
    };
    //删除容器容器
    storage.destroyContainer=function(containerName,cb){
        return fs.remove(path.join(fileRoot,containerName), function (err) {
            if (err) return console.error(err);
            if(cb)cb();
        });
    };
    //获取容器内指定文件的信息
    storage.getFile=function(containerName,file){
        return fs.statSync(path.join(fileRoot,containerName,file));
    };
    //按名称给定的容器内删除文件
    storage.removeFile=function(containerName,file){
        fs.removeSync(path.join(fileRoot,containerName,file));
    };

    //上传文件到容器 opts{uid:'',file:{filename:''}}
    storage.upload=function(ctx,containerName,opts){
        opts=opts||{};
        if (ctx.is('multipart')){//上传文件
            containerName = containerName || '';
            if (containerName) storage.createContainer({name: containerName});//创建容器
            options.uploadDir=path.join(fileRoot, containerName);
            options.onFileBegin=function(name,file){//开始接收文件
                let curFileName,curPath;
                if(opts[name]&&opts[name].filename){//自定义文件名
                    curFileName=path.join(options.uploadDir,opts[name].filename);
                    curPath=path.dirname(curFileName);
                }else{//默认按日期分类
                    curPath=path.join(options.uploadDir,moment().format('YYYY/MM/DD/'));
                    curFileName=path.join(curPath,path.basename(file.path))
                }
                fs.mkdirsSync(curPath);//创建文件夹
                file.path=curFileName;//重新命名
            };

            let bodyPromise = formy(ctx,fileRoot,options);
            return bodyPromise.then(function (body) {
                ctx.POST = body;
                return body;
            });
        }
    };


    //分片上传opts{filename:'',uid:''}
    storage.uploadChunks=function(ctx,containerName,opts){
        opts=opts||{};
        if (ctx.is('multipart')){//上传文件
            containerName = containerName || '';
            if (containerName) storage.createContainer({name: containerName});//创建容器
            options.uploadDir=path.join(fileRoot, containerName);
            function changePath(POST){
                //唯一识别码
                POST['file'].key=getFileKey({
                    uid:opts.uid,
                    name:POST['file'].name,
                    type:POST.type,
                    lastModifiedDate:POST.lastModifiedDate,
                    size:POST.size
                });//文件唯一识别码
                let curFileName,curPath;
                if(!POST['chunks']||parseInt(POST['chunks'])<=1){//非分片，一次性上传
                    if(opts.filename){//自定义文件名
                        curFileName=path.join(options.uploadDir,opts.filename);
                        curPath=path.dirname(curFileName);
                    }else{//默认按日期分类
                        curPath=path.join(options.uploadDir,moment().format('YYYY/MM/DD/'));
                        curFileName=path.join(curPath,path.basename(POST['file'].path))
                    }
                    fs.mkdirsSync(curPath);//创建文件夹
                }else{//分片
                    let cachePath=path.join(options.uploadDir,POST['file'].key);
                    if(!fs.existsSync(cachePath))fs.mkdirsSync(cachePath);//创建文件夹
                    curFileName=path.join(cachePath,'/',POST.chunk);
                    fs.renameSync(POST['file'].path,curFileName);
                    POST['file'].path=curFileName;//重新命名
                    POST['file'].shortPath=curFileName.replace(fileRoot,'');//相对路径
                }
                return POST;
            }

            let bodyPromise = formy(ctx,fileRoot,options);
            return bodyPromise.then(function (body) {
                if(body['file']){
                    body=changePath(body);//分片上传后处理
                    ctx.POST = body;
                    return body;
                }else{
                    return false;
                }
            });
        }
    };
    //分片检查
    storage.chunkCheck=function(containerName,opts){
        return fs.existsSync(path.join(fileRoot,containerName,opts.key,opts.chunkIndex));
    };
    //分片合并
    storage.chunksMerge=function(containerName,opts){
        let curFileName,curPath;
        if(opts.filename){//自定义文件名
            curFileName=path.join(fileRoot,containerName,opts.filename);
            curPath=path.dirname(curFileName);
        }else{//默认按日期分类
            curPath=path.join(fileRoot,containerName,moment().format('YYYY/MM/DD/'));
            curFileName=path.join(curPath,opts.key+'.'+opts.ext);
        }
        fs.mkdirsSync(curPath);//创建文件夹
        let targetStream = fs.createWriteStream(curFileName);
        targetStream.on('finish', function() {
            fs.remove(cahcePath);//删除文件夹
        });
        let cahcePath=path.join(fileRoot,containerName,opts.key);
        function toWrite(i,resolve, reject){//读取文件编写
            if(fs.existsSync(cahcePath+'/'+i)) {
                let readstream = fs.createReadStream(cahcePath + '/' + i);//读取分片
                readstream.pipe(targetStream);
                i++;
                if (i < opts.chunks) {
                    toWrite(i, resolve, reject);
                } else {
                    readstream.on('end', function () {//最后一个结束
                        targetStream.end();
                        resolve({
                            key: opts.key,
                            path: curFileName,
                            shortPath: curFileName.replace(fileRoot, '')//相对路径
                        });
                    });
                }
            }else{
                resolve(false);
            }
        }
        return new Promise(function(resolve, reject) {
            toWrite(0,resolve, reject);
        });
    };
    return storage;

};
//生成上传文件唯一标识
function getFileKey(file){
    let str = file.uid + file.name + file.type + file.lastModifiedDate + file.size;
    return crypto.createHash("md5").update(str, "utf8").digest("hex");
}
//处理上传文件
function formy(ctx,fileRoot,opts) {
    return new Promise(function (resolve, reject){
        let fields = {};
        let files = {};
        let form = new forms.IncomingForm(opts);
        form.on('end', function () {
            return resolve(_.extend(fields,files));
        }).on('error', function (err) {
            return reject(err);
        }).on('field', function (field, value) {
            if (fields[field]) {
                if (Array.isArray(fields[field])) {
                    fields[field].push(value);
                } else {
                    fields[field] = [fields[field], value];
                }
            } else {
                fields[field] = value;
            }
        }).on('file', function (field, file) {
            file={//重新整理对象
                size: file.size,
                path: file.path,
                name:file.name,
                type: file.type,
                ext:path.extname(file.name),
                lastModifiedDate:file.lastModifiedDate,
                shortPath:file.path.replace(fileRoot,'')//相对路径
            };
            if (files[field]) {
                if (Array.isArray(files[field])) {
                    files[field].push(file);
                } else {
                    files[field] = [files[field], file];
                }
            } else {
                files[field] = file;
            }
        });
        if (opts.onFileBegin) {
            form.on('fileBegin', opts.onFileBegin);
        }
        form.onPart = function(part) {
            if (!part.filename||_.contains(opts.ext,path.extname(part.filename).toLowerCase())) {//判断格式是否正确
                form.handlePart(part);
            }
        };
        form.parse(ctx.req);
    });
}