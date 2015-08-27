module.exports = function(sequelize, DataTypes) {
   var C = require('../config/config')();
  return sequelize.define('user',{
  phone: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    comment: '手机',
    validate: {
      isInt: true //判定是数字
    }
  },
  password: {
    type: DataTypes.STRING(34),
    allowNull: false,
    comment: '用户密码'
  },
  email: {
    type: DataTypes.STRING(120),     // VARCHAR(255),
    allowNull: true,
    unique: true,
    comment: '用户邮箱',
    validate: {
       isEmail: true           // checks for email format (foo@bar.com)
    }
  },
  name: {
    type: DataTypes.STRING(20),   
    allowNull: true,
    comment: '用户真实姓名',
    validate: {
     len: [1,20]             // only allow values with length
    }
  },
  nickname: {
    type: DataTypes.STRING(20),    
    allowNull: false,
    comment: '用户昵称',
    validate: {
     len: [1,20]             // only allow values with length
    }
  },
    sex: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: '性别',
      validate: {
        isInt: true //判定是数字
      }
    },
    groupid: {
    type: DataTypes.TINYINT(2),
    allowNull: false,
    defaultValue: 0,
    comment: '用户组',
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
    wxopenid: {
      type: DataTypes.STRING(120),
      allowNull:true,
      comment: '微信用户标识'
    },
    integral: {
      type: DataTypes.INTEGER,
      allowNull:true,
      comment: '用户积分',
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
    curBaby: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '当前宝宝ID',
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
  tableName: C.mysql.prefix+'user',
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
}