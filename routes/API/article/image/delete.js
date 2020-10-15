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

router.get('/', ash(async (req, res, next) => {
  let { imageId, articleId } = req.query;

  if (!imageId)
  {
    res.send({ error: "There is no imageId" });
    return;
  }
  imageId = parseInt(imageId);
  if (!articleId)
  {
    res.send({ error: "There is no articleId" });
    return;
  }
  articleId = parseInt(articleId);

  const article = user.getArticles({ where: { id: articleId } });

  if (!article)
  {
    res.send({ error: "This article not belongs to you" });
    return;
  }

  await db.Image.destroy({
    where: {
      [Op.and]: [
        { id: imageId },
        { ArticleId: articleId }
      ]
    }
  });

  res.send( {} );
}));

module.exports = router;
