module.exports = function(app){

    if($C.openRewrite){

        var rewriteData = require($C.ROOT + '/config/rewrite');
        var toRegexp = require('path-to-regexp');
        var querystring = require('querystring');
        //url重写
        app.use($F.convert(function*(next) {
            var keys = [];
            var len=rewriteData.length;
            var map = toMap(keys);
            var orig = this.path;
            for(var i=0;i<len;i++){
               var re = toRegexp(rewriteData[i].src, keys);
                var m = re.exec(orig);
                if (m) {
                    this.path = rewriteData[i].dst.replace(/\$(\d+)|(?::(\w+))/g, function(_, n, name){
                        if (name) return m[map[name].index + 1];
                        return m[n];
                    });
                    var urlArr=this.path.split('%3F',2);//分割字符串
                    this.path=urlArr[0];
                    if(urlArr[1])this.request.query=querystring.parse(urlArr[1]);//存在数据重新负值

                    break;
                }
            }
            yield next;
            this.path = orig;//还原请求
        }));//获取缓存配置

        /**
         * Turn params array into a map for quick lookup.
         *
         * @param {Array} params
         * @return {Object}
         * @api private
         */

        function toMap(params) {
            var map = {};

            params.forEach(function(param, i){
                param.index = i;
                map[param.name] = param;
            });

            return map;
        }
    }
};
