'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SousCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SousCategory.belongsTo(models.Category);
      SousCategory.hasMany(models.Article);
    }
  };
  SousCategory.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SousCategory',
  });
  return SousCategory;
};
