const jwt = require("jsonwebtoken") // (Unique ID)


const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRATE, {
        expiresIn : "30d"  // Token will expire in 1 hour
    });
};


module.exports = generateToken;