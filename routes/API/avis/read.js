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

router.get('/avisFor', ash(async (req, res, next) => {
  let { destinaterId, page, max } = req.query;

  if (!destinaterId)
  {
    res.send({ error: "There is no destinaterId" });
    return;
  }
  destinaterId = parseInt(destinaterId);

  if (!page) page = 1;
  page = parseInt(page);

  if (!max) max = 20;
  max = parseInt(max);
  if (max > 20)
  {
    res.send( { error: "Max per page is 20" } );
    return;
  }

  let destinater = await db.User.findOne({ where: { id: destinaterId } });

  if (!destinater)
  {
    res.send({ error: "Destinater doesn't exist." });
    return;
  }

  let avisList = await db.Avis.findAll({
    where: {
      DestinaterId: destinaterId
    },
    limit: max,
    offset: (page-1) * max
  });

  res.send( avisList );
}));

router.get('/avisFrom', ash(async (req, res, next) => {
  let { posterId, page, max } = req.query;

  if (!posterId)
  {
    res.send({ error: "There is no posterId" });
    return;
  }
  posterId = parseInt(posterId);

  if (!page) page = 1;
  page = parseInt(page);

  if (!max) max = 20;
  max = parseInt(max);
  if (max > 20)
  {
    res.send( { error: "Max per page is 20" } );
    return;
  }

  let poster = await db.User.findOne({ where: { id: posterId } });

  if (!poster)
  {
    res.send({ error: "Poster doesn't exist." });
    return;
  }

  let avisList = await db.Avis.findAll({
    where: {
      PosterId: posterId
    },
    limit: max,
    offset: (page-1) * max
  });

  res.send( avisList );
}));

module.exports = router;
