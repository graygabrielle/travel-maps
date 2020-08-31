const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../db/models/User");
const jwt = require("jsonwebtoken");

//protect routes
// exports.protect = asyncHandler(async (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }

//   return next(new ErrorResponse("Not authorized to access this route", 401));
// });

//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  console.log("got to protect");
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else {
    console.log("no cookie");
  }

  // make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    req.trips = await Trip.find({ user: req.user._id });
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

//grant access to admins
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log("got into authorize");

    if (!roles.includes(req.user.role)) {
      res.status(401).send(`${req.user.role} unauthorized`);
    }
    next();
  };
};

//grant access to specific roles
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorResponse(
//           `${req.user.role} role is unauthorized to access this route`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };
