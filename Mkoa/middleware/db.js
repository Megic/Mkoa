module.exports = function(app){
    let datasources = $C['U']('datasources');
    if($F._.size(datasources)){//存在配置项目
        //内存存储
        let cacheManager = require('cache-manager');
        let zlib = require('zlib');
        let SequelizeOBJ = require('sequelize');//ORM框架
        ////////////数据库事务支持
        let cls = require('continuation-local-storage');
        let co = $F.co;
        let namespace;
        if (SequelizeOBJ.cls) {
            namespace = SequelizeOBJ.cls;
        } else {
            namespace = cls.createNamespace('koa-sequelize-transaction');//事务命名空间
            SequelizeOBJ.cls = namespace;
        }
        $SYS.model={};//数据模型缓存
        $F._.each(datasources,function(el, key){
            $SYS.model[key]={};//模型缓存地址
            if(el.type=='sequelize')$DB[key]=buildSequelize(el.options); //创建sequelize数据源
            if(el.type=='mongoose'){
                let mongoose = require('mongoose');
                mongoose.Promise = global.Promise;
                $DB[key]=mongoose.connect(el.connect);
            } //创建mogodb数据源
            if(el.type=='memory'){//创建内存存储模型
                let options={store: 'memory', max:el.options.max, ttl:el.options.ttl};
                if(el.gzip)options.compress={
                    type: 'gzip',
                    params: {
                        level: zlib.Z_BEST_COMPRESSION
                    }
                };
                $DB[key] = cacheManager.caching(options);
            }
        });

        function buildSequelize(linkOpts) {//创建sequelize实例
            linkOpts.option || (linkOpts.option = {});
            linkOpts.option.logging = $C.logger_open ? console.log : false;
            return new SequelizeOBJ(linkOpts.database, linkOpts.username, linkOpts.password, linkOpts.option);
        }
        $F.transaction = function *(fn, options) {//自动事务生成器
            options = options ? options : {};
            let key = options.key ? options.key : 'default';
            yield $DB[key].transaction(options, function (t) {
                return co(function *() {
                    yield fn(t)
                });
            });
        };
       }
    global.$D = function (modelName,data){
        let key='default';
        let modelArr=modelName.split(':');
        if(modelArr.length>1){ //存在指定数据源
            key=modelArr[0];modelName=modelArr[1];
        }
        let model=$SYS.model[key][modelName];
        if(data){//新建模型
            if(datasources[key].type=='sequelize') return model.build(data);
            if(datasources[key].type=='mongoose') return new model(data);
        }else{
            return model;
        }
    };//模型加载


};

