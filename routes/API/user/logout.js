const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const autoLogger = require('../../../middleware/autoLogger');
router.all('/', ash(autoLogger) );
router.all('/', ash(async (req, res, next) => {
  if (req.user)
  {
    let secret = await req.user.getUserSecret();
    let sessionTokens = JSON.parse(secret.dataValues.sessionTokens);

    delete sessionTokens[req.session.id];

    secret.sessionTokens = JSON.stringify(sessionTokens);

    await secret.save();
  }

  res.send({});
}));


module.exports = router;
