'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Message.belongsTo(models.User, {
        as: "source",
        foreignKey: { field: 'sourceId' }
      });

      Message.belongsTo(models.User, {
        as: "target",
        foreignKey: { field: 'targetId' }
      });
    }
  };
  Message.init({
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
