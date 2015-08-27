module.exports = function(sequelize, DataTypes) {
   var C = require('../config/config')();
  return sequelize.define('user_baby', {
    userid: {
    type:  DataTypes.INTEGER,   
    allowNull: false,
    comment: '用户ID',
    validate: {
      isInt: true //判定是数字   
    }
  },
  babyid: {
    type:  DataTypes.INTEGER,   
    allowNull: false,
    comment: '宝宝ID',
    validate: {
      isInt: true //判定是数字   
    }
  },
  roleid: {
    type: DataTypes.TINYINT(2),
    allowNull: false,
    comment: '角色ID',
    validate: {
      isInt: true //判定是数字   
    }
  },
   isadmin: {
    type: DataTypes.INTEGER(1),
    allowNull: false,
    defaultValue: 0,
    comment: '是否是创建者',
    validate: {
      isInt: true //判定是数字
    }
  },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '宝宝喊的昵称',
      validate: {
        len: [1,20]
      }
    },
  authority: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '权限字符串'
  },
    status: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      defaultValue: 0,
      comment: '状态',
      validate: {
        isInt: true //判定是数字
      }
    }
}, {
  tableName: C.mysql.prefix+'user_baby',
  comment: '用户宝宝关系表',
  createdAt: 'create',
  updatedAt: 'updated',
  charset: 'utf8',
  collate: 'utf8_general_ci'
});
}