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
  let { user, article, images } = req.body;

  const validateArticleSchema = articleSchema.validate(article);

  if (validateArticleSchema.error)
  {
    res.send({ error: validateArticleSchema.error.details[0].message });
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