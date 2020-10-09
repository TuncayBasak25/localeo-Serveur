'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Avis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Avis.belongsTo(models.User, {
        as: "Poster"
      });

      Avis.belongsTo(models.User, {
        as: "Destinater"
      });
    }
  };
  Avis.init({
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    stars: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Avis',
  });
  return Avis;
};
