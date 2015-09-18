/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    var C = require('../../../config/config')();
    return sequelize.define('user2',{
                name: {
                        type: DataTypes.STRING(255),
                        allowNull:0,
                        defaultValue:'0',
                        unique:0,
                        comment: '用户名'
                      }}, {
        tableName: C.pgsql.prefix+'user2',
        comment: '用户表',
        timestamps:1,
        indexes:[],
        paranoid:0,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};