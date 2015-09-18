/**
 * Created by megic on 2015-06-11.
 */

module.exports = function($this,$M){
    var fs = require('fs');
    var fscp = require('co-fs-plus');//文件夹等操作
    var main={};

    main['_init']=function *(){//先执行的公共函数不会被缓存部分
    };
    main['_after']=function *(){//后行的公共函数
        //console.log('公共头部');
    };
    main['eModel']=function *(){
       var data=require($M.modulePath+'data/'+$M.GET['file']);
        yield $this.display(data);
    };
    main['list']=function *(){//模型列表
        var dirList = fs.readdirSync($M.modulePath+'data');
        yield $this.display({dirList:JSON.stringify(dirList)});
    };
    main['buildModel']=function *(){
        $M['POST']['fields']=JSON.parse($M['POST']['fields']);
        var rules = {
            modelName:['required|string','模型名称有误']
        };
        var r=$M['F'].V.validate($M['POST'], rules);
        if(r.status==1&&$M['POST']['fields'].length>0){
            var fieldsARR='{';
            var len= $M['POST']['fields'].length;
          //生成字段
            for(var i=0; i<len; i++){
                if(i)fieldsARR+=',';
                fieldsARR+=`
                ${$M['POST']['fields'][i].name}: {
                        type: DataTypes.${$M['POST']['fields'][i].type},
                        allowNull:${$M['POST']['fields'][i].allowNull},
                        defaultValue:'${$M['POST']['fields'][i].defaultValue}',
                        unique:${$M['POST']['fields'][i].unique},
                        comment: '${$M['POST']['fields'][i].comment}'
                      }`;
            }
            fieldsARR+='}';
            var res=fs.readFileSync($M.modulePath+'lib/model.tpl','utf-8');
             res=res.replace(/{{name}}/g,$M['POST'].modelName);
             res=res.replace('{{comment}}',$M['POST'].comment);
             res=res.replace('{{timestamps}}',$M['POST'].timestamps);
             res=res.replace('{{indexes}}',$M['POST'].indexes?$M['POST'].indexes:'[]');
             res=res.replace('{{paranoid}}',$M['POST'].paranoid);
             res=res.replace('{{fields}}',fieldsARR);
            var modelPath=$M.ROOT + '/' + $M.C.application + '/' + $M['POST'].root + '/models/';
            if (fs.existsSync(modelPath) || (yield fscp.mkdirp(modelPath, '0755'))) {//判定文件夹是否存在
                fs.writeFile(modelPath+$M['POST'].modelName+'.js',res, function (error) {
                    if (error)console.log('生成模型失败');
                });
            }
            if (fs.existsSync($M.modulePath+'data/') || (yield fscp.mkdirp($M.modulePath+'data/', '0755'))) {//判定文件夹是否存在
            fs.writeFile($M.modulePath+'data/'+$M['POST'].modelName+'.js','module.exports='+JSON.stringify($M['POST'])+';', function (error) {
                if (error)console.log('保存数据文件');
            });
            }
            $this.success('生成模型成功!');

        }else{
            $this.error('数据有误');
        }

    };
    main['buildController']=function *(){
        $M['POST']['fields']=JSON.parse($M['POST']['fields']);
        var rules = {
            modelName:['required|string','模型名称有误']
        };
        var r=$M['F'].V.validate($M['POST'], rules);
        if(r.status==1&&$M['POST']['fields'].length>0){
            var fieldsARR='{';
            var len= $M['POST']['fields'].length;
            //生成字段
            for(var i=0; i<len; i++){
                if(i)fieldsARR+=',';
                fieldsARR+=`
                ${$M['POST']['fields'][i].name}: {rule:'${$M['POST']['fields'][i].validate.rule}',error:'${$M['POST']['fields'][i].validate.error}'}`;
            }
            fieldsARR+='}';
            var res=fs.readFileSync($M.modulePath+'lib/controller.tpl','utf-8');
            res=res.replace(/{{name}}/g,$M['POST'].modelName);
            res=res.replace('{{rules}}',fieldsARR);
            var modelPath=$M.ROOT + '/' + $M.C.application + '/' + $M['POST'].root + '/controller/';
            if (fs.existsSync(modelPath) || (yield fscp.mkdirp(modelPath, '0755'))) {//判定文件夹是否存在
                fs.writeFile(modelPath+$M['POST'].modelName+'.js',res, function (error) {
                    if (error)console.log('生成控制器失败');
                });
            }
            $this.success('成功生成控制器!');

        }else{
            $this.error('数据有误');
        }

    };

    return main;
};
