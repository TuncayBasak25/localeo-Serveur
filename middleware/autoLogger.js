const db = require('../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const autoLogger = async (req, res, next) => {
  const secret = await db.UserSecret.findOne({
    where: {
      sessionTokens: {
        [Op.substring]: req.session.id
      }
    }
  });

  if (secret)
  {
    let user = await secret.getUser();
    req.user = user;
  }
  else
  {
    req.user = await db.User.findOne({ where: { id: 1 } });
  }

  next();
}

module.exports = autoLogger;
