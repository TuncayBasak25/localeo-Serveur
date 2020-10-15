const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');


// const autoLogger = require('../../../../middleware/autoLogger');
// router.all('/', ash(autoLogger) );
// router.all('/', ash(async (req, res, next) => {
//   if (!req.user)
//   {
//     res.send({ error: "You are not connected!" })
//     return;
//   }
//   next();
// }));


router.get('/', ash(async (req, res, next) => {
  let { imageId } = req.query;
  imageId = parseInt(imageId);

  const image = await db.Image.findOne({ where: { id: imageId } });

  if (image) image.dataValues.data = image.dataValues.data.toString('base64');

  res.send( image );
}));

module.exports = router;
