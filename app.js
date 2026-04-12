// required files
const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')

const port = 8080;
const app = express();

// middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});


// database connection
const MONGO_URL = "mongodb://localhost:27017/tripnest";
main().then(()=>{
    console.log('MongoDB Connected Successfully');
}).catch((err)=>{
    console.group('MongoDB Have Some Errors.');
    console.log(err);
})

async function main(){
    mongoose.connect(MONGO_URL);
}


// Handling Routes Here

// home Route
app.get('/', (req,res)=>{
    res.send("Working server");
})

// Show All Listings route
app.get('/listings',wrapAsync(async (req,res) =>{
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs', {allListings});
}))

// Create form route
app.get('/listings/new', (req,res) =>{
    res.render('./listings/newListing.ejs');
})

// Show Route
app.get('/listings/:id', wrapAsync(async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('./listings/show.ejs', {listing});
}))

// Create New listing route
app.post('/listings', wrapAsync(async (req,res,next)=>{
    // let {title, description, image, price, location, country} = req.body;
    if(!req.body.listing){
        throw new ExpressError(400, "Send a valid data for listing..")
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
    })
);

// Edit form Route
app.get('/listings/:id/edit', wrapAsync(async (req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing});
}))

// Edit Route
app.put('/listings/:id',wrapAsync(async (req,res)=>{
    let {id} = req.params;
    if(!req.body.listing){
        throw new ExpressError(400, "Send a valid data for listing..")
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(req.body.listing);
    res.redirect(`/listings/${id}`);
}))

// Delete route
app.delete('/listings/:id/delete', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect('/listings');
}))

app.use((req,res,next) =>{
    next(new ExpressError(404, "Page Not Found....."))
})
// app.use((err,req,res,next)=>{res.send("Something went wrong.....")})
app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong...."} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('listings/error.ejs', {message});
})