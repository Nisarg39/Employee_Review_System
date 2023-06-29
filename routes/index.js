const express = require('express');
const router = express.Router();
const passport = require('passport');

const homecontroller= require('../controller/homecontroller');

router.get('/', passport.checkAuthentication, homecontroller.home);

router.use('/users', require('./users'));

module.exports = router;
