/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    var C = require('../../../config/config')();
    return sequelize.define('{{%name%}}',{{%fields%}}, {
        tableName: C.pgsql.prefix+'{{%name%}}',
        comment: '{{%comment%}}',
        timestamps:{{%timestamps%}},
        indexes:{{%indexes%}},
        paranoid:{{%paranoid%}},
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};