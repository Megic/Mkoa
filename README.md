#Mkoa

轻量级的nodejs WEB框架。在koa框架的基础上进行简单但恰到好处的整合。

#Mkoa安装

> 运行 npm install

> 根据所用数据库安装对应依赖

> $ npm install --save pg pg-hstore //pgsql 依赖安装

> $ npm install --save mysql //  mysql and mariadb 依赖安装

> $ npm install --save sqlite3

> $ npm install --save tedious // MSSQL 依赖安装

> 运行app.js文件即可

> node node.js   //node 4.0以下版本需要"--harmony"参数

#Mkoa 模块

模块 | 描述 | 地址
----|------|----
Mkoa-builder | 代码生成器  | https://github.com/Megic/Mkoa-builder



#Centos 运行环境
> yum install npm

> npm install -g n

> n stable //安装最新稳定版nodejs 

> npm install -g pm2

> node 4.0以下版本需要"--harmony"参数

> pm2 start app.js --node-args="--harmony"

> sequelize 模块的依赖需要进入 sequelize文件夹运行npm install 安装

> npm使用阿里巴巴npm源

> npm config set registry http://registry.npm.taobao.org/