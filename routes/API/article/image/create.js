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
  let { image } = req.body;

  if (!image.data || typeof image.data !== 'string')
  {
    res.send({ error: "Image is null or not in Base64 format" });
    return;
  }

  if (!image.articleId || isNaN(image.articleId))
  {
    res.send({ error: "There is no articleId" });
    return;
  }
  image.articleId = parseInt(image.articleId);

  let article = await db.Article.findOne({ where: { id: image.articleId } });

  const possede = await user.hasArticle(article);

  if (!possede)
  {
    res.send({ error: "This article doesn't belongs to you." });
    return;
  }

  await article.createImage({ data: new Buffer.alloc(image.data.length, image.data, 'base64'), base64: image.data });

  res.send({ success: true });
}));

module.exports = router;
