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

  let messageList = await chatRoom.getMessages({
    limit: max,
    offset: (page-1) * max
  });

  res.send( messageList );
}));


module.exports = router;
