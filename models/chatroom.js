'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ChatRoom.belongsTo(models.User, {
        as: "buyer",
        foreignKey: { field: 'buyerId' },
        onDelete: 'cascade'
      });

      ChatRoom.belongsTo(models.User, {
        as: "seller",
        foreignKey: { field: 'sellerId' },
        onDelete: 'cascade'
      });

      ChatRoom.hasMany(models.Message, { onDelete: 'cascade' });
    }
  };
  ChatRoom.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChatRoom',
  });
  return ChatRoom;
};
