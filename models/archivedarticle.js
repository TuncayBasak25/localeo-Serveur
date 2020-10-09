'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ArchivedArticle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ArchivedArticle.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    geolocation: DataTypes.STRING,
    categories: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ArchivedArticle',
  });
  return ArchivedArticle;
};