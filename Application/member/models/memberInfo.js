module.exports = function(sequelize, DataTypes) {
   var C = require('../../../config/config')();
  return sequelize.define('memberInfo', {
    mid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户ID',
      validate: {
        isInt: true ///判定是数字
      }
    },
  info: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '资料'
  }
}, {
  tableName: C.pgsql.prefix+'memberInfo',
  comment: '用户资料表',
  createdAt: 'create',
  updatedAt: 'updated',
  charset: 'utf8',
  collate: 'utf8_general_ci'
});
};