const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/tripnest";
main().then(()=>{
    console.log('MongoDB Connected Successfully');
}).catch((err)=>{
    console.group('MongoDB Have Some Errors.');
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner : "6a2d41ac2e43f487f6418bc3"}));
    await Listing.insertMany(initData.data);
    console.log("Data was Initialized.")
}

initDB();