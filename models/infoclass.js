module.exports = function(sequelize, DataTypes) {
   var C = require('../config/config')();
  return sequelize.define('infoclass',{
  fid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    comment: '父类ID',
    validate: {
      isInt: true //判定是数字
    }
  },
    classname: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '分类名称',
      validate: {
        len: [1,20]             // only allow values with length
      }
    },
    classdes: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '分类描述',
      validate: {
        len: [1,200]             // only allow values with length
      }
    },
    hascild: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment: '是否有子类',
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
  tableName: C.mysql.prefix+'infoclass',
  comment: '信息分类表',
  createdAt: 'create',
  updatedAt: 'updated',
  charset: 'utf8',
  collate: 'utf8_general_ci'
});
}