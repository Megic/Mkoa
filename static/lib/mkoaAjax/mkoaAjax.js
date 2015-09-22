define(["avalon"], function (avalon) {
    function ajax(option, callback) {
        //option 参数必须是对象,里面包括 (type 请求方式,url 请求路径,param 请求参数)
        if (typeof option === 'object') {
            //option 没有定义请求url ,直接返回错误
            if (!option.hasOwnProperty('url')) {
                return callback('no url');
            }
            //option 没有定义请求方式,默认我 get 请求
            if (!option.hasOwnProperty('type')) {
                option.type = 'GET';
            }
        } else {
            //如果 option 不是对象,直接返回
            return callback('option not object');
        }

        var xmlHttp = null;
        if (window.XMLHttpRequest) {
            //针对chrome,firefox 等浏览器创建 xmlhttprequest 对象
            xmlHttp = new XMLHttpRequest();
            if (xmlHttp.overrideMimeType) {
                //针对http传输mime类型不是 text/xml 时的设置.
                xmlHttp.overrideMimeType('text/xml');
            }
        } else if (window.ActiveXObject) {
            //针对变态浏览器IE及其各版本创建 xmlhttprequest 对象
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    console.log('Microsoft.XMLHTTP xmlHttpRequest Generation error!', e);
                    return callback('Microsoft.XMLHTTP xmlHttpRequest Generation error!', null);
                }
            }
        }
        //如果参数对象option 包括 param 参数对象
        if (option.hasOwnProperty('param')) {
            //如果传输方式是 get 时
            if (option.type.toLowerCase() === 'get') {
                option.url += '?';
                var i = 0;
                for (var key in option.param) {
                    option.url += (i == 0 ? (key + '=' + option.param[key]) : ('&' + key + '=' + option.param[key]));
                    ++i;
                }
            }
            var params='';
            //如果传输方式是 post 时
            if (option.type.toLowerCase() === 'post') {
                var i = 0;
                for (var key in option.param) {
                    params +=( i == 0 ? (key + '=' + option.param[key]) : ('&' + key + '=' + option.param[key]));
                    ++i;
                }
            }
        }
        xmlHttp.open(option.type.toUpperCase(), option.url, true);
        if(option.type.toLowerCase() === 'post'){
            xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlHttp.send(params);
        }else{   xmlHttp.send();}


        //ajax 请求状态变化监听
        xmlHttp.onreadystatechange = function () {
            // readState == 4 请求完成
            if (xmlHttp.readyState == 4) {
                //状态码 返回 200 表示请求成功
                if (xmlHttp.status == 200) {
                    callback(null, xmlHttp.responseText);
                }
                //状态码 返回 1xx 提示客户端使用更高版本 HTTP 协议
                if ((xmlHttp.status / 100) === 1) {
                    callback('请使用更高版本的HTTP协议');
                }
                //状态码 返回 3xx 表示请求实现了跳转
                if ((xmlHttp.status / 100) === 3) {
                    callback('请求跳转到新的URL');
                }
                //状态码 返回 4xx 表示请求的资源不存在,比如 404
                if ((xmlHttp.status / 100) === 4) {
                    callback('客户端请求的资源不存在');
                }
                //状态码 返回 5xx 表示服务器端错误
                if ((xmlHttp.status / 100) === 5) {
                    callback('服务器端错误');
                }
            }
        };
    }

    var $a={};
    $a.ajax=ajax;
    $a.getJSON=function(url,data,callback){
        ajax({
            type: "GET",
            url: url,
            param: data
        }, function (err, result) {
            //这里返回错误信息 或者 正确结果
           if(!err)callback(avalon.parseJSON(result))
        });
    };
    $a.post=function(url,data,callback){
        ajax({
            type: "POST",
            url: url,
            param: data
        }, function (err, result) {
            //这里返回错误信息 或者 正确结果
            if(!err)callback(avalon.parseJSON(result))
        });
    };
    return $a;

});
