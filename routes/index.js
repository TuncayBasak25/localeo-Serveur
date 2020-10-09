var express = require('express');
var router = express.Router();

const db = require('../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

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
    let avatar = await user.getAvatar();

    if (avatar) avatar = avatar.data.toString('base64');

    res.render('userhome', {
      username: user.dataValues.username,
      avatar: avatar
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
