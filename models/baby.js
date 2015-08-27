module.exports = function(sequelize, DataTypes) {
   var C = require('../config/config')();
  return sequelize.define('baby', {
  name: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '真实姓名',
    validate: {
      len: [1,20] 
    }
  },
  nickname: {
     type: DataTypes.STRING(20),
    allowNull: false,
    comment: '昵称',
     validate: {
      len: [1,20] 
    }
  },
  birthday: {
    type:  DataTypes.INTEGER,   
    allowNull: false,
    comment: '出生/预产时间',
    validate: {
      isInt: true //判定是数字   
    }
  },
  image: {
    type: DataTypes.INTEGER,
    allowNull:true,
    comment: '头像ID',
    validate: {
      isInt: true //判定是数字
    }
  },
    imageurl: {
      type: DataTypes.STRING(120),
      allowNull:true,
      comment: '头像地址'
    },
    sex: {
      type:DataTypes.TINYINT(1),
      allowNull: true,
      comment: '性别',
      validate: {
        isInt: true //判定是数字
      }
    },
    like: {
      type: DataTypes.INTEGER,
      allowNull:true,
      comment: '关注数',
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
  tableName: C.mysql.prefix+'baby',
  comment: '宝宝基础表',
  createdAt: 'create',
  updatedAt: 'updated',
  charset: 'utf8',
  collate: 'utf8_general_ci'
});
}