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

      Article.belongsTo(models.User, { onDelete: 'cascade' });

      Article.hasMany(models.Image, { onDelete: 'cascade' });

      Article.belongsTo(models.Category, { onDelete: 'cascade' });
      Article.belongsTo(models.SousCategory, { onDelete: 'cascade' });
    }
  };
  Article.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    sousCategory: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};
