/**
 * Created by Administrator on 2015/9/16 0016.
 */
define(["avalon"], function (avalon) {
//返回数组下标
    if(!Array.indexOf) {
        Array.prototype.indexOf = function (el) {
            for (var i = 0, n = this.length; i < n; i++) {
                if (this[i] === el) {
                    return i;
                }
            }
            return -1;
        }
    }
//判断对象是否为空
    function isEmpty(obj)
    {
        for (var name in obj)
        {
            return false;
        }
        return true;
    }
    /**
     * 功能 : 把url地址转换成js对象
     * 例子 : urlToObject("?a=1&b=2")
     * 结果 : { a="1", b="2"}
     * */
    var sys={};//系统函数
    sys.urlToObject=function (url) {
        var urlObject = {};
        if (/\?/.test(url)) {
            var urlString = url.substring(url.indexOf("?") + 1);
            var urlArray = urlString.split("&");
            for (var i = 0, len = urlArray.length; i < len; i++) {
                var urlItem = urlArray[i];
                var item = urlItem.split("=");
                urlObject[item[0]] = item[1];
            }
            return urlObject;
        }
    };
    sys.extend=function(obj,newobj,isReset){//替换存在属性
        avalon.each(obj,function(key){
            if(newobj[key]==0||newobj[key]){
                if(avalon.isPlainObject(obj[key])){
                    if(avalon.isPlainObject(newobj[key])&&!isEmpty(newobj[key])){
                        sys.extend(obj[key],newobj[key],isReset);
                    }else{
                        obj[key]['value'] = newobj[key];
                    }
                }else{
                    obj[key]=newobj[key];
                }
            }else{
                if(isReset){//重置值
                    obj[key]=isNaN(obj[key])?0:'';
                }
            }
        });
    };
    return sys;
});