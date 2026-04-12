const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const port = 8080;
const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));

main().then(()=>{
    console.log('MongoDB Connected Successfully');
}).catch((err)=>{
    console.group('MongoDB Have Some Errors.');
    console.log(err);
})

async function main(){
    mongoose.connect('mongodb://localhost:27017/tripnest');
}

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});

// Handling Routes Here
app.get('/', (req,res)=>{
    res.send("Working server");
})

app.get('/listings/new', (req,res) =>{
    res.render('./listings/newListing.ejs');
})

app.get('/listings/:id', async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('./listings/show.ejs', {listing});
})

app.post('/listings', async (req,res)=>{
    // let {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
})

app.get('/listings/:id/edit', async (req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing});
})

app.put('/listings/:id',async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(req.body.listing);
    res.redirect(`/listings/${id}`);
})

app.delete('/listings/:id/delete', async (req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect('/listings');
})

// app.get('/testListing', async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Juhu Beach Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("Sample Data Saved");
//     res.send("Successful Testing");
// })

app.get('/listings',async (req,res) =>{
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs', {allListings});
})

