const User = require("../models/usermodel");
const { hashData, verifyHashedData, hashDataForgotPassword } = require("..//utils/hashData");
const { generateOTP, fast2sms } = require("../utils/otp.utils");
const { createToken } = require("../utils/createToken")
const { default: mongoose } = require('mongoose');
const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");

const createNewUser = async (data, res, next) =>{
    try {
        const { username, firstname, lastname, email, phoneNumber, password } = data;
        //Checking if user already exists
        const exixtingUser = await User.findOne({email});
        if(exixtingUser){
            throw Error("User with provided email alrteady exists");
        }

        //Hash Password
        const hashedPassword = await hashData({password});
        const otp = generateOTP(5);
        // send otp to phone number
       fast2sms(
           {
             message: `Your OTP is ${otp}`,
             contact: phoneNumber,
           },
           next
         );
        console.log(otp);
        
        const newUser = new User({
            _id: new mongoose.Types.ObjectId,
            username:username,
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:hashedPassword,
            phoneOTP:otp,
            emailOTP:"",
            mobileNumber:phoneNumber
        });

        //Save User in database
        const createdUser = await newUser.save()
        .then(result => {
            res.render('otpscreen', {
                phoneNumber, otp
            })
        }).catch(err => {
            res.status(500).json({
                error:err.message
            })
        });
        return createdUser;
    } catch (error) {
        throw error;
    }
}

const authenticateUser = async (data, req, res, next) => {
    try {
        const { username, password } = data;

        const fetchedUser = await User.findOne({username});
        let usersList = await User.find();
        
        if(!fetchedUser){
            throw Error("Invalid Credentials entered!");
        }

        const hashedPassword = fetchedUser.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if(!passwordMatch){
            throw Error("Invalid password match")
        }

        //create user token 
        const tokenData = {userId: fetchedUser._id, username};
        const token = await createToken(tokenData);

        //assign user token
        fetchedUser.token = token;
        req.session = fetchedUser._id;
        res.render('admin_panel_index', {
            users : usersList
        });
        return fetchedUser;
    } catch (error) {
        throw error;
    }
}


const sendMail = async (data, req, res, next) => {
    const { email } = data
    console.log(email);
    try {

        const fetchedUser = await User.findOne({email});
        if(!fetchedUser){
            throw Error("Invalid Credentials entered!");
        }

        const otp = generateOTP(5);

        const updatedData = { emailOTP: otp };
        console.log("updatedData: ", updatedData);

        // const user = User.findOneAndUpdate(filter, updatedData, {
        //     new: true
        //   });


        User.findByIdAndUpdate(fetchedUser._id, {emailOTP : otp}, function(err, data){
            if(err){
                console.log(err);
                console.log(err.message);
            }else{
                console.log("Data Updated");
            }
        })

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "sjain01ajmer@gmail.com", // generated ethereal user
            pass: "bmcihcugrtvarxdu", // generated ethereal password
          },
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: "sjain01ajmer@gmail.com", // sender address
          to: email, // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: `<h1>Email Confirmation</h1>
          <h2>Hello ${fetchedUser.username}</h2>
          <p>Thank you for registering.</p>
          <p>Your verification code is ${otp}</p>`, // html body
        }).catch(err => console.log(err));

        res.render('forgotPasswordOTP', {
            email, otp
        });
        return info;

    } catch (error) {
        throw error;
    }
}

module.exports = { createNewUser, authenticateUser, sendMail };