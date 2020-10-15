const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');


const autoLogger = require('../../../middleware/autoLogger');
router.all('/', ash(autoLogger) );
router.all('/', ash(async (req, res, next) => {
  if (!req.user)
  {
    res.send({ error: "You are not connected!" })
    return;
  }
  next();
}));

router.get('/', ash(async (req, res, next) => {
  let { user } = req;
  let { messageId } = req.query;

  if (!messageId)
  {
    res.send({ error: "There is no messageId" });
    return;
  }
  messageId = parseInt(messageId);

  let message = await db.Message.findOne({
    where: {
      [Op.and]: [
        { id: messageId },
        {
          [Op.or]: [
            { PosterId: user.dataValues.id },
            { DestinaterId: user.dataValues.id }
          ]
        }
      ]
    }
  });

  res.send( { message: message } );
}));

router.get('/getChatRoom', ash(async (req, res, next) => {
  let { user } = req;
  let { corresponderId } = req.query;

  if (!corresponderId)
  {
    res.send({ error: "There is no corresponderId" });
    return;
  }
  corresponderId = parseInt(corresponderId);

  let destinater = db.User.findOne({ where: { id: corresponderId } });
  if (!destinater)
  {
    res.send({ error: "There is no such corresponder." });
    return;
  }

  let chatRoom = await db.ChatRoom.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { PosterId: corresponderId },
            { DestinaterId: corresponderId }
          ]
        },
        {
          [Op.or]: [
            { PosterId: user.dataValues.id },
            { DestinaterId: user.dataValues.id }
          ]
        }
      ]
    }
  });

  if (!chatRoom)
  {
    res.send({ error: "There is no such chatRoom." });
    return;
  }

  res.redirect('/API/message/roomMessages?chatRoomId=' + chatRoom.dataValues.id)
}));

router.get('/roomMessages', ash(async (req, res, next) => {
  let { user } = req;
  let { chatRoomId, page, max } = req.query;

  if (!chatRoomId)
  {
    res.send({ error: "There is no chatRoomId" });
    return;
  }
  chatRoomId = parseInt(chatRoomId);

  if (!page) page = 1;
  page = parseInt(page);

  if (!max) max = 20;
  max = parseInt(max);
  if (max > 20)
  {
    res.send( { error: "Max per page is 20" } );
    return;
  }

  let chatRoom = await db.ChatRoom.findOne({
    where: {
      [Op.and]: [
        { id: chatRoomId },
        {
          [Op.or]: [
            { BuyerId: user.dataValues.id },
            { SellerId: user.dataValues.id }
          ]
        }
      ]
    }
  });

  if (!chatRoom)
  {
    res.send({ error: "ChatRoom doesn't exist." });
    return;
  }

  let messageList = await db.Message.findAll({
    where: {
      ChatRoomId: chatRoom.dataValues.id
    },
    limit: max,
    offset: (page-1) * max
  });

  res.send( messageList );
}));


module.exports = router;
