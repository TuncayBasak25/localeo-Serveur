const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');


const autoLogger = require('../../../middleware/autoLogger');
router.all('/*', ash(autoLogger) );
router.all('/*', ash(async (req, res, next) => {
  if (!req.user)
  {
    res.send({ error: "You are not connected!" })
    return;
  }
  next();
}));

router.post('/', ash(async (req, res, next) => {
  let { user } = req;
  let { article } = req.body;

  let categories = await db.Category.findAll();
  let categoryList = [];
  for (let category of categories) categoryList.push(category.dataValues.name);

  let sousCategories = await db.Category.findAll();
  let sousCategoryList = [];
  for (let sousCategory of sousCategories) sousCategoryList.push(sousCategory.dataValues.name);

  const articleSchema = Joi.object({
    title: Joi.string().min(4).max(16).required(),
    description: Joi.string().min(4).max(255).required(),
    price: Joi.number().integer().min(1).max(1000).required(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    category: Joi.string().valid(...categoryList),
    sousCategory: Joi.string().valid(...sousCategoryList)
  });

  let val = articleSchema.validate(article);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }

  article = await db.Article.create(article);
  await user.addArticle(article);

  res.send({ article: article });
}));


module.exports = router;
