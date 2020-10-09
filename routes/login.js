const express = require('express');
const router = express.Router();

const db = require('../models/index');
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
  res.render('login');
});

router.post('/', ash(async (req, res, next) => {
  let user = {
    username: req.body.username,
    password: req.body.password
  }

  const validateUserSchema = userSchema.validate(user);

  if (validateUserSchema.error)
  {
    res.render('login', { error: validateUserSchema.error.details[0].message, body: req.body });
    return;
  }

  user = await db.User.findOne({ where: {username: user.username } });

  if (!user)
  {
    res.render('login', { error: "User don't exists.", lastUsername: req.body.username });
    return;
  }

  if (user.dataValues.password !== req.body.password)
  {
    res.render('login', { error: "Password is wrong.", lastUsername: req.body.username });
    return;
  }

  if (user.dataValues.sessionTokens === null) user.dataValues.sessionTokens = JSON.stringify({});
  let sessionTokens = JSON.parse(user.dataValues.sessionTokens);

  sessionTokens[req.session.id] = true;

  user.sessionTokens = JSON.stringify(sessionTokens)

  await user.save();

  res.redirect('/');
}));

module.exports = router;
