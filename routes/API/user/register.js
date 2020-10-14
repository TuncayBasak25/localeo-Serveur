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
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(256).required(),
  passwordConfirm: Joi.string().equal(Joi.ref('password')).required()
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
  let user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  }

  let data = null;
  if (req.files && req.files.avatar) data = req.files.avatar.data;


  const validateUserSchema = userSchema.validate(user);

  if (validateUserSchema.error)
  {
    res.send({ error: validateUserSchema.error.details[0].message });
    return;
  }

  let testUser = await db.User.findOne({ where: {username: user.username } });

  if (testUser)
  {
    res.send({ error: "This username is already taken." });
    return;
  }

  testUser = await db.User.findOne({ where: {email: req.body.email } });

  if (testUser)
  {
    res.send({ error: "This email is already taken." });
    return;
  }

  const secret = {
    password: user.password,
    sessionTokens: '{}'
  }
  delete user.passwordConfirm;
  delete user.password;

  user = await db.User.create(user);
  await user.createUserSecret(secret)

  if (data)
  {
    let avatar = await db.Avatar.create({ data: data});
    await user.setAvatar(avatar);
  }

  res.send({});
}));

module.exports = router;
