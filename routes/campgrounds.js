const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controller/campground');
const {isLoggedin,isAuthor,ValidateCampground} = require('../middleware');
const campground = require('../models/campground');
const {storage}=require('../cloudinary/index');
const multer = require('multer')
const upload = multer({storage})
//router.use('/campgrounds/new',morgan('tiny'))
router.route('/')
.get(campgrounds.index)
.post(isLoggedin,upload.array('image'),ValidateCampground,catchAsync(campgrounds.addNewCampground))

router.get('/new',isLoggedin,campgrounds.renderNewForm)
router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isLoggedin,isAuthor,upload.array('image'),ValidateCampground,catchAsync(campgrounds.updateCampground))
.delete(isLoggedin,isAuthor,catchAsync(campgrounds.deleteCampground))
router.get('/:id/edit',isLoggedin,isAuthor,catchAsync(campgrounds.renderEditForm))
module.exports = router ;