const db = require('../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const autoLogger = async (req, res, next) => {
  const secret = await db.UserSecret.findOne({
    where: {
      sessionTokens: {
        [Op.substring]: sessionId
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
