module.exports = function(app){

       let rewriteData = $C['U']('rewrite');
       let toRegexp = require('path-to-regexp');
       let querystring = require('querystring');
        //url重写
        app.use($F.convert(function*(next) {
           let keys = [];
           let len=rewriteData.length;
           let map = toMap(keys);
           let orig = this.path;
            for(let i=0;i<len;i++){

              let re = toRegexp(rewriteData[i].src, keys);
               let m = re.exec(orig);
                if (m) {
                    this.path = rewriteData[i].dst.replace(/\$(\d+)|(?::(\w+))/g, function(_, n, name){
                        if (name) return m[map[name].index + 1];
                        return m[n];
                    });
                   let urlArr=this.path.split('%3F',2);//分割字符串
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
           let map = {};

            params.forEach(function(param, i){
                param.index = i;
                map[param.name] = param;
            });

            return map;
        }

};
