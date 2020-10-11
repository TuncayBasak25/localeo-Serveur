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
        as: "poster",
        foreignKey: { field: 'posterId' }
      });

      Avis.belongsTo(models.User, {
        as: "destinater",
        foreignKey: { field: 'destinaterId' }
      });
    }
  };
  Avis.init({
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    stars: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Avis',
  });
  return Avis;
};
