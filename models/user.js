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
        as: "postedAvis"
      });

      User.getPostedAvis = () => {
        return models.Avis.findAll(
          {
            where: {
              posterId: this.id
            }
          }
        );
      }

      User.hasMany(models.Avis, {
        as: "destinatedAvis"
      });

      User.getDestinatedAvis = () => {
        return models.Avis.findAll(
          {
            where: {
              destinaterId: this.id
            }
          }
        );
      }

      User.hasMany(models.Message, {
        as: "postedMessage"
      });

      User.getPostedMessage = () => {
        return models.Message.findAll(
          {
            where: {
              posterId: this.id
            }
          }
        );
      }

      User.hasMany(models.Message, {
        as: "recievedMessage"
      });

      User.getDestinatedMessage = () => {
        return models.Message.findAll(
          {
            where: {
              destinaterId: this.id
            }
          }
        );
      }

      User.hasMany(models.Article);

      User.hasMany(models.ArchivedArticle);
    }
  };
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    sessionTokens: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
