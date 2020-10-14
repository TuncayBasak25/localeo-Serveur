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


const autoLogger = require('../middleware/autoLogger');
router.all('/', ash(autoLogger) );
router.all('/', ash(async (req, res, next) => {
  if (req.user)
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

  user = await db.User.findOne({
    where: {
      username: user.username
    },
    include: [
      { model: db.Avatar }
    ]
  });

  if (!user)
  {
    res.render('login', { error: "User don't exists.", lastUsername: req.body.username });
    return;
  }

  let secret = await user.getUserSecret();

  if (secret.dataValues.password !== req.body.password)
  {
    res.render('login', { error: "Password is wrong.", lastUsername: req.body.username });
    return;
  }

  let sessionTokens = JSON.parse(secret.dataValues.sessionTokens);

  sessionTokens[req.session.id] = true;

  secret.sessionTokens = JSON.stringify(sessionTokens);

  await secret.save();

  res.redirect('/');
}));

module.exports = router;
