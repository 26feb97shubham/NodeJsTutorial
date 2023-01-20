const mongoose = require('mongoose');
const schema = mongoose.Schema;

var UserSchema = new schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:String,
    firstname:String,
    lastname:String,
    email: {type:String, unique:true},
    mobileNumber:Number,
    password:String,
    phoneOTP:String,
    emailOTP:String,
    status:Number, 
    token:String
});

module.exports = mongoose.model("Users", UserSchema);