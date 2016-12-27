//数据源定义
module.exports= {
    default:{
      name:'默认数据源',
      type:'sequelize',//类型
      prefix:'mkoa_',//数据表前缀 sequelize
      sync:true,//是否同步数据表 sequelize
      options:{//配置项目
            username:'postgres'
            ,password:'root'
            ,database:'mkoa'
            ,option:{
                dialect:'postgres' //'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
                ,host:'localhost'
                ,port:5432
            }
        }
    },
    cache:{
        name:'缓存数据源',
        type:'memory',//内存存储
        gzip:true,
        options:{max: 100, ttl: 10}
    }
};