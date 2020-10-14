const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const bcrypt = require('bcrypt');
const salt = 10;

const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(4).max(16).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(256).required(),
  passwordConfirm: Joi.string().equal(Joi.ref('password')).required()
});

const avatarSchema = Joi.object({
  avatar: Joi.string().max(50000)
});

const autoLogger = require('../../../middleware/autoLogger');
router.all('/', ash(autoLogger) );
router.all('/', ash(async (req, res, next) => {
  if (req.user)
  {
    res.send({ error: "You are already connected" });
    return;
  }
  next();
}));

router.post('/', ash(async (req, res, next) => {
  const { userInputs, avatarData } = req.body;

  let val = userSchema.validate(userInputs);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }

  val = avatarSchema.validate(avatarData);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }

  let testUser = await db.User.findOne({ where:  { username: userInputs.username } });

  if (testUser)
  {
    res.send({ error: "This username is already taken." });
    return;
  }

  testUser = await db.User.findOne({ where: { email: userInputs.email } });

  if (testUser)
  {
    res.send({ error: "This email is already taken." });
    return;
  }

  const hash = await bcrypt.hash(userInputs.password, salt);

  const secret = {
    password: hash,
    sessionTokens: '{}'
  }

  delete userInputs.passwordConfirm;
  delete userInputs.password;

  user = await db.User.create(userInputs);
  await user.createUserSecret(secret)

  let data = null;
  if (avatarData)
  {
    data = avatarData;
  }
  let avatar = await db.Avatar.create({ data: data});
  await user.setAvatar(avatar);

  res.send({});
}));

module.exports = router;
