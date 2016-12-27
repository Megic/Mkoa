/**
 * Created by Megic on 14-11-30.
 */
module.exports = function(mpath){
    let path=mpath+'/functions/';
    return{
        encode:require(path+'encode')
    }
};