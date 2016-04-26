module.exports = function(app){
    var fs = require('fs');
    var path=require('path');
    //缓存
    $SYS.lowdb=require('lowdb');
    var storage = require('lowdb/file-sync');
    //文件/内存数据
    $F.low=function (filename){
        var lowRoot=$C.cachepath + '/low/'+filename;
        if(filename){
            if(!fs.existsSync(lowRoot)){
                $F.mkdirp.sync(path.dirname(lowRoot));
                fs.closeSync(fs.openSync(lowRoot, 'w'));
            }
            return $SYS.lowdb(lowRoot, {storage});
        }else{
            return $SYS.lowdb();
        }
    };
};
