const express=require('express');
const  router=express.Router();
const catchAsync=require('../utils/catchAsync');
const campgrounds=require('../controllers/campgrounds')
const{campgroundSchema,reviewSchema}=require('../schemas.js')
const Campground=require('../models/campground')
const {isLoggedin}=require('../middlewareAuth')
const {isAuthor}=require('../middlewareAuth')
const {validateCampground}=require('../middlewareAuth');
const { populate } = require('../models/review');
const multer = require('multer');
const{storage}=require('../cloudinary');
const upload=multer({storage})



router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedin,upload.array('image'),/*validateCampground,*/catchAsync(campgrounds.createCampground))

router.get('/new',isLoggedin,campgrounds.newForm)
router.get('/:id/edit',isLoggedin,isAuthor,catchAsync(campgrounds.editCampgrounds));

router.route('/:id')
.get(isLoggedin,campgrounds.showCampground)
.put(isLoggedin,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
.delete(isAuthor,campgrounds.deleteCampground);


module.exports=router;
