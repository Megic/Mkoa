#Mkoa

轻量级的nodejs WEB框架。在koa框架的基础上进行简单但恰到好处的整合。

#Mkoa安装

> npm install Mkoa --save

> 编写入口文件app.js,引用Mkoa即可

```
require('Mkoa')(__dirname,'');
```

> 运行app.js

> node node.js   //node 4.0以下版本需要"--harmony"参数

#Mkoa 开发模块-协助进行项目开发

模块 | 描述 | 地址
----|------|----
Mkoa-install| Mkoa简易模块安装/卸载管理 |https://github.com/Megic/mkoa-install
Mkoa-webpack| Mkoa webpack前端代码打包模块 | https://github.com/Megic/Mkoa-webpack
Mkoa-builder | 简易代码生成器  | https://github.com/Megic/Mkoa-builder




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