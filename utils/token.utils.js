const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

var createToken = function (auth) {
  return jwt.sign(
    {
      id: auth.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

module.exports = {
  generateToken: function (req, res, next) {
    req.token = createToken(req.auth);
    return next();
  },
  sendToken: function (req, res) {
    // res.setHeader("x-auth-token", req.token);
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    console.log("sending token", req.token);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", true);
    return res.status(200).cookie("token", req.token, options).json({
      success: true,
      user: req.user,
      trips: req.trips,
    });
  },
};
