/**
 * sequelize 模型定义
 */
let  DataTypes=require('sequelize');
module.exports ={
    //  datasources:'default'//存储数据源 默认为'default'
    // ,name:'user',//模型名称 默认与文件名一致,建议保持默认
    model:{//模型json结构
        'id': {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        fid: {
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:'0',
            unique:false,
            comment: '父类ID'
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull:false,
            defaultValue:'0',
            unique:false,
            comment: '分类名称'
        }
    }
    ,extend:{//模型扩展部分
        tableName:'user',//默认与文件名一致
        comment: '取材部位分类表',
        timestamps:true,
        indexes:[],
        paranoid:false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    }
};