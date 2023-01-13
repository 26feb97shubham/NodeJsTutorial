const mongoose = require('mongoose');
const schema = mongoose.Schema;

var UserSchema = new schema({
    name: String,
    email:String,
    age:Number
});

module.exports = mongoose.model("Users", UserSchema);