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
    res.render('userhome', {
      username: user.dataValues.username
    });
  }
  else
  {
    res.render('home', {
      title: 'Home'
    });
  }
}));

router.all('/addAvis', ash(async (req, res, next) => {
  const user = await db.User.findOne({
    where: {
      username: 'tuncay'
    }
  });

  const avis = await db.Avis.create();

  await avis.setPoster(user);

  console.log(await user.getPostedAvis());

  res.redirect('/');
}));



module.exports = router;
