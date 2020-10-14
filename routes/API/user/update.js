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
    res.send({ "You are not connected." });
    return;
  }

  let avatar = await req.user.getAvatar();
  req.user.Avatar = avatar;
  res.send(user);

  next();
}));

const newUserSchema = Joi.object({
  username: Joi.string().min(4).max(16),
  email: Joi.string().email({ tlds: { allow: false } }),

  firstname: Joi.string().min(4).max(16),
  lastname: Joi.string().min(4).max(16),
  address: Joi.string().max(256),
  lattitude: Joi.float(),
  longitude: Joi.float(),
});

const newPasswordSchema = Joi.object({
  password: Joi.string().min(8).max(256)
});

const newAvatarSchema = Joi.object({
  avatar: Joi.string().max(50000)
});

router.post('/', ash(async (req, res, next) => {
  const { user } = req;
  const { newUser, newPassword, newAvatar } = req.body;

  let val = newUserSchema.validate(newUser);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }

  val = newPasswordSchema.validate(newPassword);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }
  
  val = newAvatarSchema.validate(newAvatar);
  if (val.error)
  {
    res.send({ error: val.error.details[0].message });
    return;
  }

  if (newUser)
  {
    for (let entry of Object.entries(newUser)) user[entry] = newUser[entry];
    await user.save();
  }

  if (newAvatar)
  {
    user.avatar.data = new Buffer.alloc(newAvatar.length, newAvatar, 'base64');
    await user.avatar.save();
  }

  if (newPassword)
  {
    let secret = await user.getUserSecret();

    secret.password = newPassword;
    await secret.save();
  }

  res.send(user);
}));

module.exports = router;
