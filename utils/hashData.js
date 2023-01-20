const bcrypt = require("bcrypt");

const hashData = async (data, saltRounds = 10) => {
    try {
        console.log(data);
        const {password} = data;
        const hashedData = await bcrypt.hash(password, saltRounds);
        return hashedData;
    } catch (error) {
        throw error;
    }
}

const hashDataForgotPassword = async (data, saltRounds = 10) => {
    try {
        console.log(data);
        const {new_password} = data;
        const hashedData = await bcrypt.hash(new_password, saltRounds);
        return hashedData;
    } catch (error) {
        throw error;
    }
}


const verifyHashedData = async (unhashed, hashed) => {
    try {
        const match = await bcrypt.compare(unhashed, hashed);
        return match;
    } catch (error) {
        throw error;
    }
}

module.exports = { hashData, verifyHashedData, hashDataForgotPassword };