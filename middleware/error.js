const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (error, req, res, next) => {
  let err = { ...error };

  err.message = error.message;

  //log to console for developer
  console.log(error);

  //mongoose bad ObjectId
  if (error.name === "CastError") {
    const message = `Resource not found`;
    err = new ErrorResponse(message, 404);
  }

  //mongoose duplicate key
  if (error.code === 11000) {
    const message = "Duplicate field value entered";
    err = new ErrorResponse(message, 400);
  }

  //mongoose validation error
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((val) => val.message);
    err = new ErrorResponse(message, 400);
  }

  res
    .status(err.statusCode || 500)
    .json({ success: false, error: err.message || "Server error" });
};

module.exports = errorHandler;
