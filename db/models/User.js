const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", UserSchema);
