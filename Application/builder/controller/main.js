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
        var dirList=[];
        if(fs.existsSync($M.modulePath+'data')){
           dirList = fs.readdirSync($M.modulePath+'data');
        }
        yield $this.display({dirList:JSON.stringify(dirList)});
    };
    //生成模型文件
    main['buildModel']=function *(){
        $M['POST']['fields']=JSON.parse($M['POST']['fields']);
        var rules = {
            modelName:{rule:'required|string',error:'模型名称有误'}
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
             res=res.replace(/{{%name%}}/g,$M['POST'].modelName);
             res=res.replace('{{%comment%}}',$M['POST'].comment);
             res=res.replace('{{%timestamps%}}',$M['POST'].timestamps);
             res=res.replace('{{%indexes%}}',$M['POST'].indexes?$M['POST'].indexes:'[]');
             res=res.replace('{{%paranoid%}}',$M['POST'].paranoid);
             res=res.replace('{{%fields%}}',fieldsARR);
            var modelPath=$M.ROOT + '/' + $M.C.application + '/' + $M['POST'].root + '/models/';
            if (fs.existsSync(modelPath) || (yield fscp.mkdirp(modelPath, '0755'))) {//判定文件夹是否存在
                fs.writeFileSync(modelPath+$M['POST'].modelName+'.js',res);
            }
            if (fs.existsSync($M.modulePath+'data/') || (yield fscp.mkdirp($M.modulePath+'data/', '0755'))) {//判定文件夹是否存在
            fs.writeFileSync($M.modulePath+'data/'+$M['POST'].modelName+'.js','module.exports='+JSON.stringify($M['POST'])+';');
            }
            $this.success('生成模型成功!');

        }else{
            $this.error('数据有误');
        }

    };
    //生成控制器
    main['buildController']=function *(){
        $M['POST']['fields']=JSON.parse($M['POST']['fields']);
        var rules = {
            modelName:{rule:'required|string',error:'模型名称有误'}
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
            res=res.replace(/{{%name%}}/g,$M['POST'].modelName);
            res=res.replace('{{%rules%}}',fieldsARR);
            var modelPath=$M.ROOT + '/' + $M.C.application + '/' + $M['POST'].root + '/controller/';
            if (fs.existsSync(modelPath) || (yield fscp.mkdirp(modelPath, '0755'))) {//判定文件夹是否存在
                fs.writeFileSync(modelPath+$M['POST'].modelName+'.js',res);
            }
            $this.success('成功生成控制器!');

        }else{
            $this.error('数据有误');
        }

    };
    //生成常用视图
    main['buildViews']=function *(){
        $M['POST']['fields']=JSON.parse($M['POST']['fields']);
        var rules = {
            modelName:{rule:'required|string',error:'模型名称有误'}
        };
        var r=$M['F'].V.validate($M['POST'], rules);
        if(r.status==1&&$M['POST']['fields'].length>0){
            //读取菜单数据
            var menuData={};
            var menupath=$M.modulePath+'lib/menu.json';
            if(fs.existsSync(menupath)){
                var menuJson=fs.readFileSync($M.modulePath+'lib/menu.json','utf-8');
                menuData=JSON.parse(menuJson);
            }
            if(!menuData[$M['POST'].root]){
                menuData[$M['POST'].root]=[];
                menuData[$M['POST'].root+'-lock']=[];
            }
            if(menuData[$M['POST'].root+'-lock'].indexOf($M['POST'].modelName)<0){
                menuData[$M['POST'].root].push(
                    {name:$M['POST'].modelName,url:"#!/?"+$M['POST'].root+"/"+$M['POST'].modelName+"/list"}
                );
                menuData[$M['POST'].root+'-lock'].push($M['POST'].modelName);
            }

            //保存菜单数据
            fs.writeFileSync(menupath,JSON.stringify(menuData));
           //生成index文件
            var index=fs.readFileSync($M.modulePath+'lib/admin.tpl.html','utf-8');
            index=index.replace('{{%menuData%}}',JSON.stringify(menuData[$M['POST'].root]));
            var vPath=$M.ROOT + '/' + $M.C.application + '/' + $M['POST'].root + '/views/';
            if (fs.existsSync(vPath) || (yield fscp.mkdirp(vPath, '0755'))) {//判定文件夹是否存在
                fs.writeFileSync(vPath+'admin.html',index);
            }

            //生成list文件
            var list=fs.readFileSync($M.modulePath+'lib/list.tpl.html','utf-8');//读取模板
            var len= $M['POST']['fields'].length;
            //生成字段
            var titleSTR='',listSTR='',formSTR='',vmSTR={};
            for(var i=0; i<len; i++){
                //list页面
                titleSTR+=`<th>${$M['POST']['fields'][i].comment}</th>`;
                listSTR+=`<td>{{el.${$M['POST']['fields'][i].name}}}</td>`;
                //add页面
                formSTR+=`<tr><td width="120"><span class="mkoa-form-title">${$M['POST']['fields'][i].comment}</span></td>
                <td><input type="text" ms-duplex="form.${$M['POST']['fields'][i].name}"/></td></tr>`;
                vmSTR[$M['POST']['fields'][i].name]="";
            }
            list=list.replace('{{%titleSTR%}}',titleSTR);
            list=list.replace('{{%listSTR%}}',listSTR);
            list=list.replace(/{{%name%}}/g,$M['POST'].modelName);
            list=list.replace(/{{%mroot%}}/g,$M['POST'].root);
            vPath=vPath+$M['POST'].modelName+'/';
            if (fs.existsSync(vPath) || (yield fscp.mkdirp(vPath, '0755'))) {//判定文件夹是否存在
                fs.writeFileSync(vPath+'list.html',list);
            }
            //生成addItem文件

            var addItem=fs.readFileSync($M.modulePath+'lib/addItem.tpl.html','utf-8');//读取模板
            addItem=addItem.replace('{{%formSTR%}}',formSTR);
            addItem=addItem.replace('{{%vmSTR%}}',JSON.stringify(vmSTR));
            addItem=addItem.replace(/{{%name%}}/g,$M['POST'].modelName);
            addItem=addItem.replace(/{{%mroot%}}/g,$M['POST'].root);
            fs.writeFileSync(vPath+'addItem.html',addItem);


            $this.success('成功生成视图!');

        }else{
            $this.error('数据有误');
        }

    };
    main['test']=function *(){




    };

    return main;
};
