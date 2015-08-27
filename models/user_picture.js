module.exports = function(sequelize, DataTypes) {
   var C = require('../config/config')();
  return sequelize.define('user_picture', {
    path: {
      type: DataTypes.STRING,
    allowNull: false,
    comment: '存储路径',
      get: function(){
        return C.host[this.getDataValue('hostid')]+this.getDataValue('path');
      }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '图片名称'
  },
  userid: {
    type:  DataTypes.INTEGER,   
    allowNull: false,
    comment: '用户ID',
    validate: {
      isInt: true //判定是数字   
    }
  },
    width: {
      type:  DataTypes.INTEGER,
      allowNull: true,
      comment: '图片宽度',
      validate: {
        isInt: true //判定是数字
      }
    },
    height: {
      type:  DataTypes.INTEGER,
      allowNull: true,
      comment: '图片高度',
      validate: {
        isInt: true //判定是数字
      }
    },
  hostid: {
    type:  DataTypes.INTEGER,
    allowNull: false,
    comment: '存储id',
    validate: {
      isInt: true //判定是数字   
    }
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
  tableName: C.mysql.prefix+'user_picture',
  comment: '用户基础图片附件表',
  createdAt: 'create',
  updatedAt: 'updated',
  charset: 'utf8',
  collate: 'utf8_general_ci'
});
}