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
      User.hasOne(models.UserSecret, { onDelete: 'cascade' } );
      User.hasOne(models.Avatar, { onDelete: 'cascade' } );

      User.hasMany(models.Avis, {
        as: 'postedAvis',
        foreignKey: { field: 'PosterId' },
        onDelete: 'cascade'
      });

      User.hasMany(models.Avis, {
        as: "destinatedAvis",
        foreignKey: { field: 'DestinaterId' },
        onDelete: 'cascade'
      });

      User.hasMany(models.ChatRoom, {
        as: 'buyingChat',
        foreignKey: { field: 'BuyerId' },
        onDelete: 'cascade'
      });

      User.hasMany(models.ChatRoom, {
        as: 'sellingChat',
        foreignKey: { field: 'SellerId' },
        onDelete: 'cascade'
      });

      User.hasMany(models.Message, {
        as: "sentMessage",
        foreignKey: { field: 'PosterId' },
        onDelete: 'cascade'
      });

      User.hasMany(models.Message, {
        as: "recievedMessage",
        foreignKey: { field: 'DestinaterId' },
        onDelete: 'cascade'
      });

      User.hasMany(models.Article, { onDelete: 'cascade' } );

      User.hasMany(models.ArchivedArticle, { onDelete: 'cascade' } );
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

    requestCount: DataTypes.INTEGER,

    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
