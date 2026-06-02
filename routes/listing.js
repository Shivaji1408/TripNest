const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const {listingSchema} = require('../schema.js')


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }else{
        next();
    }
}


router.get('/',wrapAsync(async (req,res) =>{
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs', {allListings});
}))

// Create form route
router.get('/new', (req,res) =>{
    res.render('./listings/newListing.ejs');
})

// Show Route
router.get('/:id', wrapAsync(async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id).populate('reviews');
    res.render('./listings/show.ejs', {listing});
}))


// Create New listing route
router.post('/', validateListing, wrapAsync(async (req,res,next)=>{
    // let {title, description, image, price, location, country} = req.body; 
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send a valid data for listing..")
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect('/listings');
    })
);

// Edit form Route
router.get('/:id/edit', wrapAsync(async (req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing});
}))

// Edit Route
router.put('/:id',wrapAsync(async (req,res)=>{
    let {id} = req.params;
    if(!req.body.listing){
        throw new ExpressError(400, "Send a valid data for listing..")
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(req.body.listing);
    res.redirect(`/listings/${id}`);
}))

// Delete route
router.delete('/:id/delete', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect('/listings');
}))

module.exports = router;