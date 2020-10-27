var express = require('express');
var router = express.Router();

const db = require('../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const autoLogger = require('../middleware/autoLogger');

router.all('/', ash(autoLogger) );

router.all('/', ash(async (req, res, next) => {
  const { user } = req;

  if (user)
  {
    let avatar = await user.getAvatar();
    res.render('userhome', {
      username: user.dataValues.username,
      avatar: avatar.dataValues.data.toString('base64')
    });
  }
  else
  {
    res.render('home', {
      title: 'Home'
    });
  }
}));


module.exports = router;
