/**
 * Created by Megic on 14-11-30.
 */
module.exports = function(mpath){
    var path=mpath+'/functions/';
    return{
        encode:require(path+'encode'),
        V:require(path+'validator'),
        mkdirp:require(path+'mkdirp')
    }
};