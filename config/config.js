
module.exports=function(root){
    return {
        mongo:'mongodb://127.0.0.1:27017/test',
        model:root+'/model',
        views:root+'/views',
        controller:root+'/controller',
        lib:root+'/lib',
        static:root+'/static',
        maxAge: 259200000,
        secret:709394,
        port:6688
    }

}