module.exports = function(sequelize, DataTypes) {
   var C = require('../config/config')();
  return sequelize.define('User', {
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '手机号码',
    validate: {
      isInt: true //判定是数字
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户密码'
    // validate: {
    //   isInt: true //判定是数字
    // }
  },
  email: {
    type: DataTypes.STRING,     // VARCHAR(255),
    allowNull: true,
    comment: '用户邮箱',
    validate: {
       isEmail: true           // checks for email format (foo@bar.com)
    }
  },
  name: {
    type: DataTypes.STRING,     // VARCHAR(255),
    allowNull: true,
    comment: '用户昵称',
    validate: {
     len: [2,20]             // only allow values with length
    }
  },
    group: {
    type: DataTypes.INTEGER(2),     // VARCHAR(255),
    allowNull: false,
    defaultValue: 0,
    comment: '用户组',
    validate: {
      isInt: true //判定是数字
    }
  }
}, {
  tableName: C.mysql.prefix+'user',
  comment: '用户表',
  indexes: [
    {
      unique: true,
      fields: ['phone']
    },
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['updated']
    }
  ],
  createdAt: 'create',
  updatedAt: 'updated',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});
}