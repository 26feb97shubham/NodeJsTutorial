const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
var url = "mongodb://127.0.0.1:27017/testDb";

var db = null;
module.exports = {
    connect:()=>{
        // MongoClient.connect(url,(err,connection)=>{
        //     if(err){
        //         throw err;
        //     }else{
        //         db = connection.db();
        //         console.log("Db connected");
        //     }
        // })
        mongoose.set('strictQuery', false);
        mongoose.connect(url, {
        useNewUrlParser: true,
    }).then(() => {
        console.log("Connected to mongodb");
    }).catch((err) => console.log(err));
    },
    getDb:()=>{
        return db;
    }
}

