module.exports = function(app){
    let datasources = $C['U']('datasources');
    let cacheConfig=datasources[$C.cache_store];
    if(cacheConfig&&cacheConfig.type=='memory'){//暂时只支持内存类型
        let memoryCache = $DB[$C.cache_store];
        app.use(async (ctx,next) => {
                ctx.cacheKey=escape(ctx.originalUrl);
                ctx.cacheBodyString=await memoryCache.get(ctx.cacheKey);
                await next();
                if(ctx.cachettl&&ctx.body)memoryCache.set(ctx.cacheKey,ctx.body, {ttl:ctx.cachettl});
        });
    }


};
