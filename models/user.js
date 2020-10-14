'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserSecret);
      User.hasOne(models.Avatar);

      User.hasMany(models.Avis, {
        as: 'postedAvis',
        foreignKey: { field: 'posterId' }
      });

      User.hasMany(models.Avis, {
        as: "destinatedAvis",
        foreignKey: { field: 'destinaterId' }
      });

      User.hasMany(models.ChatRoom, {
        as: 'buyingChat',
        foreignKey: { field: 'buyerId' }
      });

      User.hasMany(models.ChatRoom, {
        as: 'sellingChat',
        foreignKey: { field: 'sellerId' }
      });

      User.hasMany(models.Message, {
        as: "sentMessage",
        foreignKey: { field: 'sourceId' }
      });

      User.hasMany(models.Message, {
        as: "recievedMessage",
        foreignKey: { field: 'targetId' }
      });

      User.hasMany(models.Article);

      User.hasMany(models.ArchivedArticle);
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    email: DataTypes.STRING,

    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    lattitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,

    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
