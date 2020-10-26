const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../../../models/index');
const { Op } = require("sequelize");
const ash = require('express-async-handler');

const bcrypt = require('bcrypt');
const salt = 10;

const Joi = require('joi');

const autoLogger = require('../../../middleware/autoLogger');
router.all('/*', ash(autoLogger) );
router.all('/*', ash(async (req, res, next) => {
  if (!req.user)
  {
    res.send({ error: "You are not connected." });
    return;
  }
  next();
}));

const newUserSchema = Joi.object({
  username: Joi.string().min(4).max(16),
  email: Joi.string().email({ tlds: { allow: false } }),

  firstname: Joi.string().min(4).max(16),
  lastname: Joi.string().min(4).max(16),
  address: Joi.string().max(256),
  latitude: Joi.number(),
  longitude: Joi.number(),

  password: Joi.string().min(8).max(256),

  avatar: Joi.string().max(50000)
});

router.post('/', ash(async (req, res, next) => {
  const { user } = req;
  const { newUser } = req.body;

  let val = newUserSchema.validate(newUser);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }

  if (newUser)
  {
    for ( let [entry, value] of Object.entries(newUser))
    {
      if (entry !== 'password' && entry !== 'avatar') user[entry] = value;
    }
    await user.save();
  }
  else
  {
    res.send( { error: "New info are missing!" } );
    return;
  }

  if (newUser.avatar)
  {
    let avatar = await user.getAvatar();

    avatar.data = new Buffer.alloc(newUser.avatar.length, newUser.avatar, 'base64');
    await avatar.save();
  }

  if (newUser.password)
  {
    let secret = await user.getUserSecret();

    const hash = await bcrypt.hash(newUser.password, salt);

    secret.password = hash;
    await secret.save();
  }

  res.send( { succes: true } );
}));

module.exports = router;
