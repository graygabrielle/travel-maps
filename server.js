const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/dbConfig");
const router = require("./server/routes");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xssPrevention = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const passport = require("passport");

//load env vars
dotenv.config({ path: "./config/config.env" });

require("./config/passport")(passport);

//Connect to MongoDB
connectDB();

const app = express();

//cookie parser middleware
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//body parser middleware
app.use(express.json());

//allow CORS
var corsOption = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOption));

// app.options("/*", function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, Content-Length, X-Requested-With"
//   );
//   res.sendStatus(200);
// });

// app.use(
//   session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: false
//   })
// );

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//sanitize data to prevent NoSQL injections
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent cross site scripting attacks
app.use(xssPrevention());

//rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 minutes
  max: 100,
});
// app.use(limiter);

//prevent http param pollution
app.use(hpp());

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//point app to routes
app.use("/", router);

//init custom error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.underline);
  //close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
