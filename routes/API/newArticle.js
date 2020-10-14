const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const Joi = require('joi');

const articleSchema = Joi.object({
  title: Joi.string().min(4).max(16).required(),
  description: Joi.string().min(4).max(255).required(),
  price: Joi.number().integer().min(1).max(1000).required(),
  geolocation: Joi.string(),
  categories: Joi.string()
});

//Log test
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
    res.send({ error: "You are not connected." });
    return;
  }
  req.body.user = user;
  next();
}));

router.post('/', ash(async (req, res, next) => {
  let { user, article } = req.body;

  const validateArticleSchema = articleSchema.validate(article);

  if (validateArticleSchema.error)
  {
    res.send({ error: validateArticleSchema.error.details[0].message });
    return;
  }

  article = await db.Article.create(article);
  await user.addArticle(article);

  res.send({ id: article.dataValues.id});
}));

router.post('/addArticleImage', ash(async (req, res, next) => {
  const { articleId, data } = req.body;

  const article = await db.Article.findOne({ where: { id: articleId } });

  if (!article)
  {
    res.send({error: "There is no article"});
    return;
  }
  const image = await db.ImageText.create({ data: data });

  await article.addImageText(image);

  res.send({ id: image.dataValues.id });
}));

router.post('/CompleteArticleImage', ash(async (req, res, next) => {
  const { imageId, data } = req.body;

  const image = await db.ImageText.findOne({ where: { id: imageId } });

  if (!image)
  {
    res.send({error: "There is no image"});
    return;
  }

  image.data = image.dataValues.data + data;

  await image.save();

  res.send({ id: image.dataValues.id });
}));


// for(let i=0; i < images.length; i++)
// {
//   let image = images[i];
//   if (image)
//   {
//     const imgText = await db.ImageText.create( { data: image } );
//     image = new Buffer.alloc(image.length, image, 'base64');
//     image = await db.Image.create({ data: image });
//     await article.addImageText(imgText);
//     await article.addImage(image);
//   }
// }
module.exports = router;
