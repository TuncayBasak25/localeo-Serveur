'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Article.belongsTo(models.User);

      Article.hasMany(models.Image);

      Article.belongsTo(models.Category);
      Article.belongsTo(models.SousCategory);
    }
  };
  Article.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    lattitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    sousCategory: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};
