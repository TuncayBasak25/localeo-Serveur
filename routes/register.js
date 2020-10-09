const express = require('express');
const router = express.Router();

const db = require('../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(4).max(16).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(256).required(),
  passwordConfirm: Joi.string().equal(Joi.ref('password')).required()
});

router.all('/', ash(async (req, res, next) => {
  const user = await db.User.findOne({
    where: {
      sessionTokens: {
        [Op.substring]: req.session.id
      }
    }
  });

  if (user)
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
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  }

  const validateUserSchema = userSchema.validate(user);

  if (validateUserSchema.error)
  {
    res.render('register', { error: valid.error.details[0].message, body: req.body });
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

  delete user.passwordConfirm;

  await db.User.create(user);

  res.redirect('/');
}));

module.exports = router;
