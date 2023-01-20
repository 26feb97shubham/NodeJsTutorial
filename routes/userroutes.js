const express = require('express');
const router = express.Router();
const {getDb}  = require('../mydb');
const { hashData, verifyHashedData, hashDataForgotPassword } = require("..//utils/hashData");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const { createNewUser, authenticateUser, sendMail } = require("../controllers/controller");

const User = require('../models/usermodel');
const { default: mongoose } = require('mongoose');
const { generateOTP, fast2sms } = require("../utils/otp.utils");

/** creating a new user */
router.post('/createUser', async (req, res, next)=>{

    try {
        let{username, firstname, lastname,phoneNumber, email, password, confirmPassword} = req.body;
        username = username.trim();
        firstname = firstname.trim();
        lastname = lastname.trim();
        phoneNumber = phoneNumber.trim();
        email = email.trim();
        password = password.trim();
        confirmPassword = confirmPassword.trim();
    
        if(!(username && firstname && lastname && phoneNumber && email && password && confirmPassword)){
            throw Error("Empty input fields");
        }else if(/!^[A-Za-z][A-Za-z0-9_]{7,29}$/.test(username)){
            throw Error("Invalid Username entered");
        }else if(/!^[a-zA-Z]{2-15}/.test(firstname)){
            throw Error("Invalid Firstname entered");
        }else if(/!^[a-zA-Z]{2-15}/.test(lastname)){
            throw Error("Invalid LastName entered");
        }else if(/!^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            throw Error("Invalid Email entered");
        }else if(password.length<8){
            throw Error("Password is too short");
        }else if(!password===confirmPassword){
            throw Error("Password doesn't match");
        }else{
            await createNewUser({username,firstname, lastname,email, phoneNumber, password}, res, next);
        }
    } catch (error) {
        throw error; 
    }

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

/** Login User  */
router.post('/login', async (req, res, next) => {
    try {
        let { username, password } = req.body;
        username = username.trim();
        password = password.trim();

        if(!(username && password)){
            throw Error("Empty input fields");
        }

        await authenticateUser({username, password}, req, res, next);

    } catch (error) {
        throw error
    }
})


router.post('/otpVerify', async (req, res, next) =>{
    try{
        var otp = ""
        var otpfeild1 = req.body.otpfeild1;
        var otpfeild2 = req.body.otpfeild2;
        var otpfeild3 = req.body.otpfeild3;
        var otpfeild4 = req.body.otpfeild4;
        var otpfeild5 = req.body.otpfeild5;
        otp = otpfeild1+otpfeild2+otpfeild3+otpfeild4+otpfeild5
        var mobileNumber = req.body.mobileNumber;
        let user1 = await User.findOne({ mobileNumber: mobileNumber });
        console.log(otp);
        console.log(mobileNumber);
        if(user1){
            if(otp===user1.phoneOTP){
                res.render('login')
            }
        }
    }catch(error){
        res.status(500).json({
            msg:error.message
        })
    }
})


router.post('/forgotpassword', async (req, res, next)=>{
    try {
        let { email } = req.body
        email = email.trim();

        if(!email){
            throw Error("Empty input fields");
        }

        await sendMail({email}, req, res, next);

    } catch (error) {
        res.status(500).json({
            msg:error.message
        })
    }
})

router.post('/otpVerifyForgotPassword', async (req, res, next) => {
    try {

        let { otpfeild1, otpfeild2, otpfeild3, otpfeild4,otpfeild5, email} = req.body

        if(!(otpfeild1 && otpfeild2 && otpfeild3 && otpfeild4 && otpfeild5)){
            throw Error("Empty input fields");
        }
        otpfeild1 = otpfeild1.trim();
        otpfeild2 = otpfeild2.trim();
        otpfeild3 = otpfeild3.trim();
        otpfeild4 = otpfeild4.trim();
        otpfeild5 = otpfeild5.trim();
        email = email.trim();

        console.log("email: ",email)

        var otp = "";
        otp = otpfeild1+otpfeild2+otpfeild3+otpfeild4+otpfeild5;
        let user1 = await User.findOne({ email: email });

        if(!user1){
            throw Error("User doesn't exists");
        }

        if(user1.emailOTP === otp){
            res.render('resetPassword', {
                userId : user1._id
            });
        }

    } catch (error) {
        res.status(500).json({
            msg:error.message
        })
    }
})

router.post('/resetPassword', async (req, res, next) => {
    try {
        let { new_password, confirm_password, userId} = req.body

        new_password = new_password.trim();
        confirm_password = confirm_password.trim();
        userId = userId.trim();

        if(!(new_password && confirm_password)){
            throw Error("Empty input fields");
        }else if(new_password.length<8){
            throw Error("Password is too short");
        }else if(!new_password===confirm_password){
            throw Error("Password doesn't match");
        }else{
            let user1 = await User.findOne({ _id: userId });

            if(!user1){
                throw Error("User doesn't exists");
            }

            const hashedPassword = await hashDataForgotPassword({new_password});

            User.findByIdAndUpdate(userId, {password : hashedPassword}, function(err, data){
                if(err){
                    console.log(err);
                    console.log(err.message);
                }else{
                    console.log("Data Updated");
                }
            })
            res.render('login');
        }
    } catch (error) {
        throw error;
    }
})

router.post('/logout', (req, res, next) => {
    try{
        req.session.destroy();
        console.log(req.session);
        res.redirect("/login");
    }catch(error){
        res.status(500).json({
            msg:error.message
        })
    }
})


module.exports = router