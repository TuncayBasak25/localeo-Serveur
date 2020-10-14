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
  let { article, images } = req.body;

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

  for(let image of images)
  {
    if (image)
    {
      await article.createImage({ data: new Buffer.alloc(image.length, image, 'base64') });
    }
  }

  res.send({});
}));


module.exports = router;
