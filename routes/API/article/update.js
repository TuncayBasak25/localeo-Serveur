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
  let { newArticle } = req.body;

  let categories = await db.Category.findAll();
  let categoryList = [];
  for (let category of categories) categoryList.push(category.dataValues.name);

  let sousCategories = await db.Category.findAll();
  let sousCategoryList = [];
  for (let sousCategory of sousCategories) sousCategoryList.push(category.dataValues.name);

  const articleSchema = Joi.object({
    id: Joi.number().integer().required(),
    title: Joi.string().min(4).max(16),
    description: Joi.string().min(4).max(255),
    price: Joi.number().integer().min(1).max(1000),
    lattitude: Joi.number(),
    longitude: Joi.number(),
    category: Joi.string().valid(...categoryList),
    sousCategory: Joi.string().valid(...sousCategoryList)
  });

  let val = articleSchema.validate(newArticle);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }

  let article = await db.Article.findOne({ where: { id: newArticle.id } });

  const possede = await user.hasArticle(article);

  if (!possede)
  {
    res.send({ error: "This article doesn't belongs to you." });
    return;
  }

  delete newArticle.id;

  for (let entry of Object.entries(newArticle))
  {
    article[entry] = newArticle[entry];
  }

  await article.save();

  res.send({ article: article });
}));


module.exports = router;
