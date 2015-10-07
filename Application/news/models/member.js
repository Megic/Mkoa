/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('member',{
                name: {
                        type: DataTypes.STRING(30),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '名称'
                      },
                title: {
                        type: DataTypes.STRING(30),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '标题'
                      }}, {
        tableName:'mkoa_member',
        comment: '用户',
        timestamps:true,
        indexes:[],
        paranoid:false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};