const express = require('express');
const router = express.Router();

const db = require('../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');

const avisSchema = Joi.object({
  title: Joi.string().min(4).max(16).required(),
  message: Joi.string().min(4).max(255).required(),
  stars: Joi.number().integer().min(1).max(5).required()
});

router.all('/', ash(async (req, res, next) => {
  const user = await db.User.findOne({
    where: {
      sessionTokens: {
        [Op.substring]: req.session.id
      }
    }
  });

  if (!user)
  {
    res.redirect('/');
    return;
  }

  req.user = user;
  next();
}));

router.get('/', (req, res, next) => {
  res.render('postAvis', { user: req.user });
});

router.post('/', ash(async (req, res, next) => {
  let { user } = req;

  let avis = {
    title: req.body.title,
    message: req.body.message,
    stars: parseInt(req.body.stars)
  }

  const validateAvisSchema = avisSchema.validate(avis);

  if (validateAvisSchema.error)
  {
    res.render('postAvis', { error: validateAvisSchema.error.details[0].message, body: req.body, user: user });
    return;
  }

  avis = await db.Avis.create(avis);
  await avis.setPoster(user);
  await avis.setDestinater(user);

  res.render('postAvis', { error: "Avis posted successfully.", user: user});
}));

module.exports = router;
