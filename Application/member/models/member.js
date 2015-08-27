module.exports = function(sequelize, DataTypes) {
   var C = require('../../../config/config')();
  return sequelize.define('member', {
  phone: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    comment: '手机',
    validate: {
      isInt: true ///判定是数字
    }
  },
  password: {
    type: DataTypes.STRING(40),
    allowNull: false,
    comment: '用户密码'
  },
  email: {
    type: DataTypes.STRING,     // VARCHAR(255),
    allowNull:true,
    unique: true,
    comment: '用户邮箱',
    validate: {
       isEmail: true           // checks for email format (foo@bar.com)
    }
  },
  nickname: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 0,
    comment: '用户昵称',
    validate: {
     len: [1,20]             // only allow values with length
    }
  },
    sitenumber:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '微官网数量',
      validate: {
        isInt: true //判定是数字
      }
    },
    groupid: {
    type: DataTypes.INTEGER(2),
    allowNull: false,
    defaultValue: 0,
    comment: '用户组',
    validate: {
      isInt: true //判定是数字
    }
  },
    image: {
    type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    comment: '头像地址'
  }
}, {
  tableName: C.pgsql.prefix+'member',
  comment: '基础用户表',
  indexes: [
    {
      unique: true,
      fields: ['phone']
    },
    {
      unique: true,
      fields: ['email']
    }
  ],
  createdAt: 'create',
  updatedAt: 'updated',
  charset: 'utf8',
  collate: 'utf8_general_ci'
});
};