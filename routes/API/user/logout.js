const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../models/index');
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
    let sessionTokens = JSON.parse(user.dataValues.sessionTokens);

    delete sessionTokens[req.session.id];

    user.sessionTokens = JSON.stringify(sessionTokens);

    await user.save();
  }

  res.send({});
}));


module.exports = router;
