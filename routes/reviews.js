const express = require('express');
const router = express.Router({mergeParams:true});
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controller/reviews');
const {ValidateReviewSchema,isLoggedin,isReviewAuthor} = require('../middleware');

router.post('/',ValidateReviewSchema,isLoggedin,reviews.createReview)
router.delete('/:reviewId',isLoggedin,isReviewAuthor,reviews.deleteReview)
module.exports = router ;