const mongoose = require("mongoose");

const PointSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please enter a name for this new list"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("point", PointSchema);
