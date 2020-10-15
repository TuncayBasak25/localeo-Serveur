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

  await db.Message.destroy({
    where: {
      [Op.and]: [
        { id: messageId },
        { PosterId: user.dataValues.id }
      ]
    }
  });

  res.send( {} );
}));


module.exports = router;
