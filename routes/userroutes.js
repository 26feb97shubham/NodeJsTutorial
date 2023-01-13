const express = require('express');
const router = express.Router();
const {getDb}  = require('../mydb');

const User = require('../models/usermodel');

/** creating a new user */
router.post('/createUser', (req, res, next)=>{
    const user = new User({
        name: "Hello from mongodb",
        gender: "Hello from mongodb",
        age: 55
    });

    user.save()
    .then(result => {
        console.log(result);
        res.send(result);
    })
    .catch(err => {
        console.log(err.message);
    })

    /**Mongo Db Saving the data */
    // let data = {
    //     name: "Hello from mongodb",
    //     gender: "Hello from mongodb",
    //     age: 55
    // };
    // getDb().collection('users').insertOne(data, (err, result) => {
    //         if(!err){
    //             res.send(result);
    //         }else{
    //             console.log(err)
    //             res.send(err);
    //         }
    //     }
    // )

})

/** get the list of all the users from the database */
router.get('/users', async (req, res, next) => {
    try {
        const results = await User.find();
        res.send({
            status : 200,
            data : results
        })
    } catch(error){
        console.log(error.message)
    }
})


/**Update the value of user using his id */
router.post('/updateUser', (req, res, next) => {
    try{
       //console.log(req.body.id);
       
        const id = req.body.id;
        const updatedData = req.body;
        
        User.findByIdAndUpdate(id, updatedData, function(err, result){
            if (err){
                console.log(err)
            }else{
                res.send({
                    status : 200,
                    message : "Data updated successfully"
                })
            }
        });
    }catch(error){
        console.log(error.message)
    }
})

/** Delete a user using id */
router.post('/deleteUser', (req, res, next)=> {
    try{
        const id = req.body.id;

        User.findByIdAndDelete(id, function(err, result){
            if (err){
                console.log(err)
            }else{
                res.send({
                    status : 200,
                    message : "Data deleted successfully"
                })
            }
        })
    }catch(error){
        console.log(error.message);
    }
})

module.exports = router