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
        as: "poster",
        foreignKey: { field: 'PosterId' },
        onDelete: 'cascade'
      });

      Message.belongsTo(models.User, {
        as: "destinater",
        foreignKey: { field: 'DestinaterId' },
        onDelete: 'cascade'
      });

      Message.belongsTo(models.ChatRoom, { onDelete: 'cascade' });
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
