const express = require('express');
const router = express.Router();

const db = require('../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const bcrypt = require('bcrypt');
const salt = 10;

const Joi = require('joi');//lol

const userSchema = Joi.object({
  username: Joi.string().min(4).max(16).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(256).required(),
  passwordConfirm: Joi.string().equal(Joi.ref('password')).required()
});

const autoLogger = require('../middleware/autoLogger');
router.all('/*', ash(autoLogger) );
router.all('/*', ash(async (req, res, next) => {
  if (req.user)
  {
    res.redirect('/');
    return;
  }
  next();
}));

router.get('/', (req, res, next) => {
  res.render('register');
});

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
    res.render('register', { error: validateUserSchema.error.details[0].message, body: req.body });
    return;
  }

  let testUser = await db.User.findOne({ where: {username: user.username } });

  if (testUser)
  {
    res.render('register', { error: "This username is already taken.", body: req.body });
    return;
  }

  testUser = await db.User.findOne({ where: {email: req.body.email } });

  if (testUser)
  {
    res.render('register', { error: "This email is already taken.", body: req.body });
    return;
  }

  const hash = await bcrypt.hash(user.password, salt);

  const secret = {
    password: hash,
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

  res.redirect('/');
}));

module.exports = router;
