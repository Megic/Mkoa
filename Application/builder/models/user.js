/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    var C = require('../../../config/config')();
    return sequelize.define('user',{
                name: {
                        type: DataTypes.STRING(255),
                        allowNull:0,
                        defaultValue:'0',
                        unique:0,
                        comment: '名称'
                      },
                name2: {
                        type: DataTypes.STRING(255),
                        allowNull:0,
                        defaultValue:'0',
                        unique:0,
                        comment: '名称2'
                      }}, {
        tableName: C.pgsql.prefix+'user',
        comment: '用户表',
        timestamps:1,
        indexes:[],
        paranoid:1,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};