const Listing = require('../models/listing.js');

// Index page
module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs', {allListings});
};

// render new Listing Form
module.exports.renderNewForm = (req,res) =>{
    res.render('./listings/newListing.ejs');
};

// Show Listing
module.exports.showListing = async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id).populate({path : 'reviews', populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist.");
        return res.redirect('/listings');
    }
    return res.render('./listings/show.ejs', {listing});
};

// Create new Listing
module.exports.createListing = async (req,res,next)=>{
    // let {title, description, image, price, location, country} = req.body; 
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send a valid data for listing..")
    // }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect('/listings');
};

// Edit Listing Form
module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist.");
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', {listing});
};

// Edit Listing
module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    if(!req.body.listing){
        throw new ExpressError(400, "Send a valid data for listing..")
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(req.body.listing);
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

// Delete Listing
module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "Listing Deleted Successfully")
    res.redirect('/listings');
};