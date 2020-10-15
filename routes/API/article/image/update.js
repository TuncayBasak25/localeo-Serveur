const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');


const autoLogger = require('../../../../middleware/autoLogger');
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

  const hasArticle = await user.hasArticle(article);

  if (!hasArticle)
  {
    res.send({ error: "This article doesn't belongs to you." });
    return;
  }

  let image = await db.Image.findOne({ where: { id: imageId } });

  const hasImage = await article.hasImage(image);

  if (!hasArticle)
  {
    res.send({ error: "This image doesn't belongs to your article." });
    return;
  }

  image.data = new Buffer.alloc(data.length, data, 'base64');
  image.base64 = data;

  await image.save();

  res.send({});
}));

module.exports = router;
