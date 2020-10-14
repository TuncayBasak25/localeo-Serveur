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

router.get('/search', ash(async (req, res, next) => {
  let { user } = req;
  let { words, categories, sousCategories } = req.query;

  let where = {};

  if (words && words !== '')
  {
    words = words.split(' ');

    where = {
      [Op.or]: []
    }

    for (let word of words)
    {
      where[Op.or].push({
        title: {
          [Op.iLike]: '%' + word + '%'
        }
      });
    }
  }

  if (categories && categories !== '')
  {
    categories = categories.split('-');

    where[[Op.and]] = [];

    for (let category of categories)
    {
      where[Op.and].push({
        category: category
      });
    }
  }

  if (sousCategories && sousCategories !== '')
  {
    sousCategories = sousCategories.split('-');

    if (!where[[Op.and]]) where[[Op.and]] = [];

    for (let sousCategory of sousCategories)
    {
      where[Op.and].push({
        sousCategory: sousCategory
      });
    }
  }

  let articles = await db.Article.findAll({
    where: where
  });

  res.send( articles );
}));
// 
// router.post('/getImage', ash(async (req, res, next) => {
//
// }));

module.exports = router;
