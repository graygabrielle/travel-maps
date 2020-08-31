const router = require("express").Router();

//require routes
const listRoutes = require("./listRoutes");
const pointRoutes = require("./pointRoutes");
const tripRoutes = require("./tripRoutes");
const userRoutes = require("./userRoutes");

//use routes
router.use("/api/list", listRoutes);
router.use("/api/point", pointRoutes);
router.use("/api/trip", tripRoutes);
router.use("/api/user", userRoutes);

module.exports = router;
