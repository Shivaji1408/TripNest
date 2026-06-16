const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage})


// index Route
// Create New listing route
router.route('/')
    .get(wrapAsync(listingController.index))
    // .post(upload.single('listing[image]'),wrapAsync(listingController.createListing));
    .post(validateListing, upload.single('listing[image]'),wrapAsync(listingController.createListing));

// Create form route
router.get('/new', isLoggedIn, listingController.renderNewForm);

// Show Route
// Edit Route
router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,upload.single('listing[image]') ,validateListing,wrapAsync(listingController.editListing));



// Edit form Route
router.get('/:id/edit', isLoggedIn, isOwner ,wrapAsync(listingController.renderEditForm));


// Delete route
router.delete('/:id/delete', isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;