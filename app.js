const bodyParser = require('body-parser');
const express = require('express');
const cors = require("cors");
var path = require('path');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.static('public')); 
app.use('/images', express.static('images'));
app.use('/css', express.static('css'));

// /**Mongodb */
// const {connect} = require('./mydb');
// connect();
/**Mongoose connection */
const {connect} = require('./mydb');
connect();
const userroutes = require('./routes/userroutes');
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');

app.get('/admin', (req, res)=>{
    res.render('admin_panel_index');
})

app.get('/login', (req, res)=>{
    if(req.session){
        res.redirect('admin_panel_index')
    }else{
        res.render('login');
    }
})

app.get('/register', (req, res)=>{
    res.render('register');
})

app.get('/otpscreen', (req, res)=>{
    res.render('otpscreen');
})

app.get('/forgotpasswordOTP', (req, res)=>{
    res.render('forgotPasswordOTP');
})

app.get('/forgotpassword', (req, res)=>{
    res.render('forgot_password');
})

app.get('/resetPassword', (req, res)=>{
    res.render('resetPassword');
}) 

app.use('/', userroutes);

 app.listen(8080,'172.16.11.121', ()=>{
     console.log('Server started on port 8080.....')
 });