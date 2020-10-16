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

router.post('/', ash(async (req, res, next) => {
  let { user } = req;
  let { message } = req.body;

  const messageSchema = Joi.object({
    destinaterId: Joi.number().integer().required(),
    text: Joi.string().min(4).max(255).required()
  });

  let val = messageSchema.validate(message);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }

  let destinater = await db.User.findOne({ where: { id: message.destinaterId } });

  if (!destinater)
  {
    res.send({ error: "Destinater doesn't exist." });
    return;
  }
  delete message.destinaterId;

  let chatRoom = await db.ChatRoom.findOne({
    where: {
      [Op.or]: [
        {[Op.and]: [
            { BuyerId: user.dataValues.id },
            { SellerId: destinater.dataValues.id }
          ]},
          {[Op.and]: [
            { BuyerId: destinater.dataValues.id },
            { SellerId: user.dataValues.id },
          ]}
        }
      ]
    }
  });

  if (!chatRoom)
  {
    chatRoom = await db.ChatRoom.create();
    await chatRoom.setBuyer(user);
    await chatRoom.setSeller(destinater);
  }

  message = await db.Message.create(message);
  await message.setPoster(user);
  await message.setDestinater(destinater);
  await message.setChatRoom(chatRoom);

  res.send({ message: message });
}));


module.exports = router;
