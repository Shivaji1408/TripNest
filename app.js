// required files
const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const {listingSchema, reviewSchema} = require('./schema.js')
const Review = require('./models/review.js')

const listings = require('./routes/listing.js')
const reviews = require('./routes/review.js')


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
    console.log(`server at : http://localhost:${port}`)
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



app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews)

app.use((req,res,next) =>{
    next(new ExpressError(404, "Page Not Found....."))
})
// app.use((err,req,res,next)=>{res.send("Something went wrong.....")})
app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong...."} = err;
    console.log(message);
    // res.status(statusCode).send(message);
    res.status(statusCode).render('listings/error.ejs', {message});
})