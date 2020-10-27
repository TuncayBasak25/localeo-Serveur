const db = require('../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const autoLogger = async (req, res, next) => {
  let { sessionToken } = req.body;
  if (!sessionToken) sessionToken = req.query.sessionToken;
  if (!sessionToken)
  {
    res.send({ error: "There is no session token" });
    return;
  }

  req.sessionToken = sessionToken;

  const secret = await db.UserSecret.findOne({
    where: {
      sessionTokens: {
        [Op.substring]: sessionToken
      }
    }
  });

  if (secret)
  {
    let user = await secret.getUser();
    req.user = user;
  }

  next();
}

module.exports = autoLogger;
