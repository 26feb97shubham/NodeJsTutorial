const fast2sms = require("fast-two-sms");
const {FAST2SMS} = require("../config");

exports.generateOTP = (otp_length) => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

exports.fast2sms = async (data, next) => {
  try {
    const {message, contact} = data
    console.log(message);
    console.log(contact);
    await fast2sms.sendMessage({
      authorization: 'ySdVcoWCf1LRmZ3Ipb5uk4xjUThtQvAs09al7N6GJEXKOgHwqY6rTc71tzhJdkNOVuiZnXqoeHGa3U2E',
      message,
      numbers: [contact],
    });
  } catch (error) {
    next(error);
  }
};