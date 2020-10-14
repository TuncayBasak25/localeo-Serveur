const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(4).max(16).required(),
  password: Joi.string().min(8).max(256).required()
});

router.all('/', ash(async (req, res, next) => {
  const user = await db.User.findOne({
    where: {
      sessionTokens: {
        [Op.substring]: req.session.id
      }
    },
    include: [
      { model: db.Avatar },
      { model: db.UserInfo }
    ]
  });

  if (user)
  {
    res.send({ user });
    return;
  }

  next();
}));

router.post('/', ash(async (req, res, next) => {
  let user = {
    username: req.body.username,
    password: req.body.password
  }

  const validateUserSchema = userSchema.validate(user);

  if (validateUserSchema.error)
  {
    res.send({ error: validateUserSchema.error.details[0].message });
    return;
  }

  const user = await db.User.findOne({
    where: {
      username: user.username
    },
    include: {[
      { model: db.Avatar },
      { model: db.UserInfo }
    ]}
  });

  if (!user)
  {
    res.send( { error: "User don't exists." });
    return;
  }

  if (user.dataValues.password !== req.body.password)
  {
    res.send( { error: "Password is wrong." });
    return;
  }

  let sessionTokens = JSON.parse(user.dataValues.sessionTokens);

  sessionTokens[req.session.id] = true;

  user.sessionTokens = JSON.stringify(sessionTokens);

  await user.save();

  res.send({ user });
}));

module.exports = router;
