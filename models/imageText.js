'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageText extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ImageText.belongsTo(models.Article);
    }
  };
  ImageText.init({
    data: DataTypes.TEXT({ length: 'long' })
  }, {
    sequelize,
    modelName: 'ImageText',
  });
  return ImageText;
};
