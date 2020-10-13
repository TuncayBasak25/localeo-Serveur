const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');


const Joi = require('joi');

router.get('/', ash(async (req, res, next) => {
  let { words } = req.query;

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
          [Op.substring]: word
        }
      });
    }
  }

  let articles = await db.Article.findAll({
    where: where,
    include: db.Image
  });

  for (let i=0; i<articles.length; i++)
  {
    if (articles[i].Images)
    {
      for (let j=0; j<articles[i].Images.length; j++)
      {
        articles[i].Images[j].data = articles[i].Images[j].data.toString('base64');
        articles[i].Images[j].dataNo64 = articles[i].Images[j].data;
      }
    }
  }

  res.send(articles);
}));

module.exports = router;
