const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');


// const autoLogger = require('../../../middleware/autoLogger');
// router.all('/', ash(autoLogger) );
// router.all('/', ash(async (req, res, next) => {
//   if (!req.user)
//   {
//     res.send({ error: "You are not connected!" })
//     return;
//   }
//   next();
// }));

router.get('/search', ash(async (req, res, next) => {
  let { words, categories, sousCategories, page, max } = req.query;

  if (!page) page = 1;
  page = parseInt(page);

  if (!max) max = 20;
  max = parseInt(max);
  if (max > 20)
  {
    res.send( { error: "Max per page is 20" } );
    return;
  }

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
    where: where,
    limit: max,
    offset: (page-1) * max,
    include: {
      model: db.Image,
      attributes: ['id']
    }
  });

  res.send( articles );
}));


module.exports = router;