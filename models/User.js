module.exports = function(sequelize, DataTypes) {
   var C = require('../config/config')();
  return sequelize.define('User', {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'user name',
  },
  ip: {
    type: DataTypes.STRING(64),
    allowNull: false,
    comment: 'user last request ip',
  },
  isNpmUser: {
    field: 'npm_user',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'user sync from npm or not, 1: true, other: false',
  }
}, {
  tableName: C.mysql.prefix+'user',
  comment: 'user base info',
  indexes: [
    {
      unique: true,
      fields: ['name']
    },
    {
      fields: ['gmt_modified']
    }
  ],
  createdAt: 'gmt_create',
  updatedAt: 'gmt_modified',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});
}