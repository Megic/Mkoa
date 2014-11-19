module.exports=function(root){
    return {
        mongo:'mongodb://127.0.0.1:27017/koaDB',
        model:root+'/model/',
        view:root+'/view/',
        controller:root+'/controller/',
        lib:root+'/lib/',
        maxAge: 259200000,
        secret:709394,
        port:6688
    }

}