const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _passportLocalMongoose = require('passport-local-mongoose');
const passportLocalMongoose = _passportLocalMongoose && _passportLocalMongoose.default ? _passportLocalMongoose.default : _passportLocalMongoose;

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema)