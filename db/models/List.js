const mongoose = require("mongoose");

const ListSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please enter a name for this new list"],
  },
  color: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("list", ListSchema);
