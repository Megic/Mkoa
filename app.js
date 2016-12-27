/**
 * Created by Administrator on 2016/12/19.
 */

require('./Mkoa/index')({
    root:__dirname,//根目录
    env:process.env.NODE_ENV?process.env.NODE_ENV:'development'//配置环境
    //,baseConfigPath:''//项目配置文件目录,默认为根目录/config/
});
