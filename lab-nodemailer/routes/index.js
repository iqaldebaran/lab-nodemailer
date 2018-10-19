const express = require('express');
const router  = express.Router();
const mailer = require("../helpers/mailer")


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



module.exports = router;
