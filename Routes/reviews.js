
const express = require('express');
const  router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Review=require('../models/review');
const{campgroundSchema,reviewSchema}=require('../schemas.js')
const Campground=require('../models/campground')
const {validateReview,isLoggedin,isReviewAuthor}=require('../middlewareAuth');
const { request } = require('express');
const reviews=require('../controllers/reviews')

router.post('/',validateReview,isLoggedin,catchAsync(reviews.createReview))
router.delete('/:reviewId',isLoggedin,isReviewAuthor,catchAsync(reviews.deleteReview))
module.exports=router;