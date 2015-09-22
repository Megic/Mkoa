/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    var C = require('../../../config/config')();
    return sequelize.define('test',{
                name: {
                        type: DataTypes.STRING(255),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: 'hah'
                      }}, {
        tableName: C.pgsql.prefix+'test',
        comment: '测试',
        timestamps:1,
        indexes:[],
        paranoid:0,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};