const express = require('express');
const router = express.Router();

const db = require('../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const autoLogger = require('../middleware/autoLogger');

router.all('/*', ash(autoLogger) );

router.all('/', ash(async (req, res, next) => {
  if (req.user)
  {
    let secret = await user.getUserSecret();
    let sessionTokens = JSON.parse(secret.dataValues.sessionTokens);

    delete sessionTokens[req.sessionToken];

    secret.sessionTokens = JSON.stringify(sessionTokens);

    await secret.save();
  }

  res.redirect('/');
}));


module.exports = router;
