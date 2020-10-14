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
  let { article } = req.body;

  let categories = await db.Category.findAll();
  let categoryList = [];
  for (let category of categories) categoryList.push(category.dataValues.name);

  let sousCategories = await db.Category.findAll();
  let sousCategoryList = [];
  for (let sousCategory of sousCategories) sousCategoryList.push(category.dataValues.name);

  const articleSchema = Joi.object({
    title: Joi.string().min(4).max(16).required(),
    description: Joi.string().min(4).max(255).required(),
    price: Joi.number().integer().min(1).max(1000).required(),
    lattitude: Joi.number(),
    longitude: Joi.number(),
    category: Joi.string().valid(...categoryList),
    sousCategory: Joi.string().valid(...sousCategoryList)
  });

  const imageSchema = Joi.object({ image: Joi.string().max(500000) });

  for (let image of images)
  {
    if (!imageSchema.validate(image))
    {
      res.send({ error: "The image is too large or in different form." });
      return;
    }
  }

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

router.post('/', ash(async (req, res, next) => {
  let { user } = req;
  let { data, imageId, articleId } = req.body;


  if (!data || typeof data !== 'string')
  {
    res.send({ error: "Image is null or not in Base64 format" });
    return;
  }

  if (!articleId)
  {
    res.send({ error: "There is no articleId" });
    return;
  }
  articleId = parseInt(articleId);

  if (!imageId)
  {
    res.send({ error: "There is no imageId" });
    return;
  }
  imageId = parseInt(imageId);

  let article = await db.Article.findOne({ where: { id: articleId } });

  const possede = await user.hasArticle(article);

  if (!possede)
  {
    res.send({ error: "This article doesn't belongs to you." });
    return;
  }

  await article.createImage({ data: new Buffer.alloc(data.length, data, 'base64') });

  res.send({});
}));

module.exports = router;
