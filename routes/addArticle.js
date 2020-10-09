const express = require('express');
const router = express.Router();

const db = require('../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');

const articleSchema = Joi.object({
  title: Joi.string().min(4).max(16).required(),
  description: Joi.string().min(4).max(255).required(),
  price: Joi.number().integer().min(1).max(1000).required()
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
  res.render('addArticle');
});

router.post('/', ash(async (req, res, next) => {
  let { user } = req;

  let article = {
    title: req.body.title,
    description: req.body.description,
    price: parseInt(req.body.price)
  }

  let images = [];
  if (req.files)
  {
    let { image1, image2, image3 } = req.files;
    images = [image1, image2, image3];
  }

  const validateArticleSchema = articleSchema.validate(article);

  if (validateArticleSchema.error)
  {
    res.render('addArticle', { error: validateArticleSchema.error.details[0].message, body: req.body });
    return;
  }

  article = await db.Article.create(article);
  await user.addArticle(article);

  for(let i=0; i < images.length; i++)
  {
    let image = images[i];
    if (image)
    {
      image = await db.Image.create({ data: image.data });
      await article.addImage(image);
    }
  }

  res.render('addArticle', { error: "Article posted successfully."});
}));

module.exports = router;
