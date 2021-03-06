const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const User = require("../../db/models/User");

//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, trips) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    trips,
  });
};
