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
        foreignKey: { field: 'sourceId' },
        onDelete: 'cascade'
      });

      Message.belongsTo(models.User, {
        as: "target",
        foreignKey: { field: 'targetId' },
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
