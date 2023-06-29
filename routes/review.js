const express = require('express');
const router = express.Router();
const passport = require('passport');

const review_controller= require('../controller/review_controller');

router.get('/:id',passport.checkAuthentication, review_controller.view);

router.post('/assign', passport.checkAuthentication, review_controller.assign);

router.get('/all/:id', passport.checkAuthentication, review_controller.revieweeList);

router.get('/delete/:id', passport.checkAuthentication, review_controller.deleteReview );

router.post('/reviewed', passport.checkAuthentication, review_controller.reviewed)

module.exports = router;