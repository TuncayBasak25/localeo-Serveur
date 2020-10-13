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
      User.hasOne(models.UserInfo);
      User.hasOne(models.Avatar);

      User.hasMany(models.Avis, {
        as: 'postedAvis',
        foreignKey: { field: 'posterId' }
      });

      User.hasMany(models.Avis, {
        as: "destinatedAvis",
        foreignKey: { field: 'destinaterId' }
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
    password: DataTypes.STRING,
    sessionTokens: DataTypes.STRING(60000),
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
