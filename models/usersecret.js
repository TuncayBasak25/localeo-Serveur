'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSecret extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserSecret.belongsTo(models.User);
    }
  };
  UserSecret.init({
    password: DataTypes.STRING,
    sessionTokens: {
      type: DataTypes.STRING(60000),
      defaultValue: '{}'
    },
  }, {
    sequelize,
    modelName: 'UserSecret',
  });
  return UserSecret;
};
