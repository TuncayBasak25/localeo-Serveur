const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');


// const autoLogger = require('../../../middleware/autoLogger');
// router.all('/*', ash(autoLogger) );
// router.all('/*', ash(async (req, res, next) => {
//   if (!req.user)
//   {
//     res.send({ error: "You are not connected!" })
//     return;
//   }
//   next();
// }));

router.get('/', ash(async (req, res, next) => {
  let { userId } = req.query;

  if (!userId)
  {
    res.send({ error: "There is no userId" });
    return;
  }
  userId = parseInt(userId);

  let user = await db.User.findOne({
    where: {
      id: userId
    },
    include: [ db.Avatar ]
  });

  if (user.Avatar && user.Avatar.data) user.Avatar.data = user.Avatar.data.toString('base64');

  res.send( { user: user } );
}));


module.exports = router;
