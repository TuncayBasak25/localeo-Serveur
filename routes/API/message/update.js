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
  let { newMessage } = req.body;

  const messageSchema = Joi.object({
    messageId: Joi.number().integer().required(),
    text: Joi.string().min(4).max(255).required()
  });

  let val = messageSchema.validate(newMessage);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }

  let message = await db.Message.findOne({
    where: {
      [Op.and]: [
        { id: newMessage.messageId },
        { PosterId: user.dataValues.id }
      ]
    }
  });

  message.text = newMessage.text;

  await message.save();

  res.send({ message: message });
}));


module.exports = router;
