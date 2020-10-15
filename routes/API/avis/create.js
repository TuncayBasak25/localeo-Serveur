const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');


const autoLogger = require('../../../middleware/autoLogger');
router.all('/', ash(autoLogger) );
router.all('/', ash(async (req, res, next) => {
  if (!req.user)
  {
    res.send({ error: "You are not connected!" })
    return;
  }
  next();
}));

router.post('/', ash(async (req, res, next) => {
  let { user } = req;
  let { avis } = req.body;

  const avisSchema = Joi.object({
    destinaterId: Joi.number().integer().required(),
    title: Joi.string().min(4).max(32).required(),
    message: Joi.string().min(4).max(255).required(),
    stars: Joi.number().integer().min(1).max(5).required()
  });

  let val = avisSchema.validate(avis);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }

  let destinater = await db.User.findOne({ where: { id: avis.destinaterId } });

  if (!destinater)
  {
    res.send({ error: "Destinater doesn't exist." });
    return;
  }
  delete avis.destinaterId;

  avis = await db.Avis.create(avis);
  await avis.setPoster(user);
  await avis.setDestinater(destinater);

  res.send({ avis: avis });
}));


module.exports = router;
