const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

const port = 8080;
const app = express();

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

app.get('/testListing', async (req,res)=>{
    let sampleListing = new Listing({
        title:"My New Villa",
        description:"By the Beach",
        price:1200,
        location:"Juhu Beach Goa",
        country:"India"
    })
    await sampleListing.save();
    console.log("Sample Data Saved");
    res.send("Successful Testing");
})
